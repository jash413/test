// app/api/auth/send-email-code/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createEmailVerificationToken } from '@/server/auth/user';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await createEmailVerificationToken(
      session.user.email,
      session.user.apiUserToken
    );

    return NextResponse.json({
      message: 'Verification code sent',
      status: 200,
      ok: true
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
