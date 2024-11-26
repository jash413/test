// app/(dashboard)/dashboard/project_details/[id]/finances/page.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BudgetDashboard from '@/components/project/BudgetDashboard';
import { actualVsBudget } from '../../project_details/[id]/mockdata';

async function getFinancialSummary() {
  // In a real app, fetch this data from an API or database
  return {
    totalBudget: 1000000,
    totalSpent: 750000,
    remainingBudget: 250000,
  };
}

export default async function FinancesSummaryPage() {
  const summary = await getFinancialSummary();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h3 className="text-lg font-semibold">Total Budget</h3>
            <p className="text-2xl font-bold">${summary.totalBudget.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Spent</h3>
            <p className="text-2xl font-bold">${summary.totalSpent.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Remaining Budget</h3>
            <p className="text-2xl font-bold">${summary.remainingBudget.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1">
          <div className="w-full max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Task Budget vs. Actual Spend</h2>
              <BudgetDashboard tasks={actualVsBudget} />
          </div>
        </div>

      </CardContent>
    </Card>

  );
}
