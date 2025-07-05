import { NextResponse } from "next/server";
import { destroyUserSession } from "auth/session";
import { cookies } from "next/headers";

export async function POST() {
  try {
    await destroyUserSession(await cookies());
    // return NextResponse.json({ success: true });
    return NextResponse.redirect("/", { status: 302 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Logout failed." },
      { status: 500 }
    );
  }
}
