// Batch operations demo
const { ImagicClient } = require("@imagic/sdk");

async function batchDemo() {
  console.log("🚀 Batch Upload Demo Starting...\n");

  if (!process.env.IMAGIC_API_KEY) {
    console.error("❌ IMAGIC_API_KEY environment variable is required");
    process.exit(1);
  }

  const client = new ImagicClient({
    apiKey: process.env.IMAGIC_API_KEY,
    baseUrl: process.env.IMAGIC_BASE_URL || "http://localhost:3000",
  });

  try {
    // Test connection first
    console.log("🔌 Testing connection...");
    const isConnected = await client.testConnection();

    if (!isConnected) {
      throw new Error("Failed to connect to API");
    }

    console.log("✅ Connected!\n");

    // Create multiple test images
    console.log("🖼️  Creating test images...");
    const testImages = createMultipleTestImages();
    console.log(`✅ Created ${testImages.length} test images\n`);

    // Test batch upload
    console.log("📦 Starting batch upload...");
    const startTime = Date.now();

    const results = await client.uploadMultiple(testImages);

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Analyze results
    let successCount = 0;
    let failCount = 0;
    let totalSize = 0;

    console.log("\n📋 Results:");
    results.forEach((result, index) => {
      if (result.success) {
        successCount++;
        totalSize += result.data.size;
        console.log(
          `✅ Image ${index + 1}: ${result.data.name} (${result.data.size} bytes)`
        );
      } else {
        failCount++;
        console.log(`❌ Image ${index + 1}: ${result.message}`);
      }
    });

    // Summary
    console.log("\n📊 Summary:");
    console.log(`   ✅ Successful uploads: ${successCount}`);
    console.log(`   ❌ Failed uploads: ${failCount}`);
    console.log(`   📁 Total size: ${totalSize} bytes`);
    console.log(`   ⏱️  Duration: ${duration}ms`);
    console.log(
      `   📈 Average per image: ${Math.round(duration / testImages.length)}ms`
    );

    if (successCount > 0) {
      console.log("\n🔗 Upload URLs:");
      results.forEach((result, index) => {
        if (result.success) {
          console.log(`   ${index + 1}. ${result.data.url}`);
        }
      });
    }
  } catch (error) {
    console.error("❌ Batch demo failed:", error.message);
    process.exit(1);
  }
}

function createMultipleTestImages() {
  const images = [];

  // Create different sized PNG images
  for (let i = 1; i <= 5; i++) {
    const image = createTestPNG();
    images.push({
      buffer: image,
      filename: `batch-test-${i}.png`,
      contentType: "image/png",
    });
  }

  // Create different JPEG images
  for (let i = 1; i <= 3; i++) {
    const image = createTestJPEG();
    images.push({
      buffer: image,
      filename: `batch-test-${i}.jpg`,
      contentType: "image/jpeg",
    });
  }

  // Return as buffers with options
  return images.map((img) => img.buffer);
}

function createTestPNG() {
  return Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
    0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
    0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
  ]);
}

function createTestJPEG() {
  return Buffer.from([
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
}

if (require.main === module) {
  batchDemo()
    .then(() => {
      console.log("\n✨ Batch demo completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Batch demo failed:", error);
      process.exit(1);
    });
}
