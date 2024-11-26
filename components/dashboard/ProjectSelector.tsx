//file components/dashboard/ProjectSelector.tsx

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useProjectState } from '@/hooks/useProjectState';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { Project } from '@/server/projectAction';

interface ProjectSelectorProps {
  projects: Project[];
  currentProjectId: number;
}

export default function ProjectSelector({
  projects,
  currentProjectId
}: ProjectSelectorProps) {
  const router = useCustomRouter();
  const pathname = usePathname();
  const { setCurrentProjectId } = useProjectState();

  const handleProjectChange = (newProjectId: string) => {
    const numericProjectId = parseInt(newProjectId, 10);
    setCurrentProjectId(numericProjectId);

    const pathSegments = pathname.split('/');
    const projectIdIndex = pathSegments.findIndex(
      (segment) => segment === currentProjectId.toString()
    );

    if (projectIdIndex !== -1) {
      pathSegments[projectIdIndex] = newProjectId;
    } else {
      const section = pathSegments[2];
      pathSegments.splice(2, pathSegments.length - 2, section, newProjectId);
    }

    const newPath = pathSegments.join('/');
    router.push(newPath);
  };

  return (
    <Select
      value={currentProjectId.toString()}
      onValueChange={handleProjectChange}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a project" />
      </SelectTrigger>
      <SelectContent>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id.toString()}>
            {project.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
