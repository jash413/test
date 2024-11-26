// file: hooks/useProjectState.ts

import { useState, useEffect, useCallback } from 'react';
import { getProjects, Project } from '@/server/projectAction';

import { useSession } from 'next-auth/react';

let sharedCurrentProjectId: number = 0;
let sharedProjects: Project[] = [];
const listeners: Set<() => void> = new Set();

async function fetchProjects(token: string): Promise<Project[]> {
  const apiProjects = await getProjects(token);
  return apiProjects;
}

export function useProjectState() {
  const [, forceUpdate] = useState({});
  const { data: session } = useSession();

  const setCurrentProjectId = useCallback((id: number) => {
    sharedCurrentProjectId = id;
    listeners.forEach((listener) => listener());
  }, []);

  const setProjects = useCallback((newProjects: Project[]) => {
    sharedProjects = newProjects;
    listeners.forEach((listener) => listener());
  }, []);

  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.add(listener);

    if (sharedProjects.length === 0) {
      fetchProjects(session?.user?.apiUserToken as string).then(
        (fetchedProjects) => {
          setProjects(fetchedProjects);
          if (fetchedProjects?.length > 0 && !sharedCurrentProjectId) {
            setCurrentProjectId(fetchedProjects[0]?.id);
          }
        }
      );
    }

    return () => {
      listeners.delete(listener);
    };
  }, [setCurrentProjectId, setProjects]);

  return {
    currentProjectId: sharedCurrentProjectId,
    setCurrentProjectId,
    projects: sharedProjects
  };
}
