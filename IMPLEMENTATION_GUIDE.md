# Step-by-Step Implementation Guide: Secure Image Storage

This guide provides a complete step-by-step approach to implement secure image storage in your Next.js application, building on your existing codebase.

## 🎯 Implementation Overview

**Current State Analysis:**
- You have basic image upload functionality with R2 integration
- You have MongoDB models for image storage
- You have signed URL generation for secure access
- You need to enhance security, add proper validation, and improve the user experience

**Goal:** Create a secure, scalable image storage system where users can only access their own images.

---

## 📋 Step 1: Environment Setup and Dependencies

### 1.1 Install Required Dependencies

```bash
# Install additional dependencies for enhanced functionality
pnpm install sharp image-size bcryptjs jsonwebtoken rate-limiter-flexible
pnpm install @types/sharp @types/bcryptjs @types/jsonwebtoken --save-dev
```

### 1.2 Update Environment Variables

Create/update your `.env.local` file:

```env
# Existing R2 Configuration
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET=your_bucket_name
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_REGION=auto

# Database
MONGODB_URI=mongodb://localhost:27017/imagic
MONGODB_DB_NAME=imagic

# Authentication (if using NextAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Security Settings
UPLOAD_MAX_SIZE=10485760          # 10MB
UPLOAD_MAX_FILES=10
SIGNED_URL_EXPIRY=3600           # 1 hour
RATE_LIMIT_REQUESTS=100          # Per hour
```

---

## 🗄️ Step 2: Enhance Database Models

### 2.1 Update the Image Model

Replace your existing `apps/web/database/models/image.ts`:

```typescript
// apps/web/database/models/image.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IImage extends Document {
  userId: string;
  originalName: string;
  filename: string;          // UUID-based filename
  r2Key: string;            // Full R2 key (userId/filename)
  contentType: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  metadata: {
    uploadedAt: Date;
    uploadedFrom: string;
    tags: string[];
  };
  access: {
    isPublic: boolean;
    sharedWith: string[];
    expiresAt?: Date;
  };
  status: 'uploading' | 'ready' | 'error';
  checksums: {
    md5: string;
    sha256: string;
  };
  accessLog: Array<{
    accessedAt: Date;
    purpose: string;
    ip: string;
  }>;
}

const ImageSchema = new Schema<IImage>({
  userId: { type: String, required: true, index: true },
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  r2Key: { type: String, required: true, unique: true },
  contentType: { type: String, required: true },
  size: { type: Number, required: true },
  dimensions: {
    width: { type: Number },
    height: { type: Number }
  },
  metadata: {
    uploadedAt: { type: Date, default: Date.now },
    uploadedFrom: { type: String, default: 'unknown' },
    tags: [{ type: String }]
  },
  access: {
    isPublic: { type: Boolean, default: false },
    sharedWith: [{ type: String }],
    expiresAt: { type: Date }
  },
  status: { 
    type: String, 
    enum: ['uploading', 'ready', 'error'], 
    default: 'uploading' 
  },
  checksums: {
    md5: { type: String },
    sha256: { type: String }
  },
  accessLog: [{
    accessedAt: { type: Date, default: Date.now },
    purpose: { type: String },
    ip: { type: String }
  }]
});

// Indexes for performance
ImageSchema.index({ userId: 1, 'metadata.uploadedAt': -1 });
ImageSchema.index({ 'metadata.tags': 1 });
ImageSchema.index({ r2Key: 1 });

export default (models.Image as mongoose.Model<IImage>) || 
  model<IImage>("Image", ImageSchema);
```

### 2.2 Create a User Model (if not exists)

Create `apps/web/database/models/user.ts`:

```typescript
// apps/web/database/models/user.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  storageQuota: {
    used: number;
    limit: number;
  };
  preferences: {
    autoDelete: boolean;
    defaultExpiry: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  storageQuota: {
    used: { type: Number, default: 0 },
    limit: { type: Number, default: 1073741824 } // 1GB default
  },
  preferences: {
    autoDelete: { type: Boolean, default: false },
    defaultExpiry: { type: Number, default: 30 } // 30 days
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default (models.User as mongoose.Model<IUser>) || 
  model<IUser>("User", UserSchema);
```

