import { NextRequest, NextResponse } from 'next/server';
import connectDB from 'database/db';
import User from 'database/models/user';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { createUserSession } from 'auth/session';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid credentials.' }, { status: 401 });
    }

    // Optionally, set a cookie or session here

    const UserDetialsForCookie = { username: user.username, id: (user._id as string).toString() }

    await createUserSession(UserDetialsForCookie, await cookies())


    return NextResponse.json({ success: true, message: 'Login successful.' });

    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
