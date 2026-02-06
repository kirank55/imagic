import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const image = await prisma.image.findFirst({
        where: {
            id,
            userId: session.user.id,
        },
    });

    if (!image) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json(image);
}
