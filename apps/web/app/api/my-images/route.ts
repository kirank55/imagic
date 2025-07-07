import { NextRequest, NextResponse } from "next/server";
import connectDB from "database/db";
import Image from "database/models/image";

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

    const imagesPlain = images.map((img) => {
      // Construct the public URL
      const publicUrl = img.url.startsWith("https://")
        ? img.url
        : `${process.env.PUBLIC_DEVELOPMENT_URL}/${img.url}`;

      return {
        ...img,
        // _id: img._id ? img._id.toString() : "",
        // uploadedAt: img.uploadedAt
        //   ? new Date(img.uploadedAt).toISOString()
        //   : "",
        url: publicUrl,
      };
    });

    // return NextResponse.json({ success: true, images });
    return NextResponse.json({ success: true, images: imagesPlain });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
