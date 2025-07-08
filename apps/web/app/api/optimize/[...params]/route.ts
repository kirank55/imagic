import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  try {
    // Parse the image path from params
    const imagePath = params.params.join("/");
    const { searchParams } = new URL(request.url);

    // Get optimization parameters
    const quality = parseInt(searchParams.get("quality") || "80");
    const format = searchParams.get("format") || "original";
    const width = searchParams.get("width")
      ? parseInt(searchParams.get("width")!)
      : undefined;
    const height = searchParams.get("height")
      ? parseInt(searchParams.get("height")!)
      : undefined;

    // Fetch the original image
    const imageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imagePath}`;
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());

    // Create sharp instance
    let sharpInstance = sharp(imageBuffer);

    // Apply resizing if specified
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Apply format conversion and quality
    let outputBuffer: Buffer;
    let contentType: string;

    switch (format) {
      case "webp":
        outputBuffer = await sharpInstance.webp({ quality }).toBuffer();
        contentType = "image/webp";
        break;
      case "jpeg":
        outputBuffer = await sharpInstance.jpeg({ quality }).toBuffer();
        contentType = "image/jpeg";
        break;
      case "png":
        outputBuffer = await sharpInstance
          .png({
            quality,
            compressionLevel: 9,
          })
          .toBuffer();
        contentType = "image/png";
        break;
      default: {
        // Return original format with quality adjustment if possible
        const originalFormat = response.headers.get("content-type");
        if (originalFormat?.includes("jpeg")) {
          outputBuffer = await sharpInstance.jpeg({ quality }).toBuffer();
          contentType = "image/jpeg";
        } else if (originalFormat?.includes("png")) {
          outputBuffer = await sharpInstance
            .png({
              quality,
              compressionLevel: 9,
            })
            .toBuffer();
          contentType = "image/png";
        } else if (originalFormat?.includes("webp")) {
          outputBuffer = await sharpInstance.webp({ quality }).toBuffer();
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
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    headers.set("Content-Length", outputBuffer.length.toString());

    // Add CORS headers if needed
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET");

    return new NextResponse(outputBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Image optimization error:", error);
    return NextResponse.json(
      { error: "Failed to optimize image" },
      { status: 500 }
    );
  }
}
