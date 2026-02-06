import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Implement actual stats once Image model is added
    // const imageCount = await prisma.image.count({
    //     where: { userId: session.user.id },
    // });
    // const result = await prisma.image.aggregate({
    //     where: { userId: session.user.id },
    //     _sum: { size: true },
    // });
    // const totalSize = result._sum.size || 0;

    const stats = {
        imageCount: 0,
    };

    return NextResponse.json(stats);
}
