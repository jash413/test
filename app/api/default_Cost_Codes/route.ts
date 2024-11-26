import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { addDefaultCostCodes, getDefaultCostCodes } from '@/server/auth/files';

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

    // Extract folder_code from the query params
    const filterBusinessId = request.nextUrl.searchParams.get(
      'filter[business_id]'
    );

    // console.log('filterFolderCodes:', filterFolderCodes);

    // if (!filterFolderCodes) {
    //   return new NextResponse(JSON.stringify({ error: 'Missing folder_code' }), {
    //     status: 400,
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // }

    console.log('default_Cost_Codes GET');

    const backendResponse = await getDefaultCostCodes(
      { 'filter[business_id]': filterBusinessId },
      token
    );

    console.log('backendResponse', backendResponse);

    return new NextResponse(JSON.stringify(backendResponse), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

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

    console.log('default_Cost_Codes POST');

    const data = await request.json();

    console.log('data', data);

    const backendResponse = await addDefaultCostCodes(token, data);

    console.log('backendResponse', backendResponse);

    return new NextResponse(JSON.stringify(backendResponse), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in download API route:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update file' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
