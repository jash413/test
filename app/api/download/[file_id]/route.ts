// file: app/api/download/[file_id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { fetchImage } from '@/server/utils/filehandler';
import { auth } from '@/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { file_id: string } }
) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { file_id } = params;

  if (typeof file_id !== 'string') {
    return new NextResponse(JSON.stringify({ error: 'Invalid file_id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const token = session.user.apiUserToken;
    const fileData = await fetchImage(file_id, token);

    // Create headers for file download
    const headers = new Headers();
    // console.log("File data:", fileData)
    headers.set('Content-Disposition', fileData.contentDisposition);
    headers.set('Content-Type', fileData.contentType);

    // Send the file data
    return new NextResponse(Buffer.from(fileData.data, 'base64'), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error in download API route:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to download file' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