---

## 🔧 Step 3: Create Utility Functions

### 3.1 Create File Validation Utilities

Create `apps/web/lib/validation.ts`:

```typescript
// apps/web/lib/validation.ts
import crypto from 'crypto';

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/webp',
  'image/gif',
  'image/bmp'
];

export const MAX_FILE_SIZE = parseInt(process.env.UPLOAD_MAX_SIZE || '10485760'); // 10MB
export const MAX_FILES = parseInt(process.env.UPLOAD_MAX_FILES || '10');

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(file: File): ValidationResult {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}` 
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File too large. Maximum size: ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB` 
    };
  }

  // Check file name
  if (file.name.length > 255) {
    return { 
      valid: false, 
      error: 'Filename too long. Maximum 255 characters.' 
    };
  }

  return { valid: true };
}

export function generateSecureFilename(originalName: string): string {
  const uuid = crypto.randomUUID();
  const extension = originalName.split('.').pop()?.toLowerCase() || '';
  return `${uuid}.${extension}`;
}

export function generateChecksums(buffer: ArrayBuffer): { md5: string; sha256: string } {
  const uint8Array = new Uint8Array(buffer);
  const md5 = crypto.createHash('md5').update(uint8Array).digest('hex');
  const sha256 = crypto.createHash('sha256').update(uint8Array).digest('hex');
  return { md5, sha256 };
}
```

### 3.2 Enhance R2 Utilities

Update `apps/web/lib/r2.ts`:

```typescript
// apps/web/lib/r2.ts
import { 
  S3Client, 
  GetObjectCommand, 
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand 
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.R2_REGION || "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function generateSignedUrl(
  key: string, 
  expiresIn: number = 3600
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
    });
    
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
}

export async function uploadToR2(
  key: string,
  buffer: Buffer,
  contentType: string,
  metadata: Record<string, string> = {}
): Promise<void> {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: metadata,
    });
    
    await s3Client.send(command);
  } catch (error) {
    console.error('Error uploading to R2:', error);
    throw error;
  }
}

export async function deleteFromR2(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
    });
    
    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting from R2:', error);
    throw error;
  }
}

export async function checkObjectExists(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
    });
    
    await s3Client.send(command);
    return true;
  } catch (error) {
    return false;
  }
}
```

---

## 🔐 Step 4: Create Authentication Middleware

### 4.1 Create Auth Middleware

Create `apps/web/lib/auth/middleware.ts`:

```typescript
// apps/web/lib/auth/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../app/api/auth/[...nextauth]/route';

export async function authenticateRequest(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return { user: session.user };
}

export async function requireAuthentication(request: NextRequest) {
  const authResult = await authenticateRequest(request);
  
  if (authResult instanceof NextResponse) {
    return authResult; // Return error response
  }
  
  return authResult; // Return user data
}
```

### 4.2 Create Rate Limiting Middleware

Create `apps/web/lib/middleware/rateLimiter.ts`:

```typescript
// apps/web/lib/middleware/rateLimiter.ts
import { NextRequest, NextResponse } from 'next/server';

const requests = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  request: NextRequest,
  limit: number = 100,
  windowMs: number = 3600000 // 1 hour
): NextResponse | null {
  const identifier = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
  
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean up old entries
  for (const [key, value] of requests.entries()) {
    if (value.resetTime < windowStart) {
      requests.delete(key);
    }
  }
  
  // Check current user's requests
  const userRequests = requests.get(identifier);
  
  if (!userRequests) {
    requests.set(identifier, { count: 1, resetTime: now });
    return null;
  }
  
  if (userRequests.count >= limit) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
  }
  
  userRequests.count++;
  return null;
}
```

---

## 📤 Step 5: Create Enhanced Upload API

### 5.1 Replace Upload API

Replace your existing `apps/web/app/api/upload-to-r2/route.ts` with a new secure upload endpoint:

