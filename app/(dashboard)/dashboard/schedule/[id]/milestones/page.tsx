// app/dashboard/project_details/[id]/schedule/milestones/page.tsx

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MilestonesPage = () => {
  const milestones = [
    {
      id: 1,
      name: 'Project Kickoff',
      targetDate: '2023-07-01',
      status: 'Completed'
    },
    {
      id: 2,
      name: 'Foundation Complete',
      targetDate: '2023-08-15',
      status: 'Completed'
    },
    {
      id: 3,
      name: 'Framing Complete',
      targetDate: '2023-09-30',
      status: 'In Progress'
    },
    {
      id: 4,
      name: 'Roof Installation',
      targetDate: '2023-10-15',
      status: 'Pending'
    },
    {
      id: 5,
      name: 'Interior Finishes Begin',
      targetDate: '2023-11-01',
      status: 'Pending'
    }
    // Add more milestones as needed
  ];

  return (
    <div className="space-y-6 bg-gray-100 p-6">
      <h1 className="text-3xl font-bold">Project Milestones</h1>

      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <Card key={milestone.id} className="relative">
            <div className="absolute bottom-0 left-0 top-0 w-1 bg-blue-500"></div>
            <CardContent className="ml-4 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{milestone.name}</h3>
                <Badge
                  variant={
                    milestone.status === 'Completed'
                      ? 'default'
                      : milestone.status === 'In Progress'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {milestone.status}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Target Date: {milestone.targetDate}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MilestonesPage;
