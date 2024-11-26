// utils/mockData.ts

export const projectData = {
  name: 'Smith Family Residence',
  overallStatus: {
    time: 'at-risk',
    budget: 'on-track'
  },
  timeMetrics: {
    estimatedStart: '2023-03-01',
    estimatedFinish: '2024-02-29',
    actualStart: '2023-03-15',
    projectedFinish: '2024-04-15'
  },
  costMetrics: {
    estimatedTotal: 500000,
    actualSpent: 275000,
    projectedTotal: 525000
  },
  tasks: [
    {
      id: 1,
      name: 'Pre-construction Planning',
      estimatedStart: '2023-03-01',
      estimatedFinish: '2023-03-31',
      actualStart: '2023-03-15',
      actualFinish: '2023-04-10',
      newEstimatedFinish: '2023-04-10',
      estimatedBudget: 15000,
      actualCost: 16500,
      projectedCost: 16500,
      timeProgress: 100,
      budgetProgress: 110,
      status: 'completed'
    },
    {
      id: 2,
      name: 'Site Preparation',
      estimatedStart: '2023-04-01',
      estimatedFinish: '2023-04-30',
      actualStart: '2023-04-15',
      actualFinish: '2023-05-10',
      newEstimatedFinish: '2023-05-10',
      estimatedBudget: 25000,
      actualCost: 27000,
      projectedCost: 27000,
      timeProgress: 100,
      budgetProgress: 108,
      status: 'completed'
    },
    {
      id: 3,
      name: 'Foundation',
      estimatedStart: '2023-05-01',
      estimatedFinish: '2023-05-31',
      actualStart: '2023-05-15',
      actualFinish: '2023-06-15',
      newEstimatedFinish: '2023-06-15',
      estimatedBudget: 50000,
      actualCost: 55000,
      projectedCost: 55000,
      timeProgress: 100,
      budgetProgress: 110,
      status: 'completed'
    },
    {
      id: 4,
      name: 'Framing',
      estimatedStart: '2023-06-01',
      estimatedFinish: '2023-07-15',
      actualStart: '2023-06-20',
      actualFinish: null,
      newEstimatedFinish: '2023-08-05',
      estimatedBudget: 75000,
      actualCost: 60000,
      projectedCost: 80000,
      timeProgress: 80,
      budgetProgress: 80,
      status: 'in-progress'
    },
    {
      id: 5,
      name: 'Roofing',
      estimatedStart: '2023-07-16',
      estimatedFinish: '2023-08-15',
      actualStart: null,
      actualFinish: null,
      newEstimatedFinish: '2023-09-05',
      estimatedBudget: 30000,
      actualCost: 0,
      projectedCost: 32000,
      timeProgress: 0,
      budgetProgress: 0,
      status: 'pending'
    },
    {
      id: 6,
      name: 'Electrical Rough-In',
      estimatedStart: '2023-08-16',
      estimatedFinish: '2023-09-15',
      actualStart: null,
      actualFinish: null,
      newEstimatedFinish: '2023-10-05',
      estimatedBudget: 35000,
      actualCost: 0,
      projectedCost: 35000,
      timeProgress: 0,
      budgetProgress: 0,
      status: 'pending'
    },
    {
      id: 7,
      name: 'Plumbing Rough-In',
      estimatedStart: '2023-08-16',
      estimatedFinish: '2023-09-15',
      actualStart: null,
      actualFinish: null,
      newEstimatedFinish: '2023-10-05',
      estimatedBudget: 30000,
      actualCost: 0,
      projectedCost: 30000,
      timeProgress: 0,
      budgetProgress: 0,
      status: 'pending'
    },
    {
      id: 8,
      name: 'HVAC Installation',
      estimatedStart: '2023-09-01',
      estimatedFinish: '2023-09-30',
      actualStart: null,
      actualFinish: null,
      newEstimatedFinish: '2023-10-20',
      estimatedBudget: 40000,
      actualCost: 0,
      projectedCost: 40000,
      timeProgress: 0,
      budgetProgress: 0,
      status: 'pending'
    },
    {
      id: 9,
      name: 'Insulation',
      estimatedStart: '2023-10-01',
      estimatedFinish: '2023-10-15',
      actualStart: null,
      actualFinish: null,
      newEstimatedFinish: '2023-11-05',
      estimatedBudget: 15000,
      actualCost: 0,
      projectedCost: 15000,
      timeProgress: 0,
      budgetProgress: 0,
      status: 'pending'
    },
    {
      id: 10,
      name: 'Drywall',
      estimatedStart: '2023-10-16',
      estimatedFinish: '2023-11-15',
      actualStart: null,
      actualFinish: null,
      newEstimatedFinish: '2023-12-05',
      estimatedBudget: 25000,
      actualCost: 0,
      projectedCost: 25000,
      timeProgress: 0,
      budgetProgress: 0,
      status: 'pending'
    },
    {
      id: 11,
      name: 'Interior Finishes',
      estimatedStart: '2023-11-16',
      estimatedFinish: '2024-01-15',
      actualStart: null,
      actualFinish: null,
      newEstimatedFinish: '2024-02-05',
      estimatedBudget: 75000,
      actualCost: 0,
      projectedCost: 80000,
      timeProgress: 0,
      budgetProgress: 0,
      status: 'pending'
    },
    {
      id: 12,
      name: 'Exterior Finishes',
      estimatedStart: '2023-12-01',
      estimatedFinish: '2024-01-31',
      actualStart: null,
      actualFinish: null,
      newEstimatedFinish: '2024-02-20',
      estimatedBudget: 50000,
      actualCost: 0,
      projectedCost: 52000,
      timeProgress: 0,
      budgetProgress: 0,
      status: 'pending'
    },
    {
      id: 13,
      name: 'Flooring',
      estimatedStart: '2024-01-16',
      estimatedFinish: '2024-02-15',
      actualStart: null,
      actualFinish: null,
      newEstimatedFinish: '2024-03-05',
      estimatedBudget: 30000,
      actualCost: 0,
      projectedCost: 30000,
      timeProgress: 0,
      budgetProgress: 0,
      status: 'pending'
    },
    {
      id: 14,
      name: 'Landscaping',
      estimatedStart: '2024-02-01',
      estimatedFinish: '2024-02-29',
      actualStart: null,
      actualFinish: null,
      newEstimatedFinish: '2024-04-15',
      estimatedBudget: 20000,
      actualCost: 0,
      projectedCost: 22000,
      timeProgress: 0,
      budgetProgress: 0,
      status: 'pending'
    }
  ],
  milestones: [
    {
      id: 1,
      name: 'Project Kickoff',
      date: '2023-03-01',
      actualDate: '2023-03-15',
      status: 'completed'
    },
    {
      id: 2,
      name: 'Foundation Complete',
      date: '2023-05-31',
      actualDate: '2023-06-15',
      status: 'completed'
    },
    {
      id: 3,
      name: 'Framing Complete',
      date: '2023-07-15',
      actualDate: null,
      status: 'in-progress'
    },
    {
      id: 4,
      name: 'Roof Installation Complete',
      date: '2023-08-15',
      actualDate: null,
      status: 'pending'
    },
    {
      id: 5,
      name: 'Rough-In Inspections Passed',
      date: '2023-09-30',
      actualDate: null,
      status: 'pending'
    },
    {
      id: 6,
      name: 'Drywall Complete',
      date: '2023-11-15',
      actualDate: null,
      status: 'pending'
    },
    {
      id: 7,
      name: 'Interior Finishes Complete',
      date: '2024-01-15',
      actualDate: null,
      status: 'pending'
    },
    {
      id: 8,
      name: 'Final Inspections Passed',
      date: '2024-02-20',
      actualDate: null,
      status: 'pending'
    },
    {
      id: 9,
      name: 'Project Completion',
      date: '2024-02-29',
      actualDate: null,
      status: 'pending'
    }
  ]
};
