import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserFiles } from '@/server/auth/files';
import { getBusinessUserRoles, updateBusinessRoles } from '@/server/auth/user';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const token = session.user.apiUserToken;

    console.log('token', token);

    // Extract folder_code from the query params
    const filterBusinessCodes = request.nextUrl.searchParams.get(
      'filter[business_id]'
    );

    console.log('filterBusinessCodes', filterBusinessCodes);

    // if (!filterFolderCodes) {
    //   return new NextResponse(JSON.stringify({ error: 'Missing folder_code' }), {
    //     status: 400,
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // }

    const backendResponse = await getBusinessUserRoles(
      token,
      //   { 'filter[business_id]': filterBusinessCodes }
      null
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
