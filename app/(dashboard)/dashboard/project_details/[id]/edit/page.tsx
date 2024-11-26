// File: app/(dashboard)/dashboard/project_details/[id]/edit/page.tsx

import { auth } from '@/auth';
import { modelConfigs } from '@/server/model-config';
import { processDocumentsAndImages } from '@/server/utils/filehandler';
import ProjectForm from '../../ProjectForm';
import { ProjectShape } from '@/server/types/project'; // Import the ProjectShape type

export default async function EditProjectPage({
  params
}: {
  params: { id: string };
}) {
  const session = await auth();
  let project: ProjectShape | null = null;

  if (session?.user?.apiUserToken) {
    try {
      const response = (await modelConfigs.project.getFunction(
        params.id,
        session.user.apiUserToken
      )) as ProjectShape;
      project = response as ProjectShape;

      if (project) {
        // Process all document fields in the business object
        project = await processDocumentsAndImages(
          project,
          session.user.apiUserToken
        );
      }

      // console.log('Transformed project:', project);
    } catch (error) {
      console.error(error);
    }
  }

  return <ProjectForm projectId={params.id} projectData={project} />;
}
