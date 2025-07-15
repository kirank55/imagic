// TypeScript example showing type-safe usage
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
import * as fs from "fs";

async function typescriptExample(): Promise<void> {
  // Type-safe configuration
  const config: ImagicClientConfig = {
    apiKey: process.env.IMAGIC_API_KEY!,
    baseUrl: process.env.IMAGIC_BASE_URL || "http://localhost:3000",
    timeout: 60000, // 60 seconds
  };

  const client = new ImagicClient(config);

  try {
    // Test connection with type safety
    console.log("🔌 Testing API connection...");
    const isConnected: boolean = await client.testConnection();

    if (!isConnected) {
      throw new Error("Failed to connect to Imagic API");
    }

    console.log("✅ Connected to Imagic API");

    // Upload with typed options
    const uploadOptions: UploadOptions = {
      filename: "typescript-example.jpg",
      contentType: "image/jpeg",
    };

    // Example 1: Upload from file path
    const imagePath = "./example-image.jpg";
    console.log(`📤 Uploading from path: ${imagePath}`);

    const uploadResult: ApiResponse = await client.upload(
      imagePath,
      uploadOptions
    );

    if (uploadResult.success) {
      console.log("✅ Upload successful!");
      console.log("📋 Upload details:", {
        id: uploadResult.data!.id,
        url: uploadResult.data!.url,
        name: uploadResult.data!.name,
        size: uploadResult.data!.size,
        type: uploadResult.data!.type,
        uploadedAt: uploadResult.data!.uploadedAt,
      });
    }

    // Example 2: Upload from Buffer
    if (fs.existsSync("./another-image.png")) {
      console.log("\n📤 Uploading from Buffer...");

      const imageBuffer: Buffer = fs.readFileSync("./another-image.png");

      const bufferOptions: UploadOptions = {
        filename: "buffer-upload.png",
        contentType: "image/png",
      };

      const bufferResult: ApiResponse = await client.upload(
        imageBuffer,
        bufferOptions
      );

      if (bufferResult.success) {
        console.log("✅ Buffer upload successful!");
        console.log("🔗 URL:", bufferResult.data!.url);
      }
    }

    // Example 3: Multiple uploads with proper typing
    const imagePaths: string[] = ["./image1.jpg", "./image2.png"];

    // Filter existing files
    const existingPaths = imagePaths.filter((path) => fs.existsSync(path));

    if (existingPaths.length > 0) {
      console.log("\n📤 Uploading multiple images...");

      const multipleResults: ApiResponse[] = await client.uploadMultiple(
        existingPaths
      );

      multipleResults.forEach((result, index) => {
        if (result.success) {
          console.log(`✅ ${existingPaths[index]}: ${result.data!.url}`);
        } else {
          console.log(`❌ ${existingPaths[index]}: ${result.message}`);
        }
      });
    }

    // Example 4: Get API info with types
    console.log("\n📋 Getting API information...");
    const apiInfo = await client.getApiInfo();

    console.log("🔧 API Details:", {
      name: apiInfo.name,
      version: apiInfo.version,
      description: apiInfo.description,
      uploadEndpoint: apiInfo.endpoints.upload.path,
    });
  } catch (error) {
    // Type-safe error handling
    if (error instanceof ValidationError) {
      console.error("❌ Validation Error:", error.message);
      console.error("🏷️  Error Type:", error.errorType);
    } else if (error instanceof AuthenticationError) {
      console.error("❌ Authentication Error:", error.message);
      console.error("🔑 Check your API key");
    } else if (error instanceof NetworkError) {
      console.error("❌ Network Error:", error.message);
      console.error("🌐 Check your internet connection and base URL");
    } else if (error instanceof ImagicError) {
      console.error("❌ Imagic API Error:", error.message);
      console.error("📊 Status Code:", error.statusCode);
      console.error("🏷️  Error Type:", error.errorType);
    } else if (error instanceof Error) {
      console.error("❌ Unknown Error:", error.message);
    } else {
      console.error("❌ Unexpected error:", error);
    }
  }
}

// Helper function to check environment
function checkEnvironment(): boolean {
  if (!process.env.IMAGIC_API_KEY) {
    console.error("❌ IMAGIC_API_KEY environment variable is required");
    console.error('💡 Set it with: export IMAGIC_API_KEY="your-api-key"');
    return false;
  }

  return true;
}

// Run the example
if (require.main === module) {
  if (!checkEnvironment()) {
    process.exit(1);
  }

  typescriptExample()
    .then(() => {
      console.log("\n✨ TypeScript example completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 TypeScript example failed:", error);
      process.exit(1);
    });
}

export { typescriptExample };
