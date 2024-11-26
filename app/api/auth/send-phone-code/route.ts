// app/api/auth/send-phone-code/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createPhoneVerificationToken } from '@/server/auth/user';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let { phone } = await req.json();

    phone = phone ? phone : session.user.phone;

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    await createPhoneVerificationToken(phone, session.user.apiUserToken);

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
