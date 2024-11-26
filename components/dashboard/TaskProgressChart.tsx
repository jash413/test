// components/dashboard/TaskProgressChart.tsx

'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Task {
  name: string;
  timeProgress: number;
  budgetProgress: number;
}

interface TaskProgressChartProps {
  tasks: Task[];
}

const TaskProgressChart: React.FC<TaskProgressChartProps> = ({ tasks }) => {
  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={tasks}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="timeProgress" fill="#3b82f6" name="Time %" />
          <Bar dataKey="budgetProgress" fill="#22c55e" name="Budget %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskProgressChart;
