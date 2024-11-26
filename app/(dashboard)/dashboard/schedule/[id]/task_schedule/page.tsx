// app/dashboard/project_details/[id]/schedule/task_schedule/page.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const TaskSchedulePage = () => {
  const tasks = [
    {
      id: 1,
      name: 'Site Preparation',
      startDate: '2023-07-01',
      endDate: '2023-07-15',
      status: 'Completed'
    },
    {
      id: 2,
      name: 'Foundation Work',
      startDate: '2023-07-16',
      endDate: '2023-08-15',
      status: 'In Progress'
    },
    {
      id: 3,
      name: 'Framing',
      startDate: '2023-08-16',
      endDate: '2023-09-30',
      status: 'Pending'
    },
    {
      id: 4,
      name: 'Roofing',
      startDate: '2023-10-01',
      endDate: '2023-10-15',
      status: 'Pending'
    }
    // Add more tasks as needed
  ];

  return (
    <div className="space-y-6 bg-gray-100 p-6">
      <h1 className="text-3xl font-bold">Task Schedule</h1>

      <Card>
        <CardHeader>
          <CardTitle>Project Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>{task.startDate}</TableCell>
                  <TableCell>{task.endDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        task.status === 'Completed'
                          ? 'default'
                          : task.status === 'In Progress'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {task.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskSchedulePage;
