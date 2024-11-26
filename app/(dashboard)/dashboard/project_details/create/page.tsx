// File: app/(dashboard)/dashboard/project/create/page.tsx

import ProjectForm from '../ProjectForm';

export default function CreateProjectPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-grow overflow-auto">
        <ProjectForm />
      </div>
    </div>
  );
}
