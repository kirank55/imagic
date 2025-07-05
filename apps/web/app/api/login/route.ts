import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "database/db";
import User from "database/models/user";

import { cookies } from "next/headers";
import { createUserSession } from "auth/session";

import { UserDetailsForCookieType } from "types/userTypes";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 401 }
      );
    }

    const UserDetialsForCookie = {
      username: user.username,
      userId: (user._id as string).toString(),
    } as UserDetailsForCookieType;

    await createUserSession(UserDetialsForCookie, await cookies());

    return NextResponse.json({ success: true, message: "Login successful." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
