import { NextRequest, NextResponse } from "next/server";
import { Jimp } from "jimp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("image");

    const compressionQuality = formData.get("quality");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const image = await Jimp.read(buffer);

    const quality =
      compressionQuality !== null ? Number(compressionQuality) || 80 : 80;

    const compressedBuffer = await image.getBuffer("image/jpeg", {
      quality,
    });

    return new NextResponse(compressedBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": 'inline; filename="compressed.jpg"',
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to compress image", details: String(e) },
      { status: 500 }
    );
  }
}
