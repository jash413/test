import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import {
  addDefaultCostCodes,
  getDefaultCostCodes,
  getLoginEvent
} from '@/server/auth/files';

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

    // filter[endpoint]=/login&filter[user_id]=${id}

    const endpointP = request.nextUrl.searchParams.get('filter[endpoint]');
    const userIdP = request.nextUrl.searchParams.get('filter[user_id]');

    let params: any = {};

    if (endpointP) {
      params = {
        ...params,
        'filter[endpoint]': endpointP
      };
    }

    if (userIdP) {
      params = {
        ...params,
        'filter[user_id]': userIdP
      };
    }

    const backendResponse = await getLoginEvent(
      // { 'filter[business_id]': filterBusinessId },
      params,
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
