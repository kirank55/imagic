import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import connectDB from "../../../database/db";
import User from "../../../database/models/user";

import { createUserSession } from "auth/session";
import { UserDetailsForCookieType } from "types/userTypes";

export async function POST(req: NextRequest) {
  try {
    const { email, username, password } = await req.json();
    // Validate input
    if (!email || !username || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    await connectDB();
    const existingUser = await User.findOne({ email });
    // Check if user already exists
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already in use." },
        { status: 409 }
      );
    }

    // Check if Password is strong enough
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long.",
        },
        { status: 400 }
      );
    }

    // hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    // Create a session for the user
    const UserDetailsForCookie = {
      username: user.username,
      userId: (user._id as string).toString(),
    } as UserDetailsForCookieType;

    await createUserSession(UserDetailsForCookie, await cookies());

    return NextResponse.json({ success: true, message: "Signup successful." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
