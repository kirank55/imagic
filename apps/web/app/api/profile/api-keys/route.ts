import { NextResponse } from "next/server";
import { getCurrentUser } from "auth/currentUser";
import connectDB from "database/db";
import User from "database/models/user";

export async function GET() {
  try {
    // Get current user
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get user with API keys
    const user = await User.findById(currentUser.userId).select(
      "publicApiKey privateApiKey apiKeyCreatedAt"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      publicKey: user.publicApiKey || null,
      privateKey: user.privateApiKey || null,
      createdAt: user.apiKeyCreatedAt || null,
      hasKeys: !!(user.publicApiKey && user.privateApiKey),
    });
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return NextResponse.json(
      { error: "Failed to fetch API keys" },
      { status: 500 }
    );
  }
}
