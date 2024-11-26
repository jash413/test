// components/dashboard/status/TaskList.tsx

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
import { format } from 'date-fns';
import { projectData } from '@/server/utils/mockdata';

interface TaskListProps {
  tasks: typeof projectData.tasks;
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const formatDate = (date: string | null) => {
    if (!date) return 'Not started';
    return format(new Date(date), 'MMM d, yyyy');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Estimated Start</TableHead>
              <TableHead>Estimated Finish</TableHead>
              <TableHead>Actual Start</TableHead>
              <TableHead>New Estimated Finish</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Actual Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{formatDate(task.estimatedStart)}</TableCell>
                <TableCell>{formatDate(task.estimatedFinish)}</TableCell>
                <TableCell>{formatDate(task.actualStart)}</TableCell>
                <TableCell>{formatDate(task.newEstimatedFinish)}</TableCell>
                <TableCell>${task.estimatedBudget.toLocaleString()}</TableCell>
                <TableCell>${task.actualCost.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TaskList;
