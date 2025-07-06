# Image Storage Workflow Examples

## Workflow 1: Image Upload Process

### Step 1: User Initiates Upload
```typescript
// Frontend: User selects files
const handleFileSelect = (files: FileList) => {
  const validFiles = Array.from(files).filter(file => {
    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      showError(`${file.name}: Invalid file type`);
      return false;
    }
    
    // Validate file size (e.g., 10MB limit)
    if (file.size > MAX_FILE_SIZE) {
      showError(`${file.name}: File too large`);
      return false;
    }
    
    return true;
  });
  
  setSelectedFiles(validFiles);
};
```

### Step 2: Frontend Prepares Upload
```typescript
// Frontend: Prepare upload data
const uploadFiles = async (files: File[]) => {
  const formData = new FormData();
  
  files.forEach((file, index) => {
    formData.append(`files`, file);
  });
  
  formData.append('userId', user.id);
  formData.append('tags', JSON.stringify(['vacation', 'family']));
  formData.append('isPublic', 'false');
  
  // Show upload progress
  setUploadState('uploading');
  setUploadProgress(0);
  
  try {
    const response = await fetch('/api/images/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const result = await response.json();
    handleUploadSuccess(result);
  } catch (error) {
    handleUploadError(error);
  }
};
```

### Step 3: Backend Processes Upload
```typescript
// API Route: /api/images/upload/route.ts
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 2. Parse form data
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const userId = session.user.id;
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    const isPublic = formData.get('isPublic') === 'true';
    
    // 3. Validate files
    const validatedFiles = await validateFiles(files);
    
    // 4. Check user quota
    const user = await User.findById(userId);
    const totalSize = validatedFiles.reduce((sum, file) => sum + file.size, 0);
    
    if (user.storageQuota.used + totalSize > user.storageQuota.limit) {
      return NextResponse.json({ error: 'Storage quota exceeded' }, { status: 413 });
    }
    
    // 5. Process each file
    const uploadResults = await Promise.all(
      validatedFiles.map(file => processFileUpload(file, userId, tags, isPublic))
    );
    
    // 6. Update user quota
    await User.findByIdAndUpdate(userId, {
      $inc: { 'storageQuota.used': totalSize }
    });
    
    // 7. Return results
    return NextResponse.json({
      success: true,
      images: uploadResults,
      totalUploaded: uploadResults.length
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
```

### Step 4: File Processing
```typescript
// lib/storage/upload.ts
async function processFileUpload(
  file: File,
  userId: string,
  tags: string[],
  isPublic: boolean
) {
  const fileId = crypto.randomUUID();
  const extension = file.name.split('.').pop();
  const filename = `${fileId}.${extension}`;
  const r2Key = `${userId}/${filename}`;
  
  // 1. Generate checksums
  const buffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(buffer);
  const md5 = crypto.createHash('md5').update(uint8Array).digest('hex');
  const sha256 = crypto.createHash('sha256').update(uint8Array).digest('hex');
  
  // 2. Extract image metadata
  const dimensions = await getImageDimensions(uint8Array);
  
  // 3. Upload to R2
  const uploadCommand = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: r2Key,
    Body: uint8Array,
    ContentType: file.type,
    Metadata: {
      originalName: file.name,
      userId: userId,
      uploadedAt: new Date().toISOString(),
    },
  });
  
  await s3Client.send(uploadCommand);
  
  // 4. Save metadata to MongoDB
  const imageDoc = await Image.create({
    userId,
    originalName: file.name,
    filename,
    r2Key,
    contentType: file.type,
    size: file.size,
    dimensions,
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
    checksums: { md5, sha256 },
  });
  
  // 5. Generate initial signed URL
  const signedUrl = await generateSignedUrl(r2Key, 3600);
  
  return {
    id: imageDoc._id.toString(),
    originalName: file.name,
    url: signedUrl,
    size: file.size,
    contentType: file.type,
    dimensions,
  };
}
```

## Workflow 2: Image Retrieval Process

