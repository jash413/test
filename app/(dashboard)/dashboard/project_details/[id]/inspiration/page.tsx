// File: app/(dashboard)/dashboard/project_details/[id]/inspiration/page.tsx

import { auth } from '@/auth';
import { modelConfigs } from '@/server/model-config';
import { InspirationShape } from '@/server/types/project';
import InspirationClient from './InspirationClient';
import { processDocumentsAndImages } from '@/server/utils/filehandler';
import {
  INSPIRATION_INITIAL_CATEGORIES,
  INSPIRATION_INITIAL_TAGS
} from '@/constants/values';

export default async function InspirationPage({
  params
}: {
  params: { id: string };
}) {
  const session = await auth();
  let inspirations: InspirationShape[] = [];
  let categories = INSPIRATION_INITIAL_CATEGORIES;
  let tags = INSPIRATION_INITIAL_TAGS;
  if (session?.user?.apiUserToken) {
    try {
      const response = await modelConfigs.inspiration.listFunction(
        {
          filter: { project_id: params.id }
        },
        session.user.apiUserToken
      );
      inspirations = response || [];

      // add user added categories and tags
      for (const inspiration of inspirations) {
        if (!categories.includes(inspiration.category)) {
          categories.push(inspiration.category);
        }
      }

      for (const inspiration of inspirations) {
        for (const tag of inspiration.tags || []) {
          if (!tags.includes(tag)) {
            tags.push(tag);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching inspirations:', error);
    }
  }

  let inspirationsWithImages: InspirationShape[] = [];
  for (var inspiration of inspirations) {
    if (
      inspiration.inspiration_images &&
      inspiration.inspiration_images.length > 0
    ) {
      try {
        // Loop through all file_info objects and fetch the image for each file_url
        // Process all document fields in the business object
        inspiration = await processDocumentsAndImages(
          inspiration,
          session?.user?.apiUserToken as string
        );
        inspirationsWithImages.push(inspiration);
        // console.log(' inspiration :', inspiration);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    }
  }

  // console.log(' inspirations :', inspirations);
  return (
    <div className="space-y-6 bg-gray-100 p-2">
      <h1 className="text-3xl font-bold">Your Inspirations</h1>
      <InspirationClient
        inspirations={inspirationsWithImages}
        projectId={params.id}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}
