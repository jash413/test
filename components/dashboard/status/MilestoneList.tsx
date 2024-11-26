// components/dashboard/MilestoneList.tsx

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

interface MilestoneListProps {
  milestones: typeof projectData.milestones;
}

const MilestoneList: React.FC<MilestoneListProps> = ({ milestones }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Milestone</TableHead>
              <TableHead>Estimated Date</TableHead>
              <TableHead>Actual Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {milestones.map((milestone: (typeof projectData.milestones)[0]) => (
              <TableRow key={milestone.id}>
                <TableCell>{milestone.name}</TableCell>
                <TableCell>
                  {format(new Date(milestone.date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {milestone.actualDate
                    ? format(new Date(milestone.actualDate), 'MMM d, yyyy')
                    : 'Pending'}
                </TableCell>
                <TableCell>{milestone.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MilestoneList;
