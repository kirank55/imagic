# Quick Start Guide

## Installation

```bash
# Install the SDK
npm install @imagic/sdk

# Or if you're in the monorepo
cd packages/sdk
npm install
npm run build
```

## Setup

1. **Get your API key** from your Imagic profile page
2. **Set environment variable** (recommended):
   ```bash
   export IMAGIC_API_KEY="your-api-key-here"
   export IMAGIC_BASE_URL="https://your-imagic-domain.com"  # optional
   ```

## Basic Usage

### JavaScript

```javascript
const { ImagicClient } = require("@imagic/sdk");

const client = new ImagicClient({
  apiKey: process.env.IMAGIC_API_KEY,
  baseUrl: "https://your-imagic-domain.com",
});

// Upload a single image
async function upload() {
  try {
    const result = await client.upload("./image.jpg");
    console.log("Success:", result.data.url);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

upload();
```

### TypeScript

```typescript
import { ImagicClient, ApiResponse } from "@imagic/sdk";

const client = new ImagicClient({
  apiKey: process.env.IMAGIC_API_KEY!,
  baseUrl: "https://your-imagic-domain.com",
});

async function upload(): Promise<void> {
  const result: ApiResponse = await client.upload("./image.jpg");

  if (result.success) {
    console.log("Image URL:", result.data.url);
  }
}
```

## CLI Usage

```bash
# Test connection
npm run cli test

# Upload single image
npm run cli upload ./image.jpg

# Upload all images in directory
npm run cli batch ./photos

# Get API info
npm run cli info
```

## Examples

Run the example scripts:

```bash
# Basic upload example
npm run example:basic

# Batch upload example
npm run example:batch ./path/to/images

# TypeScript example
npm run example:typescript
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with API key for integration tests
IMAGIC_API_KEY=your-key npm test
```

## Development

```bash
# Watch for changes and rebuild
npm run dev

# Clean build directory
npm run clean

# Build for production
npm run build
```

## Troubleshooting

1. **"Cannot find module" errors**: Make sure to run `npm run build` first
2. **Authentication errors**: Check your API key in the profile page
3. **Network errors**: Verify the base URL is correct
4. **File not found**: Use absolute paths or check file exists

## Support

- Check the [README.md](README.md) for full documentation
- Run `npm run cli -- --help` for CLI usage
- Visit `/api/v1` endpoint for API documentation
