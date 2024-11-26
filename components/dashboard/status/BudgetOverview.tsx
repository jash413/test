// components\dashboard\status\BudgetOverview.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { projectData } from '@/server/utils/mockdata';

interface BudgetOverviewProps {
  costMetrics: typeof projectData.costMetrics;
  tasks: typeof projectData.tasks;
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  costMetrics,
  tasks
}) => {
  const overallProgress =
    (costMetrics.actualSpent / costMetrics.estimatedTotal) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p>
              Estimated Total: ${costMetrics.estimatedTotal.toLocaleString()}
            </p>
            <p>Actual Spent: ${costMetrics.actualSpent.toLocaleString()}</p>
            <p>
              Projected Total: ${costMetrics.projectedTotal.toLocaleString()}
            </p>
          </div>
          <div>
            <p>Overall Budget Progress</p>
            <Progress value={overallProgress} className="mt-2" />
          </div>
          <div>
            <h3 className="font-semibold">Task Budgets</h3>
            {tasks.map((task) => (
              <div key={task.id} className="mt-2">
                <p>{task.name}</p>
                <div className="flex items-center space-x-2">
                  <span>${task.estimatedBudget.toLocaleString()}</span>
                  <Progress value={task.budgetProgress} className="flex-grow" />
                  <span>${task.projectedCost.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetOverview;
