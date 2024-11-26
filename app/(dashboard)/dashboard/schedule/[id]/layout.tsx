// file: app/(dashboard)/dashboard/schedule/[id]/layout.tsx

import React from 'react';
import { Metadata } from 'next';
import SharedProjectLayoutServer from '@/components/dashboard/SharedProjectLayoutServer';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Schedule'
  };
};

export default async function BidsLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <SharedProjectLayoutServer
      params={params}
      title="Project Schedule"
      menuItem="schedule"
      basePath="/dashboard/schedule"
      isDynamicTab={true}
    >
      {children}
    </SharedProjectLayoutServer>
  );
}
