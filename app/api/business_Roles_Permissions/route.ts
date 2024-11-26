import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { addBusinessRolePermission, getUserFiles } from '@/server/auth/files';
import { getBusinessUserRoles, updateBusinessRoles } from '@/server/auth/user';

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const token = session.user.apiUserToken;

    console.log('businessRolePermission POST');

    const data = await request.json();

    console.log('data', data, token);

    const backendResponse = await addBusinessRolePermission(token, data);

    console.log('backendResponse', backendResponse);

    return new NextResponse(JSON.stringify(backendResponse), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in download API route:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create business role' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
