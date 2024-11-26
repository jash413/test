import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { downloadFolder } from '@/server/auth/files';

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

  const { id } = params;

  if (!id || typeof id !== 'string') {
    return new NextResponse(JSON.stringify({ error: 'Invalid folder_id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const token = session.user.apiUserToken;

    // Fetch binary data (ZIP file)
    const backendResponse = await downloadFolder(id, token);

    if (!backendResponse || backendResponse.status !== 200) {
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch ZIP file' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the binary data (arrayBuffer) from the response
    const zipData = backendResponse.data;

    // Set the appropriate headers for ZIP file download
    return new NextResponse(Buffer.from(zipData), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=folder.zip`
      }
    });
  } catch (error) {
    console.error('Error in download API route:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to download folder' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
