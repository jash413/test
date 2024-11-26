// components/dashboard/ProjectSummary.tsx

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { projectData } from '@/server/utils/mockdata';

interface ProjectSummaryProps {
  project: typeof projectData;
}

const ProjectSummary: React.FC<ProjectSummaryProps> = ({ project }) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <h2 className="text-2xl font-bold">{project.name}</h2>
          <p>Time Status: {project.overallStatus.time}</p>
          <p>Budget Status: {project.overallStatus.budget}</p>
        </div>
        <div className="text-right">
          <p>
            Estimated Budget: $
            {project.costMetrics.estimatedTotal.toLocaleString()}
          </p>
          <p>
            Actual Spent: ${project.costMetrics.actualSpent.toLocaleString()}
          </p>
          <p>
            Projected Total: $
            {project.costMetrics.projectedTotal.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectSummary;
