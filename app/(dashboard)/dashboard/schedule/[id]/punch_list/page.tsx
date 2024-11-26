// app/dashboard/project_details/[id]/schedule/punch_list/page.tsx

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
import { Checkbox } from '@/components/ui/checkbox';

const PunchListPage = () => {
  const punchListItems = [
    {
      id: 1,
      description: 'Touch up paint in living room',
      responsible: 'Painting Crew',
      dueDate: '2023-11-15',
      completed: false
    },
    {
      id: 2,
      description: 'Fix loose doorknob in master bedroom',
      responsible: 'Carpenter',
      dueDate: '2023-11-10',
      completed: true
    },
    {
      id: 3,
      description: 'Adjust kitchen cabinet alignment',
      responsible: 'Cabinet Installer',
      dueDate: '2023-11-20',
      completed: false
    },
    {
      id: 4,
      description: 'Replace cracked tile in bathroom',
      responsible: 'Tiler',
      dueDate: '2023-11-18',
      completed: false
    }
    // Add more punch list items as needed
  ];

  return (
    <div className="space-y-6 bg-gray-100 p-6">
      <h1 className="text-3xl font-bold">Punch List</h1>

      <Card>
        <CardHeader>
          <CardTitle>Items to Address</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Done</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Responsible</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {punchListItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox checked={item.completed} />
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.responsible}</TableCell>
                  <TableCell>{item.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant={item.completed ? 'default' : 'outline'}>
                      {item.completed ? 'Completed' : 'Pending'}
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

export default PunchListPage;
