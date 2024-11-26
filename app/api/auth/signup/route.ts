// file app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, registerUser } from '@/server/auth/user';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json();

    // Check if user already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const user = await registerUser({ name, email, phone, password });
    // Create new user
    return NextResponse.json({
      message: 'User created successfully',
      userId: user.id,
      status: 201,
      ok: true
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
