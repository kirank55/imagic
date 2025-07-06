# Secure Image Storage Implementation Plan

## Overview
This document outlines a comprehensive plan for implementing secure image storage in a Next.js application using MongoDB and Cloudflare R2, ensuring images are only accessible to users who uploaded them.

## Architecture Overview

### Components
1. **Frontend**: Next.js React components for upload UI
2. **Backend**: API routes for upload, retrieval, and management
3. **Database**: MongoDB for metadata storage
4. **Storage**: Cloudflare R2 for actual image files
5. **Authentication**: User-based access control
6. **Security**: Signed URLs for temporary access

### Security Model
- Images are stored in R2 with private access (no public URLs)
- Access is controlled through signed URLs with expiration
- User authentication required for all operations
- Image metadata stored in MongoDB with userId association

## File Structure

```
apps/web/
├── app/
│   ├── api/
│   │   ├── images/
│   │   │   ├── upload/
│   │   │   │   └── route.ts              # Upload endpoint
│   │   │   ├── [imageId]/
│   │   │   │   ├── route.ts              # Get single image
│   │   │   │   └── delete/
│   │   │   │       └── route.ts          # Delete image
│   │   │   ├── user/
│   │   │   │   └── route.ts              # Get user's images
│   │   │   └── presigned-url/
│   │   │       └── route.ts              # Generate presigned URLs
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts              # Authentication
│   └── tools/
│       └── images/
│           ├── upload/
│           │   ├── page.tsx              # Upload page
│           │   └── components/
│           │       ├── ImageUploader.tsx # Upload component
│           │       ├── UploadProgress.tsx# Progress indicator
│           │       └── ImagePreview.tsx  # Preview component
│           └── gallery/
│               ├── page.tsx              # User gallery
│               └── components/
│                   ├── ImageGrid.tsx     # Image grid
│                   ├── ImageCard.tsx     # Individual image card
│                   └── ImageModal.tsx    # Full-size view
├── lib/
│   ├── storage/
│   │   ├── r2.ts                        # R2 client and utilities
│   │   ├── upload.ts                    # Upload utilities
│   │   └── validation.ts                # File validation
│   ├── database/
│   │   ├── models/
│   │   │   ├── image.ts                 # Image model
│   │   │   └── user.ts                  # User model
│   │   └── connection.ts                # DB connection
│   └── auth/
│       ├── config.ts                    # Auth configuration
│       └── middleware.ts                # Auth middleware
├── components/
│   ├── ui/
│   │   ├── ImageUpload/
│   │   │   ├── Dropzone.tsx            # Drag & drop zone
│   │   │   ├── FileList.tsx            # File list component
│   │   │   └── UploadButton.tsx        # Upload trigger
│   │   └── ImageViewer/
│   │       ├── SecureImage.tsx         # Secure image component
│   │       └── ImageGallery.tsx        # Gallery component
│   └── layouts/
│       └── AuthLayout.tsx              # Auth wrapper
├── hooks/
│   ├── useImageUpload.ts               # Upload hook
│   ├── useImageGallery.ts              # Gallery hook
│   └── useAuth.ts                      # Auth hook
├── types/
│   ├── image.ts                        # Image types
│   └── upload.ts                       # Upload types
└── utils/
    ├── imageProcessing.ts              # Image processing utilities
    ├── security.ts                     # Security utilities
    └── constants.ts                    # App constants
```

## Database Schema

### Image Model
```typescript
interface IImage {
  _id: ObjectId;
  userId: string;                    // Reference to user
  originalName: string;              // Original filename
  filename: string;                  // Stored filename (UUID)
  r2Key: string;                     # R2 storage key
  contentType: string;               # MIME type
  size: number;                      # File size in bytes
  dimensions?: {
    width: number;
    height: number;
  };
  metadata: {
    uploadedAt: Date;
    uploadedFrom: string;            # IP address or device info
    tags?: string[];                 # User-defined tags
  };
  access: {
    isPublic: boolean;               # Public/private flag
    sharedWith?: string[];           # User IDs with access
    expiresAt?: Date;               # Auto-deletion date
  };
  status: 'uploading' | 'processing' | 'ready' | 'error';
  checksums: {
    md5: string;
    sha256: string;
  };
}
```

