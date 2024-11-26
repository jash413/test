import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { downloadFolder, generateShareLink } from '@/server/auth/files';

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

  const { id } = params;

  if (!id || typeof id !== 'string') {
    return new NextResponse(JSON.stringify({ error: 'Invalid folder_id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const token = session.user.apiUserToken;

    const backendResponse = await generateShareLink(id, token);

    console.log('backendResponse', backendResponse);

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
    console.error('Error in download API route:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to generate link' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
