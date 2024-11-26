//file : app/dashboard/all_projects/page.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, ArrowUpRight } from 'lucide-react';

import { getProjects } from '@/server/projectAction';
import { auth } from '@/auth';
import Link from 'next/link';

// Mock data for projects
// const projects = [
//   { id: 1, name: 'Residential Complex A', status: 'In Progress', progress: 65, budget: 1500000, dueDate: '2023-12-31' },
//   { id: 2, name: 'Commercial Building B', status: 'Planning', progress: 20, budget: 3000000, dueDate: '2024-06-30' },
//   { id: 3, name: 'Highway Renovation C', status: 'Completed', progress: 100, budget: 5000000, dueDate: '2023-10-15' },
//   { id: 4, name: 'Bridge Construction D', status: 'Delayed', progress: 40, budget: 2000000, dueDate: '2023-11-30' },
//   { id: 5, name: 'School Expansion E', status: 'On Hold', progress: 50, budget: 1000000, dueDate: '2024-02-28' },
// ];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'in progress':
      return 'bg-blue-500';
    case 'planning':
      return 'bg-yellow-500';
    case 'completed':
      return 'bg-green-500';
    case 'delayed':
      return 'bg-red-500';
    case 'on hold':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

export const dynamic = 'force-dynamic';

const AllProjectsPage = async () => {
  const session = await auth();
  const projects = await getProjects(session?.user?.apiUserToken as string);

  // Calculate total budget
  const totalBudget = projects.reduce(
    (sum, project) => sum + (project.budget_estimated || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">
          All Projects
        </h1>
        <Link href="project_details/create">
          <Button className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
            <PlusCircle className="mr-2 h-4 w-4" /> New Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                projects.filter((p) => p.status.toLowerCase() === 'in progress')
                  .length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                projects.filter((p) => p.status.toLowerCase() === 'completed')
                  .length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {totalBudget.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${getStatusColor(project.status)} text-white`}
                    >
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Progress
                        value={project.percentage_complete || 0}
                        className="mr-2"
                      />
                      <span>{project.percentage_complete || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    $
                    {(project.budget_estimated || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </TableCell>
                  <TableCell>{project.dueDate}</TableCell>
                  <TableCell>
                    <Link href={`/dashboard/project_details/${project.id}`}>
                      <Button variant="ghost" size="sm">
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </Link>
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

export default AllProjectsPage;