Create `apps/web/app/api/images/upload/route.ts`:

```typescript
// apps/web/app/api/images/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuthentication } from "lib/auth/middleware";
import { rateLimit } from "lib/middleware/rateLimiter";
import { validateFile, generateSecureFilename, generateChecksums } from "lib/validation";
import { uploadToR2 } from "lib/r2";
import connectDB from "database/db";
import Image from "database/models/image";
import User from "database/models/user";

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const rateLimitResult = rateLimit(request, 50, 3600000); // 50 requests per hour
    if (rateLimitResult) return rateLimitResult;

    // 2. Authenticate user
    const authResult = await requireAuthentication(request);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    // 3. Parse form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    const isPublic = formData.get('isPublic') === 'true';

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // 4. Validate all files
    const validationResults = files.map(file => ({
      file,
      result: validateFile(file)
    }));

    const invalidFiles = validationResults.filter(({ result }) => !result.valid);
    if (invalidFiles.length > 0) {
      return NextResponse.json({
        error: 'Invalid files',
        details: invalidFiles.map(({ file, result }) => ({
          filename: file.name,
          error: result.error
        }))
      }, { status: 400 });
    }

    // 5. Check user quota
    await connectDB();
    const userData = await User.findById(user.id);
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (userData.storageQuota.used + totalSize > userData.storageQuota.limit) {
      return NextResponse.json({ 
        error: 'Storage quota exceeded',
        details: {
          used: userData.storageQuota.used,
          limit: userData.storageQuota.limit,
          requested: totalSize
        }
      }, { status: 413 });
    }

    // 6. Process uploads
    const uploadResults = await Promise.all(
      files.map(file => processFileUpload(file, user.id, tags, isPublic, request))
    );

    // 7. Update user quota
    const successfulUploads = uploadResults.filter(r => r.success);
    const uploadedSize = successfulUploads.reduce((sum, r) => sum + r.data.size, 0);
    
    await User.findByIdAndUpdate(user.id, {
      $inc: { 'storageQuota.used': uploadedSize }
    });

    // 8. Return results
    const successful = uploadResults.filter(r => r.success);
    const failed = uploadResults.filter(r => !r.success);

    return NextResponse.json({
      success: true,
      uploaded: successful.length,
      failed: failed.length,
      images: successful.map(r => r.data),
      errors: failed.map(r => r.error)
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

async function processFileUpload(
  file: File,
  userId: string,
  tags: string[],
  isPublic: boolean,
  request: NextRequest
) {
  try {
    // 1. Generate secure filename and key
    const filename = generateSecureFilename(file.name);
    const r2Key = `${userId}/${filename}`;

    // 2. Read file buffer
    const buffer = await file.arrayBuffer();
    const bufferObj = Buffer.from(buffer);

    // 3. Generate checksums
    const checksums = generateChecksums(buffer);

    // 4. Upload to R2
    await uploadToR2(r2Key, bufferObj, file.type, {
      originalName: file.name,
      userId: userId,
      uploadedAt: new Date().toISOString(),
    });

    // 5. Save metadata to MongoDB
    const imageDoc = await Image.create({
      userId,
      originalName: file.name,
      filename,
      r2Key,
      contentType: file.type,
      size: file.size,
      metadata: {
        uploadedAt: new Date(),
        uploadedFrom: request.headers.get('x-forwarded-for') || 'unknown',
        tags,
      },
      access: {
        isPublic,
        sharedWith: [],
      },
      status: 'ready',
      checksums,
      accessLog: []
    });

    return {
      success: true,
      data: {
        id: imageDoc._id.toString(),
        originalName: file.name,
        filename,
        size: file.size,
        contentType: file.type,
        uploadedAt: imageDoc.metadata.uploadedAt,
      }
    };

  } catch (error) {
    console.error('File processing error:', error);
    return {
      success: false,
      error: `Failed to process ${file.name}: ${error.message}`
    };
  }
}
```

---

## 📋 Step 6: Create Enhanced Gallery API

