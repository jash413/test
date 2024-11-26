'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Treemap
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Task {
  name: string;
  budgeted: number;
  actual: number;
  category: string;
  estimatedFinishDate: string;
  actualFinishDate: string;
}

interface BudgetDashboardProps {
  tasks: Task[];
}

const BudgetDashboard: React.FC<BudgetDashboardProps> = ({ tasks }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | 'All'>('All');

  // Calculate summary data
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => new Date(task.actualFinishDate) <= new Date()).length;
  const totalBudgeted = tasks.reduce((sum, task) => sum + task.budgeted, 0);
  const totalSpent = tasks.reduce((sum, task) => sum + task.actual, 0);
  const tasksOnTime = tasks.filter(task => task.actualFinishDate <= task.estimatedFinishDate).length;
  const tasksUnderBudget = tasks.filter(task => task.actual <= task.budgeted).length;

  // Group data by category
  const categoryData = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = { budgeted: 0, actual: 0 };
    }
    acc[task.category].budgeted += task.budgeted;
    acc[task.category].actual += task.actual;
    return acc;
  }, {} as Record<string, { budgeted: number; actual: number }>);

  const groupedBarData = Object.entries(categoryData).map(([category, data]) => ({
    category,
    budgeted: data.budgeted,
    actual: data.actual,
  }));

  const treemapData = tasks.map(task => ({
    name: task.name,
    size: task.budgeted,
    category: task.category,
  }));

  const filteredTasks = selectedCategory === 'All' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{completedTasks} / {totalTasks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Budget Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalSpent.toLocaleString()} / ${totalBudgeted.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>On-Time Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{tasksOnTime} / {totalTasks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Under Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{tasksUnderBudget} / {totalTasks}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Budget Overview by Category</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={groupedBarData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="budgeted" fill="#8884d8" name="Budgeted" />
            <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Budget Distribution</h2>
        <ResponsiveContainer width="100%" height={400}>
          <Treemap
            data={treemapData}
            dataKey="size"
            aspectRatio={4/3}
            stroke="#fff"
            fill="#8884d8"
          >
            <Tooltip />
          </Treemap>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Detailed Task Breakdown</h2>
        <Select onValueChange={(value) => setSelectedCategory(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {Object.keys(categoryData).map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Budgeted</TableHead>
              <TableHead>Actual</TableHead>
              <TableHead>Variance</TableHead>
              <TableHead>Estimated Finish</TableHead>
              <TableHead>Actual Finish</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map(task => (
              <TableRow key={task.name}>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.category}</TableCell>
                <TableCell>${task.budgeted.toLocaleString()}</TableCell>
                <TableCell>${task.actual.toLocaleString()}</TableCell>
                <TableCell className={task.budgeted - task.actual >= 0 ? 'text-green-600' : 'text-red-600'}>
                  ${(task.budgeted - task.actual).toLocaleString()}
                </TableCell>
                <TableCell>{task.estimatedFinishDate}</TableCell>
                <TableCell>{task.actualFinishDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BudgetDashboard;