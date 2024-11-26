// components/dashboard/status/TimeStatusCard.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { formatDistanceToNow, format } from 'date-fns';

interface TimeStatusCardProps {
  totalTasks: number;
  categories: { label: string; value: number; color: string }[];
  timeMetrics: {
    estimatedStart: string;
    estimatedFinish: string;
    actualStart: string;
    projectedFinish: string;
  };
  timeSummary: {
    actualTimeSpent: number;
    forecastTotalTime: number;
    estimatedTimeRemaining: number;
  };
  status: 'on-track' | 'at-risk' | 'off-track';
}

const TimeStatusCard: React.FC<TimeStatusCardProps> = ({
  totalTasks,
  categories,
  timeMetrics,
  timeSummary,
  status
}) => {
  const statusColors = {
    'on-track': 'bg-green-500',
    'at-risk': 'bg-yellow-500',
    'off-track': 'bg-red-500'
  };

  const progressPercentage =
    (timeSummary.actualTimeSpent / timeSummary.forecastTotalTime) * 100;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Time Status
          <span
            className={`rounded px-2 py-1 text-xs font-semibold text-white ${statusColors[status]}`}
          >
            {status.replace('-', ' ').toUpperCase()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <div>
              <p>
                Estimated Start:{' '}
                {format(new Date(timeMetrics.estimatedStart), 'MMM d, yyyy')}
              </p>
              <p>
                Actual Start:{' '}
                {format(new Date(timeMetrics.actualStart), 'MMM d, yyyy')}
              </p>
            </div>
            <div className="text-right">
              <p>
                Estimated Finish:{' '}
                {format(new Date(timeMetrics.estimatedFinish), 'MMM d, yyyy')}
              </p>
              <p>
                Projected Finish:{' '}
                {format(new Date(timeMetrics.projectedFinish), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Progress value={progressPercentage} className="mt-2 h-2" />
                  <div className="mt-1 flex justify-between text-xs">
                    <span>{timeSummary.actualTimeSpent} days spent</span>
                    <span>{timeSummary.forecastTotalTime} days total</span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Estimated time remaining: {timeSummary.estimatedTimeRemaining}{' '}
                  days
                </p>
                <p>
                  Project is{' '}
                  {formatDistanceToNow(new Date(timeMetrics.actualStart))} old
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="grid grid-cols-2 gap-2">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="mr-2 h-3 w-3 rounded-sm"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-sm">
                  {category.label}: {category.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeStatusCard;