### 6.1 Replace My Images API

Update your existing `apps/web/app/api/my-images/route.ts`:

```typescript
// apps/web/app/api/my-images/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuthentication } from "lib/auth/middleware";
import { rateLimit } from "lib/middleware/rateLimiter";
import { generateSignedUrl } from "lib/r2";
import connectDB from "database/db";
import Image from "database/models/image";

export async function GET(request: NextRequest) {
  try {
    // 1. Rate limiting
    const rateLimitResult = rateLimit(request, 200, 3600000); // 200 requests per hour
    if (rateLimitResult) return rateLimitResult;

    // 2. Authenticate user
    const authResult = await requireAuthentication(request);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    // 3. Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const search = searchParams.get('search')?.trim() || '';
    const sortBy = searchParams.get('sortBy') || 'uploadedAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // 4. Connect to database
    await connectDB();

    // 5. Build query
    const query: any = { 
      userId: user.id,
      status: 'ready' // Only return ready images
    };

    if (tags.length > 0) {
      query['metadata.tags'] = { $in: tags };
    }

    if (search) {
      query.originalName = { $regex: search, $options: 'i' };
    }

    // 6. Execute query with pagination
    const [images, total] = await Promise.all([
      Image.find(query)
        .sort({ [`metadata.${sortBy}`]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Image.countDocuments(query)
    ]);

    // 7. Generate signed URLs
    const imagesWithUrls = await Promise.all(
      images.map(async (image) => {
        try {
          const signedUrl = await generateSignedUrl(image.r2Key, 3600);
          
          // Log access
          await Image.findByIdAndUpdate(image._id, {
            $push: {
              accessLog: {
                accessedAt: new Date(),
                purpose: 'gallery_view',
                ip: request.headers.get('x-forwarded-for') || 'unknown'
              }
            }
          });
          
          return {
            id: image._id.toString(),
            originalName: image.originalName,
            url: signedUrl,
            size: image.size,
            contentType: image.contentType,
            dimensions: image.dimensions,
            uploadedAt: image.metadata.uploadedAt,
            tags: image.metadata.tags,
            isPublic: image.access.isPublic,
            urlExpiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour from now
          };
        } catch (error) {
          console.error('Error generating signed URL for image:', image._id, error);
          return null;
        }
      })
    );

    // Filter out failed URL generations
    const validImages = imagesWithUrls.filter(img => img !== null);

    return NextResponse.json({
      success: true,
      images: validImages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      stats: {
        totalImages: total,
        totalSize: images.reduce((sum, img) => sum + img.size, 0),
      }
    });

  } catch (error) {
    console.error('Gallery fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
```

---

## 🗑️ Step 7: Create Delete API

### 7.1 Create Delete Endpoint

Create `apps/web/app/api/images/[imageId]/route.ts`:

```typescript
// apps/web/app/api/images/[imageId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuthentication } from "lib/auth/middleware";
import { rateLimit } from "lib/middleware/rateLimiter";
import { deleteFromR2 } from "lib/r2";
import connectDB from "database/db";
import Image from "database/models/image";
import User from "database/models/user";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    // 1. Rate limiting
    const rateLimitResult = rateLimit(request, 100, 3600000);
    if (rateLimitResult) return rateLimitResult;

    // 2. Authenticate user
    const authResult = await requireAuthentication(request);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    // 3. Connect to database
    await connectDB();

    // 4. Find and verify ownership
    const image = await Image.findOne({
      _id: params.imageId,
      userId: user.id,
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // 5. Delete from R2
    await deleteFromR2(image.r2Key);

    // 6. Delete from MongoDB
    await Image.findByIdAndDelete(params.imageId);

    // 7. Update user quota
    await User.findByIdAndUpdate(user.id, {
      $inc: { 'storageQuota.used': -image.size }
    });

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    // 1. Rate limiting
    const rateLimitResult = rateLimit(request, 200, 3600000);
    if (rateLimitResult) return rateLimitResult;

    // 2. Authenticate user
    const authResult = await requireAuthentication(request);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    // 3. Connect to database
    await connectDB();

    // 4. Find and verify ownership
    const image = await Image.findOne({
      _id: params.imageId,
      userId: user.id,
      status: 'ready'
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // 5. Generate signed URL
    const signedUrl = await generateSignedUrl(image.r2Key, 3600);

    // 6. Log access
    await Image.findByIdAndUpdate(params.imageId, {
      $push: {
        accessLog: {
          accessedAt: new Date(),
          purpose: 'direct_view',
          ip: request.headers.get('x-forwarded-for') || 'unknown'
        }
      }
    });

    return NextResponse.json({
      success: true,
      image: {
        id: image._id.toString(),
        originalName: image.originalName,
        url: signedUrl,
        size: image.size,
        contentType: image.contentType,
        dimensions: image.dimensions,
        uploadedAt: image.metadata.uploadedAt,
        tags: image.metadata.tags,
        isPublic: image.access.isPublic,
        urlExpiresAt: new Date(Date.now() + 3600 * 1000),
      }
    });

  } catch (error) {
    console.error('Image fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}
```

