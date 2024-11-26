import React from 'react';
import dynamic from 'next/dynamic';

const BudgetTaskChartClient = dynamic(() => import('./BudgetTaskChartClient'), {
  ssr: false,
  loading: () => <p>Loading chart...</p>
});

interface Task {
  name: string;
  budgeted: number;
  actual: number;
}

interface BudgetTaskChartProps {
  tasks: Task[];
}

const BudgetTaskChart: React.FC<BudgetTaskChartProps> = ({ tasks }) => {
  return <BudgetTaskChartClient tasks={tasks} />;
};

export default BudgetTaskChart;