### User Model
```typescript
interface IUser {
  _id: ObjectId;
  email: string;
  name: string;
  storageQuota: {
    used: number;                    # Bytes used
    limit: number;                   # Bytes allowed
  };
  preferences: {
    autoDelete: boolean;
    defaultExpiry: number;           # Days
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### 1. Upload Endpoint
**POST** `/api/images/upload`

**Request:**
```typescript
FormData {
  files: File[];
  userId: string;
  tags?: string[];
  isPublic?: boolean;
  expiresAt?: Date;
}
```

**Response:**
```typescript
{
  success: boolean;
  images: {
    id: string;
    originalName: string;
    url: string;              # Temporary signed URL
    size: number;
    contentType: string;
  }[];
  errors?: string[];
}
```

### 2. Get User Images
**GET** `/api/images/user?userId=xxx&page=1&limit=20`

**Response:**
```typescript
{
  success: boolean;
  images: ImageMetadata[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

### 3. Get Single Image
**GET** `/api/images/[imageId]`

**Response:**
```typescript
{
  success: boolean;
  image: {
    id: string;
    url: string;              # Signed URL
    metadata: ImageMetadata;
  };
}
```

### 4. Delete Image
**DELETE** `/api/images/[imageId]`

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

### 5. Generate Presigned URL
**POST** `/api/images/presigned-url`

**Request:**
```typescript
{
  imageId: string;
  expiresIn?: number;        # Seconds (default: 3600)
  purpose: 'view' | 'download';
}
```

**Response:**
```typescript
{
  success: boolean;
  url: string;
  expiresAt: Date;
}
```

## Implementation Workflow

### Phase 1: Core Infrastructure
1. **Database Setup**
   - Create MongoDB models
   - Set up connection handling
   - Add indexes for performance

2. **R2 Configuration**
   - Configure R2 client
   - Set up bucket policies
   - Implement signed URL generation

3. **Authentication**
   - Implement user authentication
   - Set up session management
   - Create auth middleware

### Phase 2: Upload System
1. **File Validation**
   - MIME type checking
   - File size limits
   - Image format validation
   - Malware scanning (optional)

2. **Upload Processing**
   - Generate unique filenames
   - Create thumbnails
   - Extract metadata
   - Upload to R2
   - Store metadata in MongoDB

3. **Progress Tracking**
   - Real-time upload progress
   - Error handling
   - Retry mechanisms

### Phase 3: Retrieval System
1. **Secure Access**
   - Generate signed URLs
   - Implement access controls
   - Add rate limiting

2. **Optimization**
   - Image resizing on-demand
   - Caching strategies
   - CDN integration

### Phase 4: Management Features
1. **Gallery Interface**
   - Grid/list views
   - Search and filtering
   - Bulk operations

2. **Admin Features**
   - Storage analytics
   - User management
   - Content moderation

## Security Considerations

### 1. Access Control
- **Authentication Required**: All endpoints require valid user session
- **Authorization**: Users can only access their own images
- **Signed URLs**: Temporary access with expiration
- **Rate Limiting**: Prevent abuse of API endpoints

### 2. File Validation
- **MIME Type Checking**: Verify file types
- **Size Limits**: Prevent large file uploads
- **Content Scanning**: Check for malicious content
- **Filename Sanitization**: Prevent directory traversal

### 3. Data Protection
- **Encryption**: Files encrypted at rest in R2
- **Secure Headers**: Proper security headers
- **Input Validation**: Sanitize all inputs
- **Error Handling**: Don't expose sensitive information

### 4. Monitoring
- **Access Logs**: Track all image access
- **Audit Trail**: Record all operations
- **Anomaly Detection**: Detect unusual patterns
- **Alerting**: Monitor for security issues

## Performance Optimization

### 1. Upload Optimization
- **Chunked Upload**: Large files in chunks
- **Parallel Processing**: Multiple files simultaneously
- **Resume Capability**: Resume interrupted uploads
- **Compression**: Optimize image sizes

### 2. Retrieval Optimization
- **CDN Integration**: Cloudflare CDN for signed URLs
- **Caching**: Redis for metadata caching
- **Lazy Loading**: Load images as needed
- **Responsive Images**: Multiple sizes for different devices

### 3. Database Optimization
- **Indexing**: Proper indexes for queries
- **Pagination**: Efficient pagination
- **Aggregation**: Optimized queries
- **Connection Pooling**: Efficient DB connections

## Monitoring and Analytics

### 1. Metrics to Track
- **Upload Success Rate**: Monitor failures
- **Storage Usage**: Track quota usage
- **Access Patterns**: Analyze usage
- **Performance**: Response times

### 2. Health Checks
- **API Endpoints**: Monitor availability
- **Database**: Check connection health
- **R2 Storage**: Verify connectivity
- **Authentication**: Test auth flows

### 3. Logging
- **Structured Logging**: JSON format
- **Error Tracking**: Comprehensive error logs
- **Audit Logs**: Security-relevant events
- **Performance Logs**: Timing information

## Deployment Considerations

### 1. Environment Variables
```env
# Database
MONGODB_URI=mongodb://...
MONGODB_DB_NAME=imagic

# Cloudflare R2
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET=imagic-images
R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com
R2_REGION=apac

# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=xxx

# Security
UPLOAD_MAX_SIZE=10485760        # 10MB
UPLOAD_MAX_FILES=10
SIGNED_URL_EXPIRY=3600         # 1 hour
```

### 2. Infrastructure
- **Load Balancing**: Multiple app instances
- **Auto Scaling**: Scale based on demand
- **Monitoring**: Health checks and alerts
- **Backup**: Regular data backups

This comprehensive plan provides a secure, scalable foundation for image storage with proper access controls and optimization strategies.
