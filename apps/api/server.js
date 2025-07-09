require("dotenv").config();
const express = require("express");
const sharp = require("sharp");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 3001;

// Add CORS middleware for all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  next();
});

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Image optimization route inspired by optimize.ts
app.get("/assets/:userid/:imageid", async (req, res) => {
  try {
    // Parse the image path from params
    const { userid, imageid } = req.params;
    const imagePath = `${userid}/${imageid}`;
    const { quality = "80", format = "original", width, height } = req.query;

    console.log("=== Image Optimization Request ===");
    console.log("Image path:", imagePath);
    console.log("Query params:", req.query);
    console.log("Environment R2 URL:", process.env.NEXT_PUBLIC_R2_PUBLIC_URL);

    // Get optimization parameters
    const qualityNum = parseInt(quality);
    const widthNum = width ? parseInt(width) : undefined;
    const heightNum = height ? parseInt(height) : undefined;

    // Fetch the original image
    const imageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imagePath}`;
    console.log("Fetching image from:", imageUrl);

    const response = await fetch(imageUrl);
    console.log("Fetch response status:", response.status, response.statusText);

    if (!response.ok) {
      console.log("Image fetch failed:", response.status, response.statusText);
      return res.status(404).json({ error: "Image not found" });
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());
    console.log("Image buffer size:", imageBuffer.length);

    // Create sharp instance
    let sharpInstance = sharp(imageBuffer);

    // Apply resizing if specified
    if (widthNum || heightNum) {
      console.log("Resizing to:", widthNum, "x", heightNum);
      sharpInstance = sharpInstance.resize(widthNum, heightNum, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Apply format conversion and quality
    let outputBuffer;
    let contentType;

    switch (format) {
      case "webp":
        outputBuffer = await sharpInstance
          .webp({ quality: qualityNum })
          .toBuffer();
        contentType = "image/webp";
        break;
      case "jpeg":
        outputBuffer = await sharpInstance
          .jpeg({ quality: qualityNum })
          .toBuffer();
        contentType = "image/jpeg";
        break;
      case "png":
        outputBuffer = await sharpInstance
          .png({
            quality: qualityNum,
            compressionLevel: 9,
          })
          .toBuffer();
        contentType = "image/png";
        break;
      default: {
        // Return original format with quality adjustment if possible
        const originalFormat = response.headers.get("content-type");
        if (originalFormat?.includes("jpeg")) {
          outputBuffer = await sharpInstance
            .jpeg({ quality: qualityNum })
            .toBuffer();
          contentType = "image/jpeg";
        } else if (originalFormat?.includes("png")) {
          outputBuffer = await sharpInstance
            .png({
              quality: qualityNum,
              compressionLevel: 9,
            })
            .toBuffer();
          contentType = "image/png";
        } else if (originalFormat?.includes("webp")) {
          outputBuffer = await sharpInstance
            .webp({ quality: qualityNum })
            .toBuffer();
          contentType = "image/webp";
        } else {
          // Fallback to original
          outputBuffer = imageBuffer;
          contentType = originalFormat || "image/jpeg";
        }
        break;
      }
    }

    // Set appropriate headers
    res.set("Content-Type", contentType);
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.set("Content-Length", outputBuffer.length.toString());

    res.send(outputBuffer);
  } catch (error) {
    console.error("Image optimization error:", error);
    res.status(500).json({ error: "Failed to optimize image" });
  }
});

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
