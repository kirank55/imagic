import { NextResponse } from "next/server";
import { getCurrentUser } from "auth/currentUser";
import connectDB from "database/db";
import User from "database/models/user";
import { randomBytes } from "crypto";

export async function POST() {
  try {
    // Get current user
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Generate new API keys
    const publicKey = `pk_${randomBytes(16).toString("hex")}`;
    const privateKey = `sk_${randomBytes(32).toString("hex")}`;

    // Update user with new API keys
    const updatedUser = await User.findByIdAndUpdate(
      currentUser.userId,
      {
        publicApiKey: publicKey,
        privateApiKey: privateKey,
        apiKeyCreatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      publicKey: updatedUser.publicApiKey,
      privateKey: updatedUser.privateApiKey,
      createdAt: updatedUser.apiKeyCreatedAt,
    });
  } catch (error) {
    console.error("Error generating API keys:", error);
    return NextResponse.json(
      { error: "Failed to generate API keys" },
      { status: 500 }
    );
  }
}
