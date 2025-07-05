import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../database/db';
import User from '../../../database/models/user';
import bcrypt from 'bcryptjs';
import { createUserSession } from 'auth/session';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { email, username, password } = await req.json();
    if (!email || !username || !password) {
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }
    await connectDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Email already in use.' }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, username, password: hashedPassword });


    const UserDetialsForCookie = { username: user.username, id: (user._id as string).toString() }

    await createUserSession(UserDetialsForCookie, await cookies())


    return NextResponse.json({ success: true, message: 'Signup successful.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
