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

const tasks = [
  { id: 1, name: 'Design phase', status: 'Completed', assignee: 'John Doe' },
  {
    id: 2,
    name: 'Foundation work',
    status: 'In Progress',
    assignee: 'Jane Smith'
  },
  {
    id: 3,
    name: 'Electrical wiring',
    status: 'Pending',
    assignee: 'Bob Johnson'
  }
];

export default function ProjectTasks({ params }: { params: { id: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assignee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.assignee}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