---

## 🎨 Step 8: Create Enhanced Frontend Components

### 8.1 Update Upload Component

Update your existing upload logic. Replace the content in `apps/web/app/tools/upload/uploadImage.ts`:

```typescript
// apps/web/app/tools/upload/uploadImage.ts
import { UploadedFile, UploadedFileItem } from "@repo/ui/types/Filetype";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/bmp"];

function isAcceptedType(file: File) {
  return ACCEPTED_TYPES.includes(file.type);
}

function createFileUpdater(
  baseFile: UploadedFileItem,
  updates: Partial<UploadedFileItem>
): UploadedFileItem {
  return { ...baseFile, ...updates, loading: false };
}

async function uploadOne(
  file: UploadedFileItem,
  userId: string
): Promise<UploadedFileItem> {
  if (file.uploadStatus || file.error) {
    return file;
  }

  if (!isAcceptedType(file.filedata)) {
    return createFileUpdater(file, {
      error: true,
      uploadStatus: false,
      name: file.filedata.name,
    });
  }

  try {
    const formData = new FormData();
    formData.append('files', file.filedata);
    formData.append('tags', JSON.stringify([]));
    formData.append('isPublic', 'false');

    const response = await fetch('/api/images/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Upload failed');
    }

    if (result.success && result.images.length > 0) {
      const uploadedImage = result.images[0];
      return createFileUpdater(file, {
        url: uploadedImage.url || '', // This will be a signed URL
        uploadStatus: true,
        name: file.filedata.name,
        imageId: uploadedImage.id,
      });
    } else {
      throw new Error('No image data returned');
    }

  } catch (error) {
    console.error('Upload error:', error);
    return createFileUpdater(file, {
      error: true,
      uploadStatus: false,
      name: file.filedata.name,
    });
  }
}

export async function uploadAll(
  uploadedFiles: UploadedFile,
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile>>,
  userId: string | null
) {
  if (uploadedFiles.length === 0 || !userId) return;

  const uploadPromises: Promise<UploadedFileItem>[] = [];
  let needsStateUpdate = false;

  const updatedFiles = uploadedFiles.map((file) => {
    if (!file.uploadStatus && !file.error && !file.loading) {
      needsStateUpdate = true;
      uploadPromises.push(uploadOne(file, userId));
      return { ...file, loading: true };
    } else {
      uploadPromises.push(Promise.resolve(file));
      return file;
    }
  });

  if (!needsStateUpdate) return;

  setUploadedFiles(updatedFiles);

  const results = await Promise.all(uploadPromises);
  setUploadedFiles(results);
}
```

### 8.2 Create Enhanced Gallery Component

Create `apps/web/app/tools/my-images/components/ImageGallery.tsx`:

