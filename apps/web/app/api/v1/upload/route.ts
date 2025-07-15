import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import connectDB from "database/db";
import Image from "database/models/image";
import User from "database/models/user";

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

// Accepted image types
const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/bmp",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

function isAcceptedType(mimeType: string): boolean {
  return ACCEPTED_TYPES.includes(mimeType);
}

// Helper function to detect image type from file extension
function detectImageType(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "bmp":
      return "image/bmp";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    default:
      return "image/jpeg"; // Default fallback
  }
}

async function validateApiKey(apiKey: string): Promise<string | null> {
  try {
    await connectDB();

    // Check if it's a public or private API key
    const user = await User.findOne({
      $or: [{ publicApiKey: apiKey }, { privateApiKey: apiKey }],
    });

    if (!user) {
      return null;
    }

    type UserDoc = { _id: { toString: () => string } };
    return (user as UserDoc)._id.toString();
  } catch (error) {
    console.error("Error validating API key:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request
    const formData = await req.formData();

    const file = formData.get("image") as File;
    const apiKey = formData.get("api_key") as string;

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No image file provided",
          message: "Please provide an image file in the 'image' field",
        },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "No API key provided",
          message: "Please provide an API key in the 'api_key' field",
        },
        { status: 401 }
      );
    }

    // Validate API key and get user ID
    const userId = await validateApiKey(apiKey);
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid API key",
          message: "The provided API key is not valid",
        },
        { status: 401 }
      );
    }

    // Validate file type
    const detectedType = file.type || detectImageType(file.name);
    if (!isAcceptedType(detectedType)) {
      return NextResponse.json(
        {
          success: false,
          error: "Unsupported file type",
          message: `File type ${detectedType} is not supported. Accepted types: ${ACCEPTED_TYPES.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: "File too large",
          message: `File size must be less than ${maxSize / (1024 * 1024)}MB`,
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate a unique key for the image
    const key = `${userId}/${generateUniqueKey(file.name)}`;

    // Upload to R2
    await s3.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: detectedType,
        Metadata: {
          originalFilename: file.name,
          userId: userId,
          uploadedViaApi: "true",
        },
      })
    );

    // Construct the public URL
    const publicUrl = `${R2_ENDPOINT}/${key}`;

    // Store image metadata in MongoDB
    try {
      await connectDB();
      const imageDoc = await Image.create({
        userId,
        url: key, // Store the key directly
        name: file.name,
        size: file.size,
        detectedType: detectedType,
        uploadedAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        data: {
          id: imageDoc._id,
          key: key,
          url: publicUrl,
          name: file.name,
          size: file.size,
          type: detectedType,
          uploadedAt: imageDoc.uploadedAt,
        },
        message: "Image uploaded successfully",
      });
    } catch (mongoError) {
      console.error("MongoDB insert error:", mongoError);

      // Even if MongoDB insert fails, the upload was successful
      return NextResponse.json({
        success: true,
        data: {
          key: key,
          url: publicUrl,
          name: file.name,
          size: file.size,
          type: detectedType,
          uploadedAt: new Date(),
        },
        message: "Image uploaded successfully but metadata storage failed",
        warning: "Metadata not saved to database",
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Upload failed",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

// Also support GET request to provide API documentation
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/v1/upload",
    method: "POST",
    description: "Upload images to R2 storage using API key authentication",
    parameters: {
      image: {
        type: "File",
        required: true,
        description: "Image file to upload",
        acceptedTypes: ACCEPTED_TYPES,
        maxSize: "10MB",
      },
      api_key: {
        type: "String",
        required: true,
        description: "Your public or private API key",
      },
    },
    example: {
      curl: `curl -X POST ${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/v1/upload \\
  -H "Content-Type: multipart/form-data" \\
  -F "image=@/path/to/your/image.jpg" \\
  -F "api_key=your_api_key_here"`,
    },
    response: {
      success: {
        success: true,
        data: {
          id: "mongodb_document_id",
          key: "unique_storage_key",
          url: "public_url_to_image",
          name: "original_filename.jpg",
          size: 12345,
          type: "image/jpeg",
          uploadedAt: "2025-07-15T10:30:00.000Z",
        },
        message: "Image uploaded successfully",
      },
      error: {
        success: false,
        error: "error_type",
        message: "Human readable error message",
      },
    },
  });
}
