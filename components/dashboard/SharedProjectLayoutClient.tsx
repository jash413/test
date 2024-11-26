// file: components/dashboard/SharedProjectLayoutClient.tsx

'use client';

import React, { useState, useEffect } from 'react';
import ProjectSelector from '@/components/dashboard/ProjectSelector';
import QuickLinksDropdown from '@/components/dashboard/QuickLinks';
import ProjectTabs from '@/components/dashboard/ProjectTabs';
import { Project } from '@/server/projectAction';

interface SharedProjectLayoutClientProps {
  children: React.ReactNode;
  title: string;
  currentProjectId: number;
  projects: Project[];
  tabs: { name: string; href: string }[];
  basePath: string;
  isDynamicTab?: boolean;
}

export default function SharedProjectLayoutClient({
  children,
  title,
  currentProjectId,
  projects,
  tabs,
  basePath,
  isDynamicTab = false
}: SharedProjectLayoutClientProps) {
  const [dynamicTabs, setDynamicTabs] = useState(tabs);

  useEffect(() => {
    if (isDynamicTab) {
      const updatedTabs = tabs.map((tab) =>
        tab.name === 'Bid Details'
          ? { ...tab, href: `bid_details/${currentProjectId}` }
          : tab
      );
      setDynamicTabs(updatedTabs);
    }
  }, [tabs, currentProjectId, isDynamicTab]);

  return (
    <div className="space-y-1">
      <div className="border-b border-[hsl(var(--border))]">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
            {title}
          </h1>
          <div className="flex items-center space-x-4">
            <QuickLinksDropdown />
            <ProjectSelector
              projects={projects}
              currentProjectId={currentProjectId}
            />
          </div>
        </div>
        <ProjectTabs
          tabs={dynamicTabs}
          basePath={basePath}
          currentProjectId={currentProjectId}
        />
      </div>
      <div className="p-4">
        <main className="pt-2">{children}</main>
      </div>
    </div>
  );
}
