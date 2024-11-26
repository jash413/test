// file: components/dashboard/SharedProjectLayoutServer.tsx

import React from 'react';
import { getProjects } from '@/server/projectAction';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import GeneralizedLayoutClient from './SharedProjectLayoutClient';
import { getTabs } from '@/server/utils/sidemenu_items_tabs';

interface SharedProjectLayoutServerProps {
  children: React.ReactNode;
  params: { id: string };
  title: string;
  menuItem: string;
  basePath: string;
  isDynamicTab?: boolean;
}

export default async function SharedProjectLayoutServer({
  children,
  params,
  title,
  menuItem,
  basePath,
  isDynamicTab = false
}: SharedProjectLayoutServerProps) {
  const session = await auth();
  const projects = await getProjects(session?.user?.apiUserToken as string);

  const currentProject = projects.find((p) => p.id === Number(params.id));

  if (!currentProject) {
    console.log(
      'No project found with ID, redirecting to first project:',
      params.id,
      projects[0].id
    );
    redirect(`${basePath}/${projects[0].id}`);
  }

  const tabs = await getTabs(menuItem);

  return (
    <GeneralizedLayoutClient
      title={title}
      currentProjectId={currentProject.id}
      projects={projects}
      tabs={tabs}
      basePath={basePath}
      isDynamicTab={isDynamicTab}
    >
      {children}
    </GeneralizedLayoutClient>
  );
}
