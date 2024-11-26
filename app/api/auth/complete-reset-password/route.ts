// app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import { completeResetPassword } from '@/server/auth/user';

export async function POST(req: Request) {
  try {
    const { token, verifyToken } = await req.json();

    await completeResetPassword(token, verifyToken);

    return NextResponse.json({
      message: 'Password reset successful',
      status: 200,
      ok: true
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
