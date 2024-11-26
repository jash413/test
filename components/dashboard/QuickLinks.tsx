//file components/dashboard/QuickLinks.tsx

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  FileText,
  FileSignature,
  ClipboardList,
  FileEdit
} from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
  { name: 'Project', href: '/dashboard/project_details/create', icon: Plus },
  {
    name: 'Progression Notes',
    href: '/dashboard/projects/notes/create',
    icon: FileText
  },
  { name: 'Bid', href: '/dashboard/bids/create', icon: FileSignature },
  {
    name: 'Task',
    href: '/dashboard/projects/tasks/create',
    icon: ClipboardList
  },
  {
    name: 'Change Order',
    href: '/dashboard/projects/change-orders/create',
    icon: FileEdit
  },
  {
    name: 'Purchase Order',
    href: '/dashboard/projects/purchase-orders/create',
    icon: FileEdit
  }
];

export default function QuickLinksDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Create
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {quickLinks.map((link) => (
          <DropdownMenuItem key={link.name} asChild>
            <Link href={link.href} className="flex items-center">
              <link.icon className="mr-2 h-4 w-4" />
              <span>{link.name}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
