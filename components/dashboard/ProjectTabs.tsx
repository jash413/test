// file: components/dashboard/ProjectTabs.tsx

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface Tab {
  name: string;
  href: string;
}

interface ProjectTabsProps {
  tabs: Tab[];
  basePath: string;
  currentProjectId: number;
}

export default function ProjectTabs({
  tabs,
  basePath,
  currentProjectId
}: ProjectTabsProps) {
  const pathname = usePathname();

  return (
    <nav
      className="flex space-x-4 rounded-t-lg bg-[hsl(var(--secondary))] p-2"
      role="tablist"
    >
      {tabs.map((tab) => {
        const fullHref =
          tab.href === ''
            ? `${basePath}/${currentProjectId}`
            : `${basePath}/${currentProjectId}/${tab.href}`;

        const isActive =
          pathname === fullHref ||
          (tab.href !== '' && pathname.startsWith(fullHref));

        return (
          <Link
            key={tab.name}
            href={fullHref}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out ${
              isActive
                ? 'bg-[hsl(var(--sidebar-active))] text-white'
                : 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-white'
            }`}
            role="tab"
            aria-selected={isActive}
            aria-current={isActive ? 'page' : undefined}
          >
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}
