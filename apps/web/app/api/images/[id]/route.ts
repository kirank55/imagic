import { NextRequest, NextResponse } from "next/server";
import connectDB from "database/db";
import Image from "database/models/image";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const image = await Image.findById(params.id).lean();
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
    // return NextResponse.json({
    //   success: true,
    //   image: {
    //     id: image._id.toString(),
    //     url: image.url,
    //     // originalName: image.name || "",
    //     // originalName: image.name || image.originalName || "",
    //     // size: image.size || 0,
    //     // contentType: image.contentType || "image/jpeg",
    //     uploadedAt: image.uploadedAt
    //       ? new Date(image.uploadedAt).toISOString()
    //       : "",
    //     // tags: image.tags || image.metadata?.tags || [],
    //   },
    // });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}
