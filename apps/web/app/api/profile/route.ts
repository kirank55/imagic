import { NextResponse } from "next/server";
import { getCurrentUser } from "auth/currentUser";

export async function GET() {
  try {
    const fullUser = await getCurrentUser({
      withFullUser: true,
      redirectIfNotFound: false,
    });

    if (fullUser && fullUser.data && fullUser.data.username) {
      return NextResponse.json({
        username: fullUser.data.username,
        userId: fullUser.data.id,
      });
    }

    return NextResponse.json({ username: null, userId: null }, { status: 401 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ username: null, userId: null }, { status: 500 });
  }
}
