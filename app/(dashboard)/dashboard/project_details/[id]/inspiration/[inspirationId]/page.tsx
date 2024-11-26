// File: app/(dashboard)/dashboard/project_details/[id]/inspiration/[inspirationId]/page.tsx

import { auth } from '@/auth';
import { modelConfigs } from '@/server/model-config';
import { InspirationShape } from '@/server/types/project';
import { processDocumentsAndImages } from '@/server/utils/filehandler';
import InspirationDetailClient from './InspirationDetailClient';

export default async function InspirationDetailPage({
  params
}: {
  params: { id: string; inspirationId: string };
}) {
  const session = await auth();
  let inspiration: InspirationShape | null = null;
  let currentUser: { id: number; name: string } = { id: 0, name: '' };

  if (session?.user?.apiUserToken) {
    try {
      inspiration = (await modelConfigs.inspiration.getFunction(
        params.inspirationId,
        session.user.apiUserToken
      )) as InspirationShape;

      if (inspiration) {
        // Process all document fields in the business object
        inspiration = await processDocumentsAndImages(
          inspiration,
          session.user.apiUserToken
        );
      }

      currentUser = {
        id: session.user.id,
        name: session.user.name as string
      };
    } catch (error) {
      console.error('Error fetching inspiration:', error);
    }
  }

  if (!inspiration) {
    return <div>Inspiration not found or invalid</div>;
  }

  //update inspiration count
  await modelConfigs.inspiration.updateFunction(
    inspiration.id as number,
    { view_count: inspiration.view_count + 1 },
    session?.user?.apiUserToken as string
  );

  return (
    <InspirationDetailClient
      inspiration={inspiration as InspirationShape & { id: string }}
      currentUser={currentUser}
      projectId={params.id}
    />
  );
}
