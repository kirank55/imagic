#!/usr/bin/env node

// CLI tool for testing the Imagic SDK
const { ImagicClient } = require("../dist");
const fs = require("fs");
const path = require("path");

function showHelp() {
  console.log(`
🖼️  Imagic SDK CLI Tool

Usage: node cli.js <command> [options]

Commands:
  test                    Test API connection
  upload <file>          Upload a single image
  batch <directory>      Upload all images in a directory
  info                   Get API information

Options:
  --api-key <key>        API key (or set IMAGIC_API_KEY env var)
  --base-url <url>       Base URL (or set IMAGIC_BASE_URL env var)
  --help, -h             Show this help message

Examples:
  node cli.js test
  node cli.js upload ./image.jpg
  node cli.js batch ./photos
  node cli.js info --api-key your-key --base-url https://api.imagic.com

Environment Variables:
  IMAGIC_API_KEY         Your Imagic API key
  IMAGIC_BASE_URL        Imagic API base URL (default: http://localhost:3000)
`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    command: args[0],
    target: args[1],
    apiKey: process.env.IMAGIC_API_KEY,
    baseUrl: process.env.IMAGIC_BASE_URL || "http://localhost:3000",
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--api-key" && args[i + 1]) {
      parsed.apiKey = args[i + 1];
      i++;
    } else if (args[i] === "--base-url" && args[i + 1]) {
      parsed.baseUrl = args[i + 1];
      i++;
    } else if (args[i] === "--help" || args[i] === "-h") {
      showHelp();
      process.exit(0);
    }
  }

  return parsed;
}

async function testConnection(client) {
  console.log("🔌 Testing API connection...");

  try {
    const isConnected = await client.testConnection();

    if (isConnected) {
      console.log("✅ Connection successful!");

      const info = await client.getApiInfo();
      console.log(`📋 Connected to ${info.name} v${info.version}`);
    } else {
      console.log("❌ Connection failed");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Connection error:", error.message);
    process.exit(1);
  }
}

async function uploadFile(client, filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`📤 Uploading: ${filePath}`);

  try {
    const result = await client.upload(filePath);

    if (result.success) {
      console.log("✅ Upload successful!");
      console.log(`🔗 URL: ${result.data.url}`);
      console.log(`📊 Size: ${result.data.size} bytes`);
      console.log(`🏷️  Type: ${result.data.type}`);
    } else {
      console.error("❌ Upload failed:", result.message);
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Upload error:", error.message);
    process.exit(1);
  }
}

async function batchUpload(client, directory) {
  if (!fs.existsSync(directory)) {
    console.error(`❌ Directory not found: ${directory}`);
    process.exit(1);
  }

  const files = fs.readdirSync(directory);
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
    .map((file) => path.join(directory, file));

  if (imagePaths.length === 0) {
    console.log("❌ No image files found in directory");
    return;
  }

  console.log(`📁 Found ${imagePaths.length} image(s) in ${directory}`);
  console.log("📤 Starting batch upload...");

  try {
    const results = await client.uploadMultiple(imagePaths);

    let successCount = 0;
    let failCount = 0;

    results.forEach((result, index) => {
      const filename = path.basename(imagePaths[index]);

      if (result.success) {
        successCount++;
        console.log(`✅ ${filename} -> ${result.data.url}`);
      } else {
        failCount++;
        console.log(`❌ ${filename} -> ${result.message}`);
      }
    });

    console.log(
      `\n📈 Summary: ${successCount} successful, ${failCount} failed`
    );
  } catch (error) {
    console.error("❌ Batch upload error:", error.message);
    process.exit(1);
  }
}

async function getApiInfo(client) {
  console.log("📋 Getting API information...");

  try {
    const info = await client.getApiInfo();

    console.log(`
📋 API Information:
   Name: ${info.name}
   Version: ${info.version}
   Description: ${info.description}
   
🔧 Endpoints:
   Upload: ${info.endpoints.upload.method} ${info.endpoints.upload.path}
   
🔑 Authentication:
   Type: ${info.authentication.type}
   Description: ${info.authentication.description}
`);
  } catch (error) {
    console.error("❌ Failed to get API info:", error.message);
    process.exit(1);
  }
}

async function main() {
  const args = parseArgs();

  if (!args.command) {
    showHelp();
    process.exit(1);
  }

  if (!args.apiKey) {
    console.error(
      "❌ API key is required. Set IMAGIC_API_KEY environment variable or use --api-key option"
    );
    process.exit(1);
  }

  const client = new ImagicClient({
    apiKey: args.apiKey,
    baseUrl: args.baseUrl,
  });

  switch (args.command) {
    case "test":
      await testConnection(client);
      break;

    case "upload":
      if (!args.target) {
        console.error("❌ File path is required for upload command");
        process.exit(1);
      }
      await uploadFile(client, args.target);
      break;

    case "batch":
      if (!args.target) {
        console.error("❌ Directory path is required for batch command");
        process.exit(1);
      }
      await batchUpload(client, args.target);
      break;

    case "info":
      await getApiInfo(client);
      break;

    default:
      console.error(`❌ Unknown command: ${args.command}`);
      showHelp();
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("💥 CLI error:", error.message);
    process.exit(1);
  });
}
