// Basic SDK demo - tests core functionality
const { ImagicClient } = require("@imagic/sdk");
const fs = require("fs");
const path = require("path");

async function runDemo() {
  console.log("🚀 Imagic SDK Demo Starting...\n");

  // Check environment
  if (!process.env.IMAGIC_API_KEY) {
    console.error("❌ IMAGIC_API_KEY environment variable is required");
    console.log('💡 Set it with: export IMAGIC_API_KEY="your-api-key"');
    process.exit(1);
  }

  // Initialize client
  const client = new ImagicClient({
    apiKey: process.env.IMAGIC_API_KEY,
    baseUrl: process.env.IMAGIC_BASE_URL || "http://localhost:3000",
    timeout: 30000,
  });

  try {
    // Test 1: Connection Test
    console.log("🔌 Test 1: Testing API connection...");
    const isConnected = await client.testConnection();

    if (isConnected) {
      console.log("✅ Connection successful!\n");
    } else {
      console.log("❌ Connection failed\n");
      return;
    }

    // Test 2: Get API Info
    console.log("📋 Test 2: Getting API information...");
    const apiInfo = await client.getApiInfo();
    console.log(`✅ Connected to ${apiInfo.name} v${apiInfo.version}`);
    console.log(`📝 Description: ${apiInfo.description}\n`);

    // Test 3: Create a test image buffer
    console.log("🖼️  Test 3: Creating test image...");
    const testImageBuffer = createTestImage();
    console.log("✅ Test image created (1x1 PNG)\n");

    // Test 4: Upload from Buffer
    console.log("📤 Test 4: Uploading test image from buffer...");
    const uploadResult = await client.upload(testImageBuffer, {
      filename: "sdk-demo-test.png",
      contentType: "image/png",
    });

    if (uploadResult.success) {
      console.log("✅ Upload successful!");
      console.log(`🔗 URL: ${uploadResult.data.url}`);
      console.log(`📊 Size: ${uploadResult.data.size} bytes`);
      console.log(`🏷️  Type: ${uploadResult.data.type}`);
      console.log(`📅 Uploaded: ${uploadResult.data.uploadedAt}\n`);
    } else {
      console.log("❌ Upload failed:", uploadResult.message);
    }

    // Test 5: Test error handling
    console.log("🧪 Test 5: Testing error handling...");
    try {
      // Try to upload an invalid file
      await client.upload(Buffer.from("invalid image data"), {
        filename: "invalid.txt",
        contentType: "text/plain",
      });
    } catch (error) {
      console.log("✅ Error handling works correctly");
      console.log(`📝 Error type: ${error.constructor.name}`);
      console.log(`💬 Message: ${error.message}\n`);
    }

    console.log("🎉 All tests completed successfully!");
  } catch (error) {
    console.error("❌ Demo failed:", error.message);
    if (error.statusCode) {
      console.error("📊 Status Code:", error.statusCode);
    }
    if (error.errorType) {
      console.error("🏷️  Error Type:", error.errorType);
    }
    process.exit(1);
  }
}

// Create a minimal 1x1 PNG image for testing
function createTestImage() {
  // Minimal 1x1 transparent PNG (67 bytes)
  const pngData = Buffer.from([
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a, // PNG signature
    0x00,
    0x00,
    0x00,
    0x0d,
    0x49,
    0x48,
    0x44,
    0x52, // IHDR chunk
    0x00,
    0x00,
    0x00,
    0x01,
    0x00,
    0x00,
    0x00,
    0x01, // 1x1 dimensions
    0x08,
    0x06,
    0x00,
    0x00,
    0x00,
    0x1f,
    0x15,
    0xc4, // bit depth, color type, etc.
    0x89,
    0x00,
    0x00,
    0x00,
    0x0a,
    0x49,
    0x44,
    0x41, // CRC, IDAT chunk
    0x54,
    0x78,
    0x9c,
    0x63,
    0x00,
    0x01,
    0x00,
    0x00, // compressed data
    0x05,
    0x00,
    0x01,
    0x0d,
    0x0a,
    0x2d,
    0xb4,
    0x00, // more compressed data
    0x00,
    0x00,
    0x00,
    0x49,
    0x45,
    0x4e,
    0x44,
    0xae, // IEND chunk
    0x42,
    0x60,
    0x82, // CRC
  ]);

  return pngData;
}

// Show usage if no API key
function showUsage() {
  console.log("Usage: npm start");
  console.log("");
  console.log("Environment Variables:");
  console.log("  IMAGIC_API_KEY    Your Imagic API key (required)");
  console.log("  IMAGIC_BASE_URL   Imagic API base URL (optional)");
  console.log("");
  console.log("Example:");
  console.log("  IMAGIC_API_KEY=your-key npm start");
}

if (require.main === module) {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    showUsage();
    process.exit(0);
  }

  runDemo()
    .then(() => {
      console.log("\n✨ Demo completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Demo failed:", error.message);
      process.exit(1);
    });
}
