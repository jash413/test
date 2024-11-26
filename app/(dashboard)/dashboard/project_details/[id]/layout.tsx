// file: app/(dashboard)/dashboard/project_details/[id]/layout.tsx

import React from 'react';
import { Metadata } from 'next';
import SharedProjectLayoutServer from '@/components/dashboard/SharedProjectLayoutServer';

export const generateMetadata = async ({
  params
}: {
  params: { id: string };
}): Promise<Metadata> => {
  return {
    title: `Project ${params.id}`
  };
};

export default async function ProjectLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <SharedProjectLayoutServer
      params={params}
      title="Project Details"
      menuItem="project_details"
      basePath="/dashboard/project_details"
    >
      <div className="h-full overflow-hidden">{children}</div>
    </SharedProjectLayoutServer>
  );
}
