// app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';
import { verifyResetToken } from '@/server/auth/user';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();
    await verifyResetToken(token, password);

    return NextResponse.json({
      message: 'Verification code sent',
      status: 200,
      ok: true
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
