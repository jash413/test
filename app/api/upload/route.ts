import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { fileUpload } from '@/server/auth/files';

export async function POST(
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
    const formData = await request.formData();

    // Get file
    const file = formData.get('files') as File;

    // If needed, convert file to a binary buffer
    const arrayBuffer = await file.arrayBuffer();

    console.log('File:', file);
    console.log('ArrayBuffer:', arrayBuffer); // Binary data

    // Pass file or arrayBuffer to your upload handler
    const backendResponse = await fileUpload(arrayBuffer, token);

    if (!backendResponse || !backendResponse.shareLink) {
      return new NextResponse(
        JSON.stringify({ error: 'Failed to generate link' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new NextResponse(JSON.stringify(backendResponse), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in upload API route:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to generate link' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
