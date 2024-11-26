// components/dashboard/BudgetStatusCard.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface BudgetStatusCardProps {
  totalBudget: number;
  categories: { label: string; value: number; color: string }[];
  budgetMetrics: {
    estimatedBudget: number;
    actualSpent: number;
    projectedTotal: number;
  };
  costSummary: {
    actualCostSpent: number;
    forecastTotalCost: number;
    estimatedCostRemaining: number;
    estimatedCompletionCost: number;
  };
  status: 'on-track' | 'at-risk' | 'off-track';
}

const BudgetStatusCard: React.FC<BudgetStatusCardProps> = ({
  totalBudget,
  categories,
  budgetMetrics,
  costSummary,
  status
}) => {
  const statusColors = {
    'on-track': 'bg-green-500',
    'at-risk': 'bg-yellow-500',
    'off-track': 'bg-red-500'
  };

  const progressPercentage =
    (costSummary.actualCostSpent / costSummary.forecastTotalCost) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Budget Status
          <span
            className={`rounded px-2 py-1 text-xs font-semibold text-white ${statusColors[status]}`}
          >
            {status.replace('-', ' ').toUpperCase()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <p>
              Estimated Budget: {formatCurrency(budgetMetrics.estimatedBudget)}
            </p>
            <p>Actual Spent: {formatCurrency(budgetMetrics.actualSpent)}</p>
          </div>
          <p className="text-sm">
            Projected Total: {formatCurrency(budgetMetrics.projectedTotal)}
          </p>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Progress value={progressPercentage} className="mt-2 h-2" />
                  <div className="mt-1 flex justify-between text-xs">
                    <span>
                      {formatCurrency(costSummary.actualCostSpent)} spent
                    </span>
                    <span>
                      {formatCurrency(costSummary.forecastTotalCost)} total
                    </span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Estimated cost remaining:{' '}
                  {formatCurrency(costSummary.estimatedCostRemaining)}
                </p>
                <p>
                  Estimated completion cost:{' '}
                  {formatCurrency(costSummary.estimatedCompletionCost)}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="grid grid-cols-2 gap-2">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="mr-2 h-3 w-3 rounded-sm"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-sm">
                  {category.label}: {formatCurrency(category.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetStatusCard;
