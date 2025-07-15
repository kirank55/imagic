// TypeScript demo to test type safety and advanced features
import {
  ImagicClient,
  ImagicClientConfig,
  UploadOptions,
  ApiResponse,
  ValidationError,
  AuthenticationError,
  NetworkError,
  ImagicError,
} from "@imagic/sdk";

async function typescriptDemo(): Promise<void> {
  console.log("🚀 TypeScript SDK Demo Starting...\n");

  // Check environment
  if (!process.env.IMAGIC_API_KEY) {
    console.error("❌ IMAGIC_API_KEY environment variable is required");
    console.error('💡 Set it with: export IMAGIC_API_KEY="your-api-key"');
    process.exit(1);
  }

  // Type-safe configuration
  const config: ImagicClientConfig = {
    apiKey: process.env.IMAGIC_API_KEY!,
    baseUrl: process.env.IMAGIC_BASE_URL || "http://localhost:3000",
    timeout: 60000,
  };

  const client = new ImagicClient(config);

  try {
    // Test connection with proper typing
    console.log("🔌 Testing API connection...");
    const isConnected: boolean = await client.testConnection();

    if (!isConnected) {
      throw new Error("Failed to connect to Imagic API");
    }

    console.log("✅ Connected to Imagic API\n");

    // Create test images with different types
    const testImages = createTestImages();
    console.log("🖼️  Created test images for different formats\n");

    // Test single uploads with typed options
    for (const [format, buffer] of Object.entries(testImages)) {
      console.log(`📤 Testing ${format.toUpperCase()} upload...`);

      const options: UploadOptions = {
        filename: `test-${format}.${format}`,
        contentType: `image/${format}`,
      };

      try {
        const result: ApiResponse = await client.upload(buffer, options);

        if (result.success) {
          console.log("✅ Upload successful!");
          console.log(`   📋 ID: ${result.data!.id}`);
          console.log(`   🔗 URL: ${result.data!.url}`);
          console.log(`   📊 Size: ${result.data!.size} bytes`);
        } else {
          console.log("❌ Upload failed:", result.message);
        }
      } catch (error) {
        console.log(
          `❌ Upload error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }

      console.log(""); // Empty line for readability
    }

    // Test batch upload
    console.log("📦 Testing batch upload...");
    const buffers = Object.values(testImages);

    try {
      const results: ApiResponse[] = await client.uploadMultiple(buffers);

      let successCount = 0;
      let failCount = 0;

      results.forEach((result, index) => {
        if (result.success) {
          successCount++;
          console.log(`✅ Batch item ${index + 1}: Success`);
        } else {
          failCount++;
          console.log(`❌ Batch item ${index + 1}: ${result.message}`);
        }
      });

      console.log(
        `📊 Batch results: ${successCount} success, ${failCount} failed\n`
      );
    } catch (error) {
      console.log(
        "❌ Batch upload failed:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }

    // Test error handling with proper types
    console.log("🧪 Testing error handling...");

    try {
      // Test with invalid API key
      const invalidClient = new ImagicClient({
        apiKey: "invalid-key",
        baseUrl: config.baseUrl,
      });

      await invalidClient.upload(testImages.png);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        console.log("✅ AuthenticationError caught correctly");
        console.log(`   💬 Message: ${error.message}`);
      } else if (error instanceof ValidationError) {
        console.log("✅ ValidationError caught correctly");
        console.log(`   💬 Message: ${error.message}`);
      } else if (error instanceof NetworkError) {
        console.log("✅ NetworkError caught correctly");
        console.log(`   💬 Message: ${error.message}`);
      } else if (error instanceof ImagicError) {
        console.log("✅ ImagicError caught correctly");
        console.log(`   💬 Message: ${error.message}`);
        console.log(`   📊 Status: ${error.statusCode}`);
      } else {
        console.log("⚠️  Unexpected error type:", error);
      }
    }

    console.log("\n🎉 TypeScript demo completed successfully!");
  } catch (error) {
    console.error(
      "\n❌ Demo failed:",
      error instanceof Error ? error.message : "Unknown error"
    );
    process.exit(1);
  }
}

// Create test images for different formats
function createTestImages(): Record<string, Buffer> {
  // Minimal 1x1 PNG (transparent)
  const png = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
    0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ]);

  // Minimal 1x1 JPEG (red pixel)
  const jpeg = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
    0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
    0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
    0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20,
    0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29,
    0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32,
    0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
    0xff, 0xc4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xff, 0xc4,
    0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xda, 0x00, 0x0c,
    0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3f, 0x00, 0x00, 0xff,
    0xd9,
  ]);

  return {
    png,
    jpeg,
  };
}

// Run the demo
if (require.main === module) {
  typescriptDemo()
    .then(() => {
      console.log("\n✨ TypeScript demo completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 TypeScript demo failed:", error);
      process.exit(1);
    });
}

export { typescriptDemo };
