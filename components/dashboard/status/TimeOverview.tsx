//

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { format, differenceInDays } from 'date-fns';
import { projectData } from '@/server/utils/mockdata';

interface TimeOverviewProps {
  timeMetrics: typeof projectData.timeMetrics;
  tasks: typeof projectData.tasks;
}

const TimeOverview: React.FC<TimeOverviewProps> = ({ timeMetrics, tasks }) => {
  const totalDays = differenceInDays(
    new Date(timeMetrics.estimatedFinish),
    new Date(timeMetrics.estimatedStart)
  );
  const daysElapsed = differenceInDays(
    new Date(),
    new Date(timeMetrics.actualStart)
  );
  const progressPercentage = (daysElapsed / totalDays) * 100;

  const formatDate = (date: string | null) => {
    if (!date) return 'Not set';
    return format(new Date(date), 'MMM d, yyyy');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p>Estimated Start: {formatDate(timeMetrics.estimatedStart)}</p>
            <p>Estimated Finish: {formatDate(timeMetrics.estimatedFinish)}</p>
            <p>Actual Start: {formatDate(timeMetrics.actualStart)}</p>
            <p>Projected Finish: {formatDate(timeMetrics.projectedFinish)}</p>
          </div>
          <div>
            <p>Overall Progress</p>
            <Progress value={progressPercentage} className="mt-2" />
          </div>
          <div>
            <h3 className="font-semibold">Task Timeline</h3>
            {tasks.map((task) => (
              <div key={task.id} className="mt-2">
                <p>{task.name}</p>
                <div className="flex items-center space-x-2">
                  <span>{formatDate(task.estimatedStart)}</span>
                  <Progress value={task.timeProgress} className="flex-grow" />
                  <span>{formatDate(task.newEstimatedFinish)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeOverview;
