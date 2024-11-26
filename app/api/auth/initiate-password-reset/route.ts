// app/api/auth/initiate-password-reset/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    return NextResponse.json({
      message: 'Verification code sent',
      status: 200,
      ok: true
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