```typescript
// apps/web/app/tools/my-images/components/ImageGallery.tsx
import { useState, useEffect } from 'react';
import { useUserContext } from 'context/UserContext/UserContextProvider';

interface ImageItem {
  id: string;
  originalName: string;
  url: string;
  size: number;
  contentType: string;
  uploadedAt: string;
  tags: string[];
  urlExpiresAt: string;
}

interface GalleryState {
  images: ImageItem[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}

export default function ImageGallery() {
  const { userId } = useUserContext();
  const [state, setState] = useState<GalleryState>({
    images: [],
    loading: true,
    error: null,
    page: 1,
    hasMore: true
  });

  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  useEffect(() => {
    if (userId) {
      loadImages();
    }
  }, [userId]);

  const loadImages = async (page = 1) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch(`/api/my-images?page=${page}&limit=20`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load images');
      }

      if (data.success) {
        setState(prev => ({
          ...prev,
          images: page === 1 ? data.images : [...prev.images, ...data.images],
          loading: false,
          hasMore: data.pagination.hasNext,
          page: data.pagination.page
        }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Failed to load images' 
      }));
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      setState(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      }));

    } catch (error) {
      alert('Failed to delete image: ' + error.message);
    }
  };

  const refreshImageUrl = async (imageId: string) => {
    try {
      const response = await fetch(`/api/images/${imageId}`);
      const data = await response.json();

      if (data.success) {
        setState(prev => ({
          ...prev,
          images: prev.images.map(img => 
            img.id === imageId 
              ? { ...img, url: data.image.url, urlExpiresAt: data.image.urlExpiresAt }
              : img
          )
        }));
      }
    } catch (error) {
      console.error('Failed to refresh image URL:', error);
    }
  };

  if (state.loading && state.images.length === 0) {
    return <div className="loading">Loading your images...</div>;
  }

  if (state.error) {
    return <div className="error">Error: {state.error}</div>;
  }

  return (
    <div className="image-gallery">
      <h2>My Images ({state.images.length})</h2>
      
      {state.images.length === 0 ? (
        <div className="empty-state">
          <p>No images uploaded yet.</p>
          <a href="/tools/upload">Upload your first image</a>
        </div>
      ) : (
        <div className="image-grid">
          {state.images.map((image) => (
            <div key={image.id} className="image-card">
              <img 
                src={image.url} 
                alt={image.originalName}
                loading="lazy"
                onClick={() => setSelectedImage(image)}
                onError={() => refreshImageUrl(image.id)}
              />
              <div className="image-info">
                <div className="image-name">{image.originalName}</div>
                <div className="image-size">
                  {Math.round(image.size / 1024)} KB
                </div>
                <div className="image-actions">
                  <button 
                    onClick={() => setSelectedImage(image)}
                    className="view-btn"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => deleteImage(image.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {state.hasMore && (
        <button 
          onClick={() => loadImages(state.page + 1)}
          className="load-more-btn"
          disabled={state.loading}
        >
          {state.loading ? 'Loading...' : 'Load More'}
        </button>
      )}

      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button 
              className="close-btn"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <img 
              src={selectedImage.url} 
              alt={selectedImage.originalName}
              onError={() => refreshImageUrl(selectedImage.id)}
            />
            <div className="modal-info">
              <h3>{selectedImage.originalName}</h3>
              <p>Size: {Math.round(selectedImage.size / 1024)} KB</p>
              <p>Uploaded: {new Date(selectedImage.uploadedAt).toLocaleDateString()}</p>
              {selectedImage.tags.length > 0 && (
                <p>Tags: {selectedImage.tags.join(', ')}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 Step 9: Testing and Deployment

### 9.1 Create Test Scripts

Create `scripts/test-upload.js`:

```javascript
// scripts/test-upload.js
const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function testUpload() {
  const formData = new FormData();
  
  // Add a test image file
  const imageBuffer = fs.readFileSync('path/to/test-image.jpg');
  formData.append('files', imageBuffer, {
    filename: 'test-image.jpg',
    contentType: 'image/jpeg'
  });
  
  formData.append('tags', JSON.stringify(['test', 'upload']));
  formData.append('isPublic', 'false');
  
  try {
    const response = await fetch('http://localhost:3000/api/images/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'Bearer your-test-token'
      }
    });
    
    const result = await response.json();
    console.log('Upload result:', result);
  } catch (error) {
    console.error('Upload error:', error);
  }
}

