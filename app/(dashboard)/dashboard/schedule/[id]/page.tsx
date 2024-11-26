// app/dashboard/project_details/[id]/schedule/summary/page.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, isAfter } from 'date-fns';
import dynamic from 'next/dynamic';
import { projectData } from '@/server/utils/mockdata';

const InteractiveChart = dynamic(
  () => import('@/components/InteractiveChart'),
  { ssr: false }
);

interface Task {
  id: number;
  name: string;
  estimatedStart: string;
  estimatedFinish: string;
  actualStart: string | null;
  actualFinish: string | null;
  newEstimatedFinish: string;
  estimatedBudget: number;
  actualCost: number;
  projectedCost: number;
  timeProgress: number;
  budgetProgress: number;
  status: string;
}

const getTaskStatus = (task: Task) => {
  const today = new Date();
  const estimatedFinish = new Date(task.estimatedFinish);
  const newEstimatedFinish = new Date(task.newEstimatedFinish);

  if (task.status === 'completed') return 'completed';
  if (isAfter(today, estimatedFinish) && task.status !== 'completed')
    return 'delayed';
  if (isAfter(newEstimatedFinish, estimatedFinish)) return 'at-risk';
  return 'on-time';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
    case 'on-time':
      return 'bg-green-500';
    case 'at-risk':
      return 'bg-yellow-500';
    case 'delayed':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const ScheduleSummaryPage = () => {
  const taskStatuses = projectData.tasks.map((task) => ({
    ...task,
    status: getTaskStatus(task)
  }));

  const chartData = taskStatuses.map((task) => ({
    name: task.name,
    estimatedStart: new Date(task.estimatedStart).getTime(),
    estimatedFinish: new Date(task.estimatedFinish).getTime(),
    actualStart: task.actualStart ? new Date(task.actualStart).getTime() : null,
    actualFinish: task.actualFinish
      ? new Date(task.actualFinish).getTime()
      : new Date(task.newEstimatedFinish).getTime(),
    status: task.status
  }));

  const renderTaskList = (tasks: typeof taskStatuses) => (
    <ul className="mb-4 space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center rounded bg-white p-2 shadow-sm"
        >
          <div
            className={`mr-2 h-4 w-4 rounded-full ${getStatusColor(
              task.status
            )}`}
          ></div>
          <span className="font-medium">{task.name}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="space-y-6 bg-gray-100 p-6">
      <h1 className="text-3xl font-bold">Schedule Summary</h1>

      <Card>
        <CardHeader>
          <CardTitle>Task Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <InteractiveChart chartData={chartData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">Estimated Start</p>
              <p className="text-lg">
                {format(
                  new Date(projectData.timeMetrics.estimatedStart),
                  'MMM d, yyyy'
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Estimated Finish</p>
              <p className="text-lg">
                {format(
                  new Date(projectData.timeMetrics.estimatedFinish),
                  'MMM d, yyyy'
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Projected Finish</p>
              <p className="text-lg">
                {format(
                  new Date(projectData.timeMetrics.projectedFinish),
                  'MMM d, yyyy'
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="mb-2 text-lg font-semibold">
            On-Time/Completed Tasks
          </h3>
          {renderTaskList(
            taskStatuses.filter(
              (task) => task.status === 'on-time' || task.status === 'completed'
            )
          )}

          <h3 className="mb-2 text-lg font-semibold">Delayed Tasks</h3>
          {renderTaskList(
            taskStatuses.filter((task) => task.status === 'delayed')
          )}

          <h3 className="mb-2 text-lg font-semibold">At-Risk Tasks</h3>
          {renderTaskList(
            taskStatuses.filter((task) => task.status === 'at-risk')
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleSummaryPage;
