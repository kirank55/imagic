// Basic usage example for the Imagic SDK
const { ImagicClient } = require("@imagic/sdk");

async function basicExample() {
  // Initialize the client
  const client = new ImagicClient({
    apiKey: process.env.IMAGIC_API_KEY || "your-api-key-here",
    baseUrl: process.env.IMAGIC_BASE_URL || "http://localhost:3000",
  });

  try {
    // Test connection
    console.log("Testing API connection...");
    const isConnected = await client.testConnection();

    if (!isConnected) {
      console.error("❌ Failed to connect to Imagic API");
      return;
    }

    console.log("✅ Connected to Imagic API");

    // Get API info
    const apiInfo = await client.getApiInfo();
    console.log("📋 API Info:", {
      name: apiInfo.name,
      version: apiInfo.version,
      description: apiInfo.description,
    });

    // Upload a single image (replace with actual image path)
    const imagePath = "./example-image.jpg";
    console.log(`📤 Uploading image: ${imagePath}`);

    const uploadResult = await client.upload(imagePath);

    if (uploadResult.success) {
      console.log("✅ Upload successful!");
      console.log("🔗 Image URL:", uploadResult.data.url);
      console.log("📊 File size:", uploadResult.data.size, "bytes");
      console.log("🏷️  File type:", uploadResult.data.type);
    } else {
      console.error("❌ Upload failed:", uploadResult.message);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);

    if (error.statusCode) {
      console.error("📊 Status Code:", error.statusCode);
    }

    if (error.errorType) {
      console.error("🏷️  Error Type:", error.errorType);
    }
  }
}

// Run the example
if (require.main === module) {
  basicExample()
    .then(() => {
      console.log("✨ Example completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Example failed:", error.message);
      process.exit(1);
    });
}

module.exports = { basicExample };
