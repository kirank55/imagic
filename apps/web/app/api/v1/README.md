# Image Upload API

## Endpoint

`POST /api/v1/upload`

## Description

Upload images to R2 storage using API key authentication. This endpoint accepts image files and stores them securely in Cloudflare R2, returning a public URL for access.

## Authentication

This endpoint requires a valid API key. You can use either your **public** or **private** API key:

- **Public API Key**: Safe to use in client-side applications
- **Private API Key**: Should only be used in server-side applications

You can generate API keys from your profile page.

## Request Format

- **Method**: POST
- **Content-Type**: multipart/form-data

## Parameters

| Parameter | Type   | Required | Description                    |
| --------- | ------ | -------- | ------------------------------ |
| `image`   | File   | Yes      | Image file to upload           |
| `api_key` | String | Yes      | Your public or private API key |

## Supported File Types

- PNG (`image/png`)
- JPEG (`image/jpeg`, `image/jpg`)
- GIF (`image/gif`)
- BMP (`image/bmp`)
- WebP (`image/webp`)
- SVG (`image/svg+xml`)

## File Size Limit

Maximum file size: **10MB**

## Example Usage

### cURL

```bash
curl -X POST https://your-domain.com/api/v1/upload \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/path/to/your/image.jpg" \
  -F "api_key=your_api_key_here"
```

### JavaScript (Node.js)

```javascript
const FormData = require("form-data");
const fs = require("fs");

const form = new FormData();
form.append("image", fs.createReadStream("/path/to/your/image.jpg"));
form.append("api_key", "your_api_key_here");

fetch("https://your-domain.com/api/v1/upload", {
  method: "POST",
  body: form,
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### JavaScript (Browser)

```javascript
const formData = new FormData();
formData.append("image", fileInput.files[0]);
formData.append("api_key", "your_api_key_here");

fetch("/api/v1/upload", {
  method: "POST",
  body: formData,
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Python

```python
import requests

files = {'image': open('/path/to/your/image.jpg', 'rb')}
data = {'api_key': 'your_api_key_here'}

response = requests.post('https://your-domain.com/api/v1/upload',
                        files=files, data=data)
print(response.json())
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "key": "user123/abc123-def456-image.jpg",
    "url": "https://your-r2-domain.com/user123/abc123-def456-image.jpg",
    "name": "original-image.jpg",
    "size": 245760,
    "type": "image/jpeg",
    "uploadedAt": "2025-07-15T10:30:00.000Z"
  },
  "message": "Image uploaded successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": "invalid_api_key",
  "message": "The provided API key is not valid"
}
```

## Error Codes

| HTTP Status | Error Type              | Description                               |
| ----------- | ----------------------- | ----------------------------------------- |
| 400         | `no_image_provided`     | No image file was included in the request |
| 400         | `unsupported_file_type` | File type is not supported                |
| 400         | `file_too_large`        | File exceeds the 10MB size limit          |
| 401         | `no_api_key`            | No API key was provided                   |
| 401         | `invalid_api_key`       | The provided API key is not valid         |
| 500         | `upload_failed`         | Server error during upload process        |

## Rate Limiting

Currently no rate limiting is enforced, but usage should be reasonable. Contact support if you need higher limits.

## Best Practices

1. Always handle both success and error responses
2. Use private API keys for server-side applications
3. Validate file types and sizes on the client side before uploading
4. Store the returned URL for accessing your uploaded images
5. Keep your API keys secure and don't commit them to version control

## Support

If you encounter any issues with the API, please check your API keys and ensure your image meets the requirements above.
