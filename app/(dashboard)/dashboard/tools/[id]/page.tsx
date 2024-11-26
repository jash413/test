// app/(dashboard)/dashboard/project_details/[id]/tools/page.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ToolSection {
  name: string;
  description: string;
  href: string;
}

const toolSections: ToolSection[] = [
  {
    name: 'Specifications',
    description: 'View and manage project specifications',
    href: 'specifications',
  },
  {
    name: 'Takeoff',
    description: 'Perform quantity takeoffs for your project',
    href: 'takeoff',
  },
  {
    name: 'Inspiration',
    description: 'Browse inspiration for your project design',
    href: 'inspiration',
  },
];

export default function ToolsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Project Tools</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {toolSections.map((section) => (
          <Card key={section.name}>
            <CardHeader>
              <CardTitle>{section.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{section.description}</p>
              <Button asChild>
                <Link href={`/dashboard/project_details/${params.id}/tools/${section.href}`}>
                  Go to {section.name}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}