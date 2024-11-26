//file components/project/BudgetTaskChartClient.tsx

'use client';

import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Task {
  name: string;
  budgeted: number;
  actual: number;
}

interface BudgetTaskChartClientProps {
  tasks: Task[];
}

const BudgetTaskChartClient: React.FC<BudgetTaskChartClientProps> = ({ tasks }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const sortedTasks = [...tasks].sort((a, b) => b.budgeted - a.budgeted);
  const top10Tasks = sortedTasks.slice(0, 10);

  const summaryData = {
    labels: top10Tasks.map(task => task.name),
    datasets: [
      {
        label: 'Budgeted',
        data: top10Tasks.map(task => task.budgeted),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Actual',
        data: top10Tasks.map(task => task.actual),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const summaryOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Top 10 Tasks by Budget',
      },
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        setSelectedTask(top10Tasks[index]);
      }
    },
  };

  const detailData = selectedTask
    ? {
        labels: ['Budgeted', 'Actual'],
        datasets: [
          {
            label: selectedTask.name,
            data: [selectedTask.budgeted, selectedTask.actual],
            backgroundColor: ['rgba(53, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'],
          },
        ],
      }
    : null;

  const detailOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: selectedTask ? `Details for ${selectedTask.name}` : 'Select a task for details',
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Line options={summaryOptions} data={summaryData} />
      {selectedTask && (
        <div style={{ marginTop: '20px' }}>
          <Bar options={detailOptions} data={detailData!} />
        </div>
      )}
    </div>
  );
};

export default BudgetTaskChartClient;