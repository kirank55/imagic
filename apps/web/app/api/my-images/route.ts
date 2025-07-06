import { NextRequest, NextResponse } from "next/server";
import connectDB from "database/db";
import Image from "database/models/image";
import { generateSignedUrl } from "lib/r2";
import crypto from "crypto";

// Helper function to generate a unique key for R2
function generateUniqueKey(originalFilename: string): string {
  const uuid = crypto.randomUUID();
  const extension = originalFilename.split(".").pop() || "";
  return `${uuid}${extension ? `.${extension}` : ""}`;
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    console.log("no userId provided");
    return NextResponse.json(
      { success: false, message: "No userId provided" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const images = await Image.find({ userId }).sort({ uploadedAt: -1 }).lean();
    if (!images || images.length === 0) {
      console.log("no images found for user", userId);
      return NextResponse.json(
        { success: false, message: "No images found for this user" },
        { status: 404 }
      );
    }

    const imagesPlain = await Promise.all(
      images.map(async (img) => {
        console.log("Original URL from database:", img.url); // Debugging log

        // Wait until the key is available
        if (!img.url) {
          console.error("Key is not available for image:", img);
          return {
            ...img,
            _id: img._id ? img._id.toString() : "",
            uploadedAt: img.uploadedAt
              ? new Date(img.uploadedAt).toISOString()
              : "",
            url: "", // Fallback to an empty string if key is missing
          };
        }

        // Generate a new unique key for the image
        let key;
        try {
          // Extract the original filename to preserve extension
          let originalFilename = "";
          if (img.url.startsWith("https://")) {
            const url = new URL(img.url);
            originalFilename = decodeURIComponent(
              url.pathname.split("/").pop() || ""
            );
          } else {
            originalFilename = img.url;
          }

          // Generate a new unique key with the original extension
          key = generateUniqueKey(originalFilename);

          console.log({
            originalUrl: img.url,
            originalFilename,
            newKey: key,
          });
        } catch (error) {
          console.error("Error generating unique key:", error);
          // Generate a fallback key without trying to preserve extension
          key = generateUniqueKey("");

          // Wait until the key is available or handle missing key
          if (!key) {
            console.error("Key is missing or invalid for image:", img);
            return {
              ...img,
              _id: img._id ? img._id.toString() : "",
              uploadedAt: img.uploadedAt
                ? new Date(img.uploadedAt).toISOString()
                : "",
              url: img.url, // Fallback to original URL
            };
          }

          try {
            // First, update the image record with the new key
            await Image.findByIdAndUpdate(img._id, { url: key });

            const signedUrl = await generateSignedUrl(key);
            if (!signedUrl) {
              throw new Error("Failed to generate signed URL");
            }

            return {
              ...img,
              _id: img._id ? img._id.toString() : "",
              uploadedAt: img.uploadedAt
                ? new Date(img.uploadedAt).toISOString()
                : "",
              url: signedUrl,
              key: key, // Include the key in the response
            };
          } catch (error) {
            console.error("Error generating signed URL or updating image:", {
              error,
              key,
              originalUrl: img.url,
            });
            // If we get a NoSuchKey error, the image might be missing from R2
            // Return a special status that the client can handle
            return {
              ...img,
              _id: img._id ? img._id.toString() : "",
              uploadedAt: img.uploadedAt
                ? new Date(img.uploadedAt).toISOString()
                : "",
              url: "",
              status: "missing",
              key: key, // Include the key even in error case
            };
          }
        }
      })
    );

    console.log({ images: imagesPlain });

    return NextResponse.json({ success: true, images: imagesPlain });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
