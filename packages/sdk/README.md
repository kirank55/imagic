# @imagic/sdk

Official Node.js SDK for the Imagic image optimization API.

## Installation

```bash
npm install @imagic/sdk
```

## Quick Start

```javascript
const { ImagicClient } = require("@imagic/sdk");

// Initialize the client
const client = new ImagicClient({
  apiKey: "your-api-key-here",
  baseUrl: "https://your-imagic-domain.com", // optional, defaults to localhost:3000
});

// Upload an image
async function uploadImage() {
  try {
    const result = await client.upload("/path/to/your/image.jpg");
    console.log("Upload successful:", result);
  } catch (error) {
    console.error("Upload failed:", error.message);
  }
}

uploadImage();
```

## API Reference

### Constructor

#### `new ImagicClient(config)`

Creates a new Imagic client instance.

**Parameters:**

- `config` (object): Configuration options
  - `apiKey` (string): Your Imagic API key (required)
  - `baseUrl` (string): Base URL of the Imagic API (optional, default: 'http://localhost:3000')
  - `timeout` (number): Request timeout in milliseconds (optional, default: 30000)

**Example:**

```javascript
const client = new ImagicClient({
  apiKey: "your-api-key",
  baseUrl: "https://api.imagic.com",
  timeout: 60000, // 60 seconds
});
```

### Methods

#### `upload(input, options?)`

Uploads a single image to Imagic.

**Parameters:**

- `input` (string | Buffer): File path or Buffer containing image data
- `options` (object, optional): Upload options
  - `filename` (string): Override filename (optional)
  - `contentType` (string): Override MIME type (optional)

**Returns:** `Promise<ApiResponse>`

**Examples:**

```javascript
// Upload from file path
const result = await client.upload("/path/to/image.jpg");

// Upload from Buffer
const buffer = fs.readFileSync("/path/to/image.jpg");
const result = await client.upload(buffer, {
  filename: "my-image.jpg",
  contentType: "image/jpeg",
});
```

#### `uploadMultiple(inputs, options?)`

Uploads multiple images to Imagic.

**Parameters:**

- `inputs` (Array<string | Buffer>): Array of file paths or Buffers
- `options` (object, optional): Upload options (applied to all files)

**Returns:** `Promise<ApiResponse[]>`

**Example:**

```javascript
const results = await client.uploadMultiple([
  "/path/to/image1.jpg",
  "/path/to/image2.png",
  buffer3,
]);
```

#### `getApiInfo()`

Gets information about the Imagic API.

**Returns:** `Promise<ApiInfo>`

**Example:**

```javascript
const info = await client.getApiInfo();
console.log("API Version:", info.version);
```

#### `testConnection()`

Tests the connection to the Imagic API.

**Returns:** `Promise<boolean>`

**Example:**

```javascript
const isConnected = await client.testConnection();
if (isConnected) {
  console.log("API connection successful");
} else {
  console.log("API connection failed");
}
```

## Response Format

### Successful Upload Response

```typescript
{
  success: true,
  data: {
    id: string,           // MongoDB document ID
    key: string,          // Storage key
    url: string,          // Public URL to access the image
    name: string,         // Original filename
    size: number,         // File size in bytes
    type: string,         // MIME type
    uploadedAt: string    // ISO timestamp
  },
  message: string         // Success message
}
```

### Error Response

```typescript
{
  success: false,
  error: string,          // Error type
  message: string         // Human-readable error message
}
```

## Supported File Types

- PNG (`image/png`)
- JPEG (`image/jpeg`, `image/jpg`)
- GIF (`image/gif`)
- BMP (`image/bmp`)
- WebP (`image/webp`)
- SVG (`image/svg+xml`)

## File Size Limits

Maximum file size: **10MB**

## Error Handling

The SDK provides specific error types for different scenarios:

```javascript
const {
  ImagicError,
  ValidationError,
  AuthenticationError,
  NetworkError,
} = require("@imagic/sdk");

try {
  const result = await client.upload("/path/to/image.jpg");
} catch (error) {
  if (error instanceof ValidationError) {
    console.error("Validation error:", error.message);
  } else if (error instanceof AuthenticationError) {
    console.error("Authentication error:", error.message);
  } else if (error instanceof NetworkError) {
    console.error("Network error:", error.message);
  } else if (error instanceof ImagicError) {
    console.error("API error:", error.message, "Status:", error.statusCode);
  } else {
    console.error("Unknown error:", error.message);
  }
}
```

## Error Types

- **ValidationError**: Invalid input parameters, unsupported file types, file size exceeded
- **AuthenticationError**: Invalid or missing API key
- **NetworkError**: Network connectivity issues
- **ImagicError**: General API errors with HTTP status codes

## TypeScript Support

The SDK is written in TypeScript and includes comprehensive type definitions:

```typescript
import { ImagicClient, ApiResponse, UploadOptions } from "@imagic/sdk";

const client = new ImagicClient({
  apiKey: process.env.IMAGIC_API_KEY!,
  baseUrl: "https://api.imagic.com",
});

const options: UploadOptions = {
  filename: "profile-picture.jpg",
  contentType: "image/jpeg",
};

const response: ApiResponse = await client.upload("./image.jpg", options);
```

## Examples

### Basic Upload

```javascript
const { ImagicClient } = require("@imagic/sdk");

const client = new ImagicClient({
  apiKey: process.env.IMAGIC_API_KEY,
});

async function main() {
  try {
    const result = await client.upload("./photo.jpg");
    console.log("Image uploaded successfully!");
    console.log("URL:", result.data.url);
  } catch (error) {
    console.error("Upload failed:", error.message);
  }
}

main();
```

### Batch Upload

```javascript
const fs = require("fs").promises;
const { ImagicClient } = require("@imagic/sdk");

const client = new ImagicClient({
  apiKey: process.env.IMAGIC_API_KEY,
});

async function uploadDirectory(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    const imagePaths = files
      .filter((file) => /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(file))
      .map((file) => `${dirPath}/${file}`);

    console.log(`Uploading ${imagePaths.length} images...`);

    const results = await client.uploadMultiple(imagePaths);

    results.forEach((result, index) => {
      if (result.success) {
        console.log(`✓ ${imagePaths[index]} -> ${result.data.url}`);
      } else {
        console.log(`✗ ${imagePaths[index]} -> ${result.message}`);
      }
    });
  } catch (error) {
    console.error("Batch upload failed:", error.message);
  }
}

uploadDirectory("./images");
```

### Upload from URL

```javascript
const fetch = require("node-fetch");
const { ImagicClient } = require("@imagic/sdk");

const client = new ImagicClient({
  apiKey: process.env.IMAGIC_API_KEY,
});

async function uploadFromUrl(imageUrl) {
  try {
    // Download image
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();

    // Extract filename from URL
    const filename = imageUrl.split("/").pop() || "image.jpg";

    // Upload to Imagic
    const result = await client.upload(buffer, { filename });

    console.log("Image uploaded from URL:", result.data.url);
    return result;
  } catch (error) {
    console.error("Upload from URL failed:", error.message);
    throw error;
  }
}

uploadFromUrl("https://example.com/image.jpg");
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- [GitHub Issues](https://github.com/kirank55/imagic/issues)
- [Documentation](https://github.com/kirank55/imagic)
- API Documentation: Visit `/api/v1` endpoint of your Imagic instance
