// app/api/custom-forgot-password/route.ts
import { NextResponse } from 'next/server';
import { initiatePasswordReset } from '@/server/auth/user';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await initiatePasswordReset(email);
    return NextResponse.json({
      message: 'Password reset link sent to your email',
      status: 200,
      ok: true
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
