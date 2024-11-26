// file : app/(dashboard)/dashboard/project_details/[id]/page.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FileText, Image, Activity } from 'lucide-react';
import {
  //   projectData,
  calendarEvents,
  latestFiles,
  projectSpendings,
  recentActivities
} from './mockdata';
import ProjectHeader from '@/components/dashboard/ProjectHeader';

import ReusableTable from '@/components/table/ReusableTable';
import { getProject } from '@/server/api';
import { auth } from '@/auth';
import { ProjectShape } from '@/server/types/mappings';
import TimeStatusCard from '@/components/dashboard/status/TimestatusCard';
import BudgetStatusCard from '@/components/dashboard/status/BudgetStatusCard';

export default async function ProjectOverview({
  params
}: {
  params: { id: string };
}) {
  const session = await auth();
  const token = session?.user?.apiUserToken as string;
  const id = params.id;
  const projectDetails: ProjectShape = (await getProject(
    id,
    token
  )) as ProjectShape;

  const taskCategories = [
    {
      label: 'Active',
      value: projectDetails.timeline_info.activeTasks,
      color: '#3b82f6'
    },
    {
      label: 'Completed',
      value: projectDetails.timeline_info.completedTasks,
      color: '#22c55e'
    },
    {
      label: 'Overdue',
      value: projectDetails.timeline_info.overdueTasks,
      color: '#ef4444'
    },
    {
      label: 'Yet to start',
      value: projectDetails.timeline_info.yetToStartTasks,
      color: '#ce7e00'
    }
  ];

  const budgetCategories = [
    {
      label: 'Spent',
      value: projectDetails.budget_info.totalSpent,
      color: '#22c55e'
    },
    {
      label: 'Remaining',
      value: projectDetails.budget_info.remainingBudget,
      color: '#3b82f6'
    },
    {
      label: 'Over Budget',
      value: projectDetails.budget_info.underOverBudget,
      color: '#ef4444'
    }
  ];

  const spendingsColumns = [
    { header: 'MANAGER', accessor: 'manager' },
    { header: 'DATE', accessor: 'date' },
    { header: 'AMOUNT', accessor: 'amount' },
    { header: 'STATUS', accessor: 'status' },
    { header: 'DETAILS', accessor: 'details' }
  ];

  const preparedSpendingsData = projectSpendings.map((spending) => ({
    manager: (
      <div className="flex items-center">
        <Avatar className="mr-2 h-8 w-8">
          <AvatarImage
            src={spending.manager.avatar}
            alt={spending.manager.name}
          />
          <AvatarFallback>{spending.manager.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{spending.manager.name}</p>
          <p className="text-xs text-gray-500">{spending.manager.email}</p>
        </div>
      </div>
    ),
    date: spending.date,
    amount: `$${spending.amount.toFixed(2)}`,
    status: (
      <Badge
        variant={
          spending.status === 'approved'
            ? 'default'
            : spending.status === 'rejected'
            ? 'destructive'
            : 'default'
        }
      >
        {spending.status}
      </Badge>
    ),
    details: <button className="text-blue-500 hover:underline">View</button>
  }));

  const filterConfig = {
    timeFilter: [
      { label: 'All Time', value: 'All Time' },
      { label: 'This Month', value: 'This Month' },
      { label: 'Last Month', value: 'Last Month' }
    ],
    statusFilter: [
      { label: 'All Orders', value: 'All Orders' },
      { label: 'Pending', value: 'Pending' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Rejected', value: 'Rejected' }
    ]
  };

  return (
    <div className="space-y-4 p-4">
      <ProjectHeader
        id={projectDetails.id}
        name={projectDetails.name}
        logo={projectDetails.file_info?.log}
        status={projectDetails.status}
        description={projectDetails.description}
        address={projectDetails.address}
        heatedSquareFootage={projectDetails.square_footage}
        nonHeatedSquareFootage={projectDetails.non_heated_square_footage}
        lotSizeAcres={projectDetails.lot_size_in_acres}
        timelineInfo={projectDetails.timeline_info}
        budgetInfo={projectDetails.budget_info}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <TimeStatusCard
          totalTasks={projectDetails.timeline_info.totalTasks}
          categories={taskCategories}
          timeMetrics={{
            estimatedStart: '2023-02-28',
            estimatedFinish: '2024-02-28',
            actualStart: '2023-03-14',
            projectedFinish: '2024-04-14'
          }}
          timeSummary={{
            actualTimeSpent: 45,
            forecastTotalTime: 60,
            estimatedTimeRemaining: 15
          }}
          status="at-risk"
        />
        <BudgetStatusCard
          totalBudget={projectDetails.budget_info.originalEstimateBudget}
          categories={budgetCategories}
          budgetMetrics={{
            estimatedBudget: 500000,
            actualSpent: 275000,
            projectedTotal: 525000
          }}
          costSummary={{
            actualCostSpent: projectDetails.budget_info.totalSpent,
            forecastTotalCost:
              projectDetails.budget_info.originalEstimateBudget,
            estimatedCostRemaining: projectDetails.budget_info.remainingBudget,
            estimatedCompletionCost:
              projectDetails.budget_info.forecastedEstimateBudget
          }}
          status="on-track"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>What&apos;s on the road?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {calendarEvents.map((event, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-16 flex-shrink-0 text-center">
                    <div className="text-lg font-bold">{event.date}</div>
                    <div className="text-sm text-gray-500">{event.time}</div>
                  </div>
                  <div className="ml-4">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-gray-500">
                      Lead by {event.lead}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {latestFiles.map((file, index) => (
                <div key={index} className="flex items-center">
                  {file.icon === 'FileText' ? (
                    <FileText className="mr-2 h-6 w-6" />
                  ) : (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <Image className="mr-2 h-6 w-6" />
                  )}
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-gray-500">
                      {file.uploadedBy} • {file.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <Activity className="mr-2 mt-1 h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{activity.action}</div>
                    <div className="text-sm text-gray-500">
                      {activity.user} • {activity.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Project Spendings</CardTitle>
          </CardHeader>
          <CardContent>
            <ReusableTable
              columns={spendingsColumns}
              data={preparedSpendingsData}
              initialPageSize={5}
              filterConfig={filterConfig}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