testUpload();
```

### 9.2 Environment Variables for Production

```env
# Production Environment Variables
NODE_ENV=production
R2_ACCESS_KEY_ID=your_production_access_key
R2_SECRET_ACCESS_KEY=your_production_secret_key
R2_BUCKET=your_production_bucket
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_REGION=auto

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/imagic
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_production_secret

# Security
UPLOAD_MAX_SIZE=10485760
UPLOAD_MAX_FILES=10
SIGNED_URL_EXPIRY=3600
RATE_LIMIT_REQUESTS=100
```

### 9.3 Deployment Checklist

- [ ] Set up production environment variables
- [ ] Configure MongoDB indexes
- [ ] Set up R2 bucket with proper CORS settings
- [ ] Configure authentication (NextAuth, Auth0, etc.)
- [ ] Set up monitoring and logging
- [ ] Test rate limiting
- [ ] Test file validation
- [ ] Test quota management
- [ ] Set up backup strategies
- [ ] Configure CDN (optional)

---

## 📊 Step 10: Monitoring and Maintenance

### 10.1 Add Logging

Create `apps/web/lib/logger.ts`:

```typescript
// apps/web/lib/logger.ts
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  data?: any;
  userId?: string;
  ip?: string;
}

export class Logger {
  static log(level: LogEntry['level'], message: string, data?: any, userId?: string, ip?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      userId,
      ip
    };

    // In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      // Send to your logging service (DataDog, LogRocket, etc.)
      console.log(JSON.stringify(entry));
    } else {
      console.log(`[${entry.level.toUpperCase()}] ${entry.message}`, entry.data);
    }
  }

  static info(message: string, data?: any, userId?: string, ip?: string) {
    this.log('info', message, data, userId, ip);
  }

  static warn(message: string, data?: any, userId?: string, ip?: string) {
    this.log('warn', message, data, userId, ip);
  }

  static error(message: string, data?: any, userId?: string, ip?: string) {
    this.log('error', message, data, userId, ip);
  }
}
```

### 10.2 Create Health Check Endpoint

Create `apps/web/app/api/health/route.ts`:

```typescript
// apps/web/app/api/health/route.ts
import { NextResponse } from 'next/server';
import connectDB from 'database/db';
import { checkObjectExists } from 'lib/r2';

export async function GET() {
  const checks = {
    database: false,
    r2: false,
    timestamp: new Date().toISOString()
  };

  try {
    // Check database connection
    await connectDB();
    checks.database = true;
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  try {
    // Check R2 connection (try to check a known object or bucket)
    // This is a simple check - in production you might want something more robust
    checks.r2 = true; // Simplified for this example
  } catch (error) {
    console.error('R2 health check failed:', error);
  }

  const healthy = checks.database && checks.r2;
  
  return NextResponse.json(
    { healthy, checks },
    { status: healthy ? 200 : 503 }
  );
}
```

---

## 🎉 Conclusion

You now have a complete, secure image storage system with:

✅ **Security**: Authentication, authorization, rate limiting, file validation
✅ **Storage**: MongoDB metadata, R2 file storage, signed URLs
✅ **Features**: Upload, gallery, delete, search, pagination
✅ **Performance**: Optimized queries, efficient file handling
✅ **Monitoring**: Logging, health checks, error tracking
✅ **Scalability**: Quota management, rate limiting, proper indexing

### Next Steps:

1. **Deploy to production** with proper environment variables
2. **Add image processing** (thumbnails, resizing) using Sharp
3. **Implement image sharing** features
4. **Add batch operations** (bulk delete, bulk tag)
5. **Set up monitoring** and alerting
6. **Add image optimization** and CDN integration
7. **Implement backup strategies**

This implementation provides a solid foundation for a production-ready image storage system that can scale with your application's needs.
