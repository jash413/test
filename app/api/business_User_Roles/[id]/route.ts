import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserFiles } from '@/server/auth/files';
import { getBusinessUserRoles, updateBusinessRoles } from '@/server/auth/user';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  console.log('session', session);

  if (!session || !session.user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const token = session.user.apiUserToken;

    console.log('token', token);

    const data = await request.json();

    console.log('data', data);

    const backendResponse = await updateBusinessRoles(
      parseInt(params.id),
      token,
      data
    );

    console.log('backendResponse', backendResponse);

    return new NextResponse(JSON.stringify(backendResponse), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in download API route:', error);
    return new NextResponse(JSON.stringify({ error: 'Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
