// File: app/(dashboard)/dashboard/project_details/[id]/inspiration/[inspirationId]/edit/page.tsx

import { InspirationShape } from '@/server/types/project';
import InspirationForm from '../../InspirationForm';
import {
  INSPIRATION_INITIAL_CATEGORIES,
  INSPIRATION_INITIAL_TAGS
} from '@/constants/values';
import { auth } from '@/auth';
import { modelConfigs } from '@/server/model-config';
import { processDocumentsAndImages } from '@/server/utils/filehandler';

export default async function EditInspirationPage({
  params
}: {
  params: { id: string; inspirationId: string };
}) {
  const session = await auth();
  let inspiration: InspirationShape = {} as InspirationShape;
  let categories = INSPIRATION_INITIAL_CATEGORIES;
  let tags = INSPIRATION_INITIAL_TAGS;

  if (session?.user?.apiUserToken) {
    try {
      const response = await modelConfigs.inspiration.getFunction(
        params.inspirationId,
        session.user.apiUserToken
      );
      inspiration = response as InspirationShape;

      if (!categories.includes(inspiration.category)) {
        categories.push(inspiration.category);
      }

      for (const tag of inspiration.tags || []) {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      }

      if (inspiration) {
        // Process all document fields in the business object
        inspiration = await processDocumentsAndImages(
          inspiration,
          session.user.apiUserToken
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <InspirationForm
      projectId={params.id}
      inspirationId={params.inspirationId}
      inspirationData={inspiration}
      categories={categories}
      tags={tags}
    />
  );
}
