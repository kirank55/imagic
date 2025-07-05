import { NextRequest, NextResponse } from "next/server";
import { destroyUserSession } from "auth/session";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    await destroyUserSession(await cookies());
    // return NextResponse.json({ success: true });
    return NextResponse.redirect("/", { status: 302 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Logout failed." },
      { status: 500 }
    );
  }
}
