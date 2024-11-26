// app/(dashboard)/dashboard/project_details/[id]/finances/layout.tsx

import React from 'react';
import { Metadata } from 'next';
import SharedProjectLayoutServer from '@/components/dashboard/SharedProjectLayoutServer';

// Mock project data - replace this with actual data fetching
// const projects = [
//   { id: '1', name: 'Project Alpha' },
//   { id: '2', name: 'Project Beta' },
//   { id: '3', name: 'Project Gamma' },
//   { id: '4', name: 'Project Delta' },
// ];

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Finance'
  };
};

export default async function FinanceLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <SharedProjectLayoutServer
      params={params}
      title="Finances"
      menuItem="finances"
      basePath="/dashboard/finances"
    >
      {children}
    </SharedProjectLayoutServer>
  );
}
