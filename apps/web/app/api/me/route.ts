import { NextResponse } from "next/server";
import { getCurrentUser } from "auth/currentUser";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ userId: null }, { status: 401 });
  }
  return NextResponse.json({ userId: user.id });
}
