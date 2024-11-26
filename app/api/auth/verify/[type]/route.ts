// app/api/auth/verify/[type]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { findUserByEmail, verifyEmail, verifyPhone } from '@/server/auth/user';

export async function POST(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token } = await req.json();
    const { type } = params;

    if (!token) {
      return NextResponse.json(
        { error: 'Missing verification code' },
        { status: 400 }
      );
    }

    if (type !== 'email' && type !== 'phone') {
      return NextResponse.json(
        { error: 'Invalid verification type' },
        { status: 400 }
      );
    }

    let verificationResult = null;
    if (type === 'email' && session.user.email) {
      verificationResult = await verifyEmail(
        session.user.email,
        token,
        session.user.apiUserToken
      );
    } else if (type === 'phone' && session.user.phone) {
      verificationResult = await verifyPhone(
        session.user.phone,
        token,
        session.user.apiUserToken
      );
    } else {
      return NextResponse.json(
        { error: `User ${type} not found` },
        { status: 400 }
      );
    }

    if (!verificationResult) {
      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 400 }
      );
    }

    // Update user's validation status
    const updatedUser = await findUserByEmail(session.user.email);
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const verifiedField = type === 'email' ? 'emailVerified' : 'phoneVerified';

    return NextResponse.json({
      message: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } verified successfully`,
      [verifiedField]: updatedUser[verifiedField],
      status: 200,
      ok: true
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: `Failed to verify ${params.type}` },
      { status: 500 }
    );
  }
}
