// File: app/(dashboard)/dashboard/project_details/[id]/inspiration/create/page.tsx

import {
  INSPIRATION_INITIAL_CATEGORIES,
  INSPIRATION_INITIAL_TAGS
} from '@/constants/values';
import InspirationForm from '../InspirationForm';

export default function CreateInspirationPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-grow overflow-auto">
        <InspirationForm
          projectId={params.id}
          categories={INSPIRATION_INITIAL_CATEGORIES}
          tags={INSPIRATION_INITIAL_TAGS}
        />
      </div>
    </div>
  );
}
