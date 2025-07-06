import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import connectDB from "database/db";
import Image from "database/models/image";
import crypto from "crypto";

// Helper function to generate a unique key for R2
function generateUniqueKey(originalFilename: string): string {
  const uuid = crypto.randomUUID();
  const extension = originalFilename.split(".").pop() || "";
  return `${uuid}${extension ? `.${extension}` : ""}`;
}

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET = process.env.R2_BUCKET!;
const R2_ENDPOINT = process.env.R2_ENDPOINT!;

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string | null;

  if (!file || !userId) {
    return NextResponse.json(
      { success: false, message: "No file or userId provided" },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Generate a unique key for the image
  const key = `${userId}/${generateUniqueKey(file.name)}`;
  console.log("Generated upload key:", key);

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        Metadata: {
          originalFilename: file.name,
          userId: userId,
        },
      })
    );

    // You can construct the public URL if your bucket is public
    const publicUrl = `${R2_ENDPOINT}/${key}`;

    // Store image metadata in MongoDB using Mongoose
    try {
      await connectDB();
      await Image.create({
        userId,
        url: key, // Store the key directly instead of the public URL
        name: file.name,
        uploadedAt: new Date(),
        originalUrl: publicUrl, // Optionally store the original URL as reference
      });
    } catch (mongoError) {
      console.error("MongoDB insert error:", mongoError);
      // Even if MongoDB insert fails, we should still have the upload key
      return NextResponse.json({
        success: true,
        key: key,
        message: "Upload successful but metadata storage failed",
      });
    }

    return NextResponse.json({
      success: true,
      key: key,
      url: publicUrl, // Include both key and URL in response
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}
