import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserFiles } from '@/server/auth/files';

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
    const filterFolderCodes = request.nextUrl.searchParams.get(
      'filter[folder_code_id]'
    );

    const projectId = request.nextUrl.searchParams.get('project_id');

    // if (!filterFolderCodes) {
    //   return new NextResponse(JSON.stringify({ error: 'Missing folder_code' }), {
    //     status: 400,
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // }

    let params: any = {
      'filter[folder_code_id]': filterFolderCodes
    };

    if (projectId) {
      params = {
        ...params,
        'filter[project_id]': projectId
      };
    }

    const backendResponse = await getUserFiles(
      // { 'filter[folder_code_id]': filterFolderCodes },
      params,
      token
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
