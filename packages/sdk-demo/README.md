# Imagic SDK Demo

This demo project showcases the functionality of the Imagic Node.js SDK.

## Setup

1. **Start the API server:**

   ```bash
   cd ../../apps/web
   npm run dev
   ```

2. **Get an API key:**

   - Visit http://localhost:3000/profile
   - Sign up/login if needed
   - Generate an API key

3. **Set environment variables:**

   ```bash
   # PowerShell
   $env:IMAGIC_API_KEY="your-api-key-here"
   $env:IMAGIC_BASE_URL="http://localhost:3000"

   # Command Prompt
   set IMAGIC_API_KEY=your-api-key-here
   set IMAGIC_BASE_URL=http://localhost:3000
   ```

## Demo Files

### Basic Demo (`index.js`)

Comprehensive test suite including:

- ✅ Connection testing
- ✅ API information retrieval
- ✅ Single image upload
- ✅ Error handling demonstration

```bash
node index.js
```

### Batch Upload Demo (`batch-demo.js`)

Tests batch upload functionality:

- ✅ Multiple image uploads
- ✅ Performance metrics
- ✅ Success/failure analysis

```bash
node batch-demo.js
```

### TypeScript Demo (`typescript-demo.ts`)

TypeScript-specific features:

- ✅ Type safety demonstration
- ✅ Interface usage
- ✅ Error handling with types

```bash
npx ts-node typescript-demo.ts
```

### Quick Test (`quick-test.js`)

Simple connection verification:

- ✅ API availability check
- ✅ Authentication validation

```bash
node quick-test.js
```

## Expected Output

### With Valid API Key:

```
🚀 Imagic SDK Demo Starting...
🔌 Test 1: Testing API connection...
✅ Connection successful!
📋 Test 2: Getting API information...
✅ Connected to Imagic API v1.0.0
🖼️  Test 3: Creating test image...
✅ Test image created (1x1 PNG)
📤 Test 4: Uploading test image...
✅ Upload successful!
📁 File size: 67 bytes
🔗 URL: https://your-r2-bucket.com/uploaded-image.png
```

### With Invalid API Key:

```
❌ Demo failed: The provided API key is not valid
📊 Status Code: 401
🏷️  Error Type: authentication_error
```

## SDK Features Demonstrated

1. **Connection Testing** - Verify API availability
2. **Authentication** - API key validation
3. **Single Upload** - Upload individual images
4. **Batch Upload** - Upload multiple images efficiently
5. **Error Handling** - Comprehensive error management
6. **TypeScript Support** - Full type safety
7. **Progress Tracking** - Upload progress monitoring

## API Endpoints Tested

- `GET /api/health` - Health check
- `POST /api/v1/upload` - Image upload with authentication

## Error Handling

The SDK properly handles:

- ❌ Network errors
- ❌ Authentication failures
- ❌ Invalid file types
- ❌ File size limits
- ❌ Server errors

## Performance

The batch demo measures:

- 📊 Upload success rate
- ⏱️ Total duration
- 📈 Average time per image
- 📁 Total data transferred