### Step 1: User Requests Gallery
```typescript
// Frontend: Gallery component
const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    loadUserImages();
  }, [page]);
  
  const loadUserImages = async () => {
    try {
      const response = await fetch(`/api/images/user?page=${page}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="image-gallery">
      {images.map(image => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
};
```

### Step 2: Backend Retrieves User Images
```typescript
// API Route: /api/images/user/route.ts
export async function GET(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 2. Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const tags = searchParams.get('tags')?.split(',') || [];
    const search = searchParams.get('search') || '';
    
    // 3. Build query
    const query: any = { userId: session.user.id };
    
    if (tags.length > 0) {
      query['metadata.tags'] = { $in: tags };
    }
    
    if (search) {
      query.originalName = { $regex: search, $options: 'i' };
    }
    
    // 4. Fetch images with pagination
    const [images, total] = await Promise.all([
      Image.find(query)
        .sort({ 'metadata.uploadedAt': -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Image.countDocuments(query)
    ]);
    
    // 5. Generate signed URLs for each image
    const imagesWithUrls = await Promise.all(
      images.map(async (image) => {
        const signedUrl = await generateSignedUrl(image.r2Key, 3600);
        
        return {
          id: image._id.toString(),
          originalName: image.originalName,
          url: signedUrl,
          size: image.size,
          contentType: image.contentType,
          dimensions: image.dimensions,
          uploadedAt: image.metadata.uploadedAt,
          tags: image.metadata.tags,
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      images: imagesWithUrls,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
    
  } catch (error) {
    console.error('Gallery fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
```

## Workflow 3: Secure Image Access

### Step 1: User Clicks on Image
```typescript
// Frontend: Image card component
const ImageCard = ({ image }) => {
  const [imageUrl, setImageUrl] = useState(image.url);
  const [loading, setLoading] = useState(false);
  
  const handleImageClick = async () => {
    // Check if URL is about to expire (within 5 minutes)
    const urlExpiresAt = new Date(image.urlExpiresAt);
    const now = new Date();
    const fiveMinutes = 5 * 60 * 1000;
    
    if (urlExpiresAt.getTime() - now.getTime() < fiveMinutes) {
      await refreshImageUrl();
    }
    
    // Open image in modal or new tab
    openImageViewer(imageUrl);
  };
  
  const refreshImageUrl = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/images/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          imageId: image.id,
          purpose: 'view',
          expiresIn: 3600,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setImageUrl(data.url);
      }
    } catch (error) {
      console.error('Failed to refresh image URL:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="image-card" onClick={handleImageClick}>
      <img 
        src={imageUrl} 
        alt={image.originalName}
        loading="lazy"
        onError={refreshImageUrl}
      />
      {loading && <div className="loading-overlay">Refreshing...</div>}
    </div>
  );
};
```

### Step 2: Backend Generates New Signed URL
```typescript
// API Route: /api/images/presigned-url/route.ts
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 2. Parse request body
    const { imageId, purpose, expiresIn = 3600 } = await request.json();
    
    // 3. Verify user owns the image
    const image = await Image.findOne({
      _id: imageId,
      userId: session.user.id,
    });
    
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    
    // 4. Check if image is accessible
    if (image.status !== 'ready') {
      return NextResponse.json({ error: 'Image not ready' }, { status: 400 });
    }
    
    // 5. Generate signed URL
    const signedUrl = await generateSignedUrl(image.r2Key, expiresIn);
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    
    // 6. Log access for audit
    await Image.findByIdAndUpdate(imageId, {
      $push: {
        'accessLog': {
          accessedAt: new Date(),
          purpose,
          ip: request.headers.get('x-forwarded-for') || 'unknown',
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      url: signedUrl,
      expiresAt,
    });
    
  } catch (error) {
    console.error('Presigned URL generation error:', error);
    return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 });
  }
}
```

## Workflow 4: Image Deletion

### Step 1: User Initiates Deletion
```typescript
// Frontend: Delete confirmation
const handleDeleteImage = async (imageId: string) => {
  const confirmed = await showConfirmDialog('Are you sure you want to delete this image?');
  
  if (!confirmed) return;
  
  try {
    const response = await fetch(`/api/images/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });
    
    if (response.ok) {
      // Remove from local state
      setImages(images => images.filter(img => img.id !== imageId));
      showSuccess('Image deleted successfully');
    } else {
      throw new Error('Delete failed');
    }
  } catch (error) {
    showError('Failed to delete image');
  }
};
```

### Step 2: Backend Processes Deletion
```typescript
// API Route: /api/images/[imageId]/route.ts
export async function DELETE(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // 2. Find and verify ownership
    const image = await Image.findOne({
      _id: params.imageId,
      userId: session.user.id,
    });
    
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
    
    // 3. Delete from R2
    const deleteCommand = new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: image.r2Key,
    });
    
    await s3Client.send(deleteCommand);
    
    // 4. Delete from MongoDB
    await Image.findByIdAndDelete(params.imageId);
    
    // 5. Update user quota
    await User.findByIdAndUpdate(session.user.id, {
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
```

## Error Handling Examples

### 1. Upload Failures
```typescript
// Handle various upload scenarios
const handleUploadError = (error: Error, file: File) => {
  if (error.message.includes('quota')) {
    showError('Storage quota exceeded. Please delete some images or upgrade your plan.');
  } else if (error.message.includes('size')) {
    showError(`File "${file.name}" is too large. Maximum size is 10MB.`);
  } else if (error.message.includes('type')) {
    showError(`File "${file.name}" is not a supported image format.`);
  } else {
    showError(`Failed to upload "${file.name}". Please try again.`);
  }
};
```

### 2. Access Failures
```typescript
// Handle image access errors
const handleImageError = async (imageId: string) => {
  try {
    // Try to refresh the URL
    await refreshImageUrl(imageId);
  } catch (error) {
    // If refresh fails, show placeholder
    setImageSrc('/placeholder-image.svg');
    showError('Image temporarily unavailable');
  }
};
```

### 3. Rate Limiting
```typescript
// API middleware for rate limiting
export async function rateLimit(request: NextRequest) {
  const identifier = request.headers.get('x-forwarded-for') || 'unknown';
  const key = `rate_limit:${identifier}`;
  
  const current = await redis.get(key);
  
  if (current && parseInt(current) > 100) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
  
  await redis.incr(key);
  await redis.expire(key, 3600); // 1 hour window
  
  return null; // Continue to next middleware
}
```

This comprehensive workflow example demonstrates the complete flow from upload to deletion, including security measures, error handling, and optimization strategies.
