// Multiple images upload example
const { ImagicClient } = require("@imagic/sdk");
const fs = require("fs").promises;
const path = require("path");

async function batchUploadExample() {
  const client = new ImagicClient({
    apiKey: process.env.IMAGIC_API_KEY || "your-api-key-here",
    baseUrl: process.env.IMAGIC_BASE_URL || "http://localhost:3000",
  });

  try {
    // Directory containing images to upload
    const imageDirectory = process.argv[2] || "./images";

    console.log(`📁 Scanning directory: ${imageDirectory}`);

    // Read directory and filter image files
    const files = await fs.readdir(imageDirectory);
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".bmp",
      ".svg",
    ];

    const imagePaths = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .map((file) => path.join(imageDirectory, file));

    if (imagePaths.length === 0) {
      console.log("❌ No image files found in directory");
      return;
    }

    console.log(`📊 Found ${imagePaths.length} image(s) to upload:`);
    imagePaths.forEach((filePath, index) => {
      console.log(`  ${index + 1}. ${path.basename(filePath)}`);
    });

    // Upload all images
    console.log("\n📤 Starting batch upload...");
    const results = await client.uploadMultiple(imagePaths);

    // Process results
    let successCount = 0;
    let failCount = 0;

    console.log("\n📋 Upload Results:");
    results.forEach((result, index) => {
      const filename = path.basename(imagePaths[index]);

      if (result.success) {
        successCount++;
        console.log(`✅ ${filename}`);
        console.log(`   🔗 URL: ${result.data.url}`);
        console.log(`   📊 Size: ${result.data.size} bytes`);
      } else {
        failCount++;
        console.log(`❌ ${filename}`);
        console.log(`   💬 Error: ${result.message}`);
      }
      console.log(""); // Empty line for readability
    });

    // Summary
    console.log("📈 Summary:");
    console.log(`   ✅ Successful uploads: ${successCount}`);
    console.log(`   ❌ Failed uploads: ${failCount}`);
    console.log(`   📊 Total: ${results.length}`);
  } catch (error) {
    console.error("💥 Batch upload failed:", error.message);

    if (error.statusCode) {
      console.error("📊 Status Code:", error.statusCode);
    }
  }
}

// Usage instructions
function showUsage() {
  console.log("Usage: node batch-upload.js [image-directory]");
  console.log("");
  console.log("Examples:");
  console.log("  node batch-upload.js ./photos");
  console.log("  node batch-upload.js /home/user/images");
  console.log("");
  console.log("Environment variables:");
  console.log("  IMAGIC_API_KEY: Your Imagic API key (required)");
  console.log("  IMAGIC_BASE_URL: Base URL of Imagic API (optional)");
}

// Run the example
if (require.main === module) {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    showUsage();
    process.exit(0);
  }

  if (!process.env.IMAGIC_API_KEY) {
    console.error("❌ IMAGIC_API_KEY environment variable is required");
    showUsage();
    process.exit(1);
  }

  batchUploadExample()
    .then(() => {
      console.log("✨ Batch upload completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Batch upload failed:", error.message);
      process.exit(1);
    });
}

module.exports = { batchUploadExample };
