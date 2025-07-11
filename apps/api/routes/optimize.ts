import express, { Request, Response, Router } from "express";
import sharp from "sharp";
import fetch from "node-fetch";

// Type definitions
type ImageFormat = "jpeg" | "png" | "webp" | "original";

interface QueryParams {
  original?: string;
  quality?: string;
  format?: string;
  width?: string;
  height?: string;
  autoOptimize?: string;
}

const router: Router = express.Router();

router.get("/assets/:userid/:imageid", async (req: Request, res: Response) => {
  try {
    // Parse the image path from params
    const { userid, imageid } = req.params;
    const imagePath = `${userid}/${imageid}`;
    const {
      original,
      quality = "80",
      format = "original",
      width,
      height,
      autoOptimize = "false",
    } = req.query as QueryParams;

    console.log("=== Image Optimization Request ===");
    console.log("Image path:", imagePath);
    console.log("Query params:", req.query);
    console.log("User-Agent:", req.headers["user-agent"]);
    console.log("Environment R2 URL:", process.env.NEXT_PUBLIC_R2_PUBLIC_URL);

    // Device detection from User-Agent
    const userAgent = req.headers["user-agent"] || "";
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
    const isTablet = /iPad|Android/i.test(userAgent) && !isMobile;
    const isDesktop = !isMobile && !isTablet;

    console.log("Device info:", { isMobile, isTablet, isDesktop });

    // Get optimization parameters with auto-optimization logic
    let qualityNum = parseInt(quality);
    let formatChoice: ImageFormat = format as ImageFormat;
    let widthNum = width ? parseInt(width) : undefined;
    let heightNum = height ? parseInt(height) : undefined;

    // Apply auto-optimization if enabled
    if (autoOptimize === "true") {
      console.log("Applying auto-optimization...");

      if (isMobile) {
        qualityNum = 50;
        formatChoice = "webp";
        widthNum = widthNum || 800;
      } else if (isTablet) {
        qualityNum = 75;
        formatChoice = "webp";
        widthNum = widthNum || 1200;
      } else if (isDesktop) {
        qualityNum = 90;
        formatChoice = "webp";
      }

      console.log("Auto-optimization applied:", {
        qualityNum,
        formatChoice,
        widthNum,
        heightNum,
      });
    }

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

    // Check if the image is empty
    if (imageBuffer.length === 0) {
      console.log("Empty image buffer");
      return res.status(404).json({ error: "Image not found" });
    }

    // If original image is requested, return it without any processing
    if (original === "true") {
      console.log("Returning original image without processing");
      res.set(
        "Content-Type",
        response.headers.get("content-type") || "image/jpeg"
      );
      res.set("Cache-Control", "public, max-age=31536000, immutable");
      res.set("Content-Length", imageBuffer.length.toString());
      res.set(
        "X-Device-Type",
        isMobile ? "mobile" : isTablet ? "tablet" : "desktop"
      );
      return res.send(imageBuffer);
    }

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
    let outputBuffer: Buffer;
    let contentType: string;

    switch (formatChoice) {
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
    res.set(
      "X-Device-Type",
      isMobile ? "mobile" : isTablet ? "tablet" : "desktop"
    );

    res.send(outputBuffer);
  } catch (error) {
    console.error("Image optimization error:", error);
    res.status(500).json({ error: "Failed to optimize image" });
  }
});

export default router;
