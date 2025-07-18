import { NextRequest, NextResponse } from "next/server";
import connectDB from "database/db";
import Image from "database/models/image";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    let image;

    // Try to find by MongoDB ObjectId first
    try {
      image = await Image.findById(id).lean();
    } catch {
      // If ObjectId fails, try to find by other possible fields (UUID, custom id, etc.)
      // Don't include _id in the fallback query since it requires ObjectId format
      image = await Image.findOne({
        $or: [
          { id: id },
          { uuid: id },
          { customId: id },
          { url: { $regex: id, $options: "i" } }, // Check if ID is part of the URL
          // Add more fields as needed based on your schema
        ],
      }).lean();
    }

    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      image,
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
