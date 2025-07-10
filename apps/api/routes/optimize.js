const express = require("express");
const sharp = require("sharp");
const fetch = require("node-fetch");
const router = express.Router();

router.get("/assets/:userid/:imageid", async (req, res) => {
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
    } = req.query;

    console.log("=== Image Optimization Request ===");
    console.log("Image path:", imagePath);
    console.log("Query params:", req.query);
    console.log("User-Agent:", req.headers["user-agent"]);
    console.log("Connection headers:", {
      "save-data": req.headers["save-data"],
      downlink: req.headers["downlink"],
      rtt: req.headers["rtt"],
      ect: req.headers["ect"],
      "effective-connection-type": req.headers["effective-connection-type"],
      "connection-type": req.headers["connection-type"],
      accept: req.headers["accept"]?.includes("webp")
        ? "supports webp"
        : "no webp support",
    });
    console.log("Environment R2 URL:", process.env.NEXT_PUBLIC_R2_PUBLIC_URL);

    // Device detection from User-Agent
    const userAgent = req.headers["user-agent"] || "";
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
    const isTablet = /iPad|Android/i.test(userAgent) && !isMobile;
    const isDesktop = !isMobile && !isTablet;

    // Enhanced connection detection
    const connection = detectConnection(req.headers, userAgent);

    function detectConnection(headers, userAgent) {
      // Check for explicit save-data header (highest priority)
      if (headers["save-data"] === "on") {
        console.log("Connection: slow (save-data header)");
        return "slow";
      }

      // Check for Network Information API headers (Chrome/Edge)
      const downlink = headers["downlink"]
        ? parseFloat(headers["downlink"])
        : null;
      const rtt = headers["rtt"] ? parseInt(headers["rtt"]) : null;
      const effectiveType =
        headers["ect"] || headers["effective-connection-type"];

      // Effective connection type is most reliable when available
      if (effectiveType) {
        const slowTypes = ["slow-2g", "2g"];
        const moderateTypes = ["3g"];
        const fastTypes = ["4g"];

        if (slowTypes.includes(effectiveType)) {
          console.log(
            "Connection: slow (effective-connection-type:",
            effectiveType,
            ")"
          );
          return "slow";
        }
        if (moderateTypes.includes(effectiveType)) {
          console.log(
            "Connection: moderate (effective-connection-type:",
            effectiveType,
            ")"
          );
          return "moderate";
        }
        if (fastTypes.includes(effectiveType)) {
          console.log(
            "Connection: fast (effective-connection-type:",
            effectiveType,
            ")"
          );
          return "fast";
        }
      }

      // Check downlink speed (Mbps)
      if (downlink !== null) {
        if (downlink < 1.5) {
          console.log("Connection: slow (downlink:", downlink, "Mbps)");
          return "slow";
        }
        if (downlink < 4) {
          console.log("Connection: moderate (downlink:", downlink, "Mbps)");
          return "moderate";
        }
        console.log("Connection: fast (downlink:", downlink, "Mbps)");
        return "fast";
      }

      // Check RTT (Round Trip Time in ms)
      if (rtt !== null) {
        if (rtt > 300) {
          console.log("Connection: slow (rtt:", rtt, "ms)");
          return "slow";
        }
        if (rtt > 150) {
          console.log("Connection: moderate (rtt:", rtt, "ms)");
          return "moderate";
        }
        console.log("Connection: fast (rtt:", rtt, "ms)");
        return "fast";
      }

      // Check connection type header (some mobile browsers)
      const connectionType = headers["connection-type"];
      if (connectionType) {
        const slowTypes = [
          "cellular",
          "2g",
          "3g",
          "slow-2g",
          "bluetooth",
          "wimax",
        ];
        const moderateTypes = ["4g", "lte"];
        const fastTypes = ["wifi", "ethernet"];

        if (slowTypes.includes(connectionType.toLowerCase())) {
          console.log(
            "Connection: slow (connection-type:",
            connectionType,
            ")"
          );
          return "slow";
        }
        if (moderateTypes.includes(connectionType.toLowerCase())) {
          console.log(
            "Connection: moderate (connection-type:",
            connectionType,
            ")"
          );
          return "moderate";
        }
        if (fastTypes.includes(connectionType.toLowerCase())) {
          console.log(
            "Connection: fast (connection-type:",
            connectionType,
            ")"
          );
          return "fast";
        }
      }

      // Check for additional connection hints
      const accept = headers["accept"] || "";
      const acceptEncoding = headers["accept-encoding"] || "";

      // If the client doesn't support modern image formats, might be on slower connection
      if (!accept.includes("webp") && !accept.includes("avif")) {
        console.log("Connection: moderate (no modern format support)");
        return "moderate";
      }

      // Fallback: assume mobile devices on potentially slower connections
      const isMobileDevice =
        /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        );
      if (isMobileDevice) {
        console.log("Connection: moderate (mobile device fallback)");
        return "moderate";
      }

      // Default to fast for desktop/unknown
      console.log("Connection: fast (default)");
      return "fast";
    }

    console.log("Device info:", { isMobile, isTablet, isDesktop, connection });

    // Get optimization parameters with auto-optimization logic
    let qualityNum = parseInt(quality);
    let formatChoice = format;
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

      // Adjust for connection speed
      if (connection === "slow") {
        qualityNum = Math.min(50, qualityNum);
        formatChoice = "jpeg";
        // Further reduce dimensions for slow connections
        if (widthNum) widthNum = Math.min(widthNum, 600);
        if (heightNum) heightNum = Math.min(heightNum, 600);
      } else if (connection === "moderate") {
        qualityNum = Math.min(70, qualityNum);
        // Keep webp for moderate connections as it's still efficient
        if (formatChoice === "original") formatChoice = "webp";
        // Slightly reduce dimensions for moderate connections
        if (widthNum) widthNum = Math.min(widthNum, 1000);
        if (heightNum) heightNum = Math.min(heightNum, 1000);
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
      res.set("X-Connection-Type", connection);
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
    let outputBuffer;
    let contentType;

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
    res.set("X-Connection-Type", connection);
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

module.exports = router;
