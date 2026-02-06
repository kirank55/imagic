import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import sharp from "sharp";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string; imageId: string }> }
) {
    const { userId, imageId } = await params;
    const { searchParams } = new URL(request.url);

    // Get query params
    const format = searchParams.get("format") || "original";
    const quality = parseInt(searchParams.get("quality") || "80", 10);
    const width = searchParams.get("width") ? parseInt(searchParams.get("width")!, 10) : undefined;
    const height = searchParams.get("height") ? parseInt(searchParams.get("height")!, 10) : undefined;

    // Find the image in DB
    const image = await prisma.image.findFirst({
        where: {
            id: imageId,
            userId: userId,
        },
    });

    if (!image) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    try {
        // Fetch original image from R2
        const response = await fetch(image.url);
        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
        }

        const originalBuffer = Buffer.from(await response.arrayBuffer());

        // If format is original and no resize, return as-is
        if (format === "original" && !width && !height) {
            return new NextResponse(new Uint8Array(originalBuffer), {
                headers: {
                    "Content-Type": image.detectedType,
                    "Content-Length": originalBuffer.length.toString(),
                    "Cache-Control": "public, max-age=31536000",
                },
            });
        }

        // Process with Sharp
        let sharpInstance = sharp(originalBuffer);

        // Resize if dimensions provided
        if (width || height) {
            sharpInstance = sharpInstance.resize(width, height, {
                fit: "inside",
                withoutEnlargement: true,
            });
        }

        // Convert format
        let outputBuffer: Buffer;
        let contentType: string;

        switch (format) {
            case "webp":
                outputBuffer = await sharpInstance.webp({ quality }).toBuffer();
                contentType = "image/webp";
                break;
            case "jpeg":
            case "jpg":
                outputBuffer = await sharpInstance.jpeg({ quality }).toBuffer();
                contentType = "image/jpeg";
                break;
            case "png":
                outputBuffer = await sharpInstance.png({ quality }).toBuffer();
                contentType = "image/png";
                break;
            default:
                // Keep original format but apply quality
                const originalFormat = image.detectedType.split("/")[1];
                if (originalFormat === "jpeg" || originalFormat === "jpg") {
                    outputBuffer = await sharpInstance.jpeg({ quality }).toBuffer();
                    contentType = "image/jpeg";
                } else if (originalFormat === "png") {
                    outputBuffer = await sharpInstance.png({ quality }).toBuffer();
                    contentType = "image/png";
                } else if (originalFormat === "webp") {
                    outputBuffer = await sharpInstance.webp({ quality }).toBuffer();
                    contentType = "image/webp";
                } else {
                    outputBuffer = await sharpInstance.toBuffer();
                    contentType = image.detectedType;
                }
        }

        return new NextResponse(new Uint8Array(outputBuffer), {
            headers: {
                "Content-Type": contentType,
                "Content-Length": outputBuffer.length.toString(),
                "Cache-Control": "public, max-age=31536000",
                "X-Original-Size": originalBuffer.length.toString(),
                "X-Optimized-Size": outputBuffer.length.toString(),
            },
        });
    } catch (error) {
        console.error("Image processing error:", error);
        return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
    }
}
