const avat_url = '/avatar2.png';

export const projectData = {
  name: 'Sunset Villa',
  status: 'n time and on budget',
  dueDate: '29 Jan, 2024',
  address: '123 Main St, Anytown USA',
  lotSize: 0.25,
  heatedSquareFootage: 3023,
  nonHeatedSquareFootage: 1000,
  tasksCompleted: 75,
  budgetSpent: 15000000, // Updated to reflect a larger budget for construction
  teamMembers: [
    { name: 'John Doe', avatar: avat_url },
    { name: 'Jane Smith', avatar: avat_url },
    { name: 'Alice Johnson', avatar: avat_url },
    { name: 'Bob Brown', avatar: avat_url },
    { name: 'Charlie Davis', avatar: avat_url }
  ],
  description:
    'Larget single family home on a tough lot with 3-bedrooms and 2-bathrooms',
  openTasks: 19,
  logo: '/logo.png',
  timelineTaskInfo: {
    originalEstimatedDate: '29 Jan, 2024',
    forecasetedEstimatedDate: '23 Feb, 2024',
    status: 'R',
    totalTasks: 100,
    activeTasks: 20,
    completedTasks: 40,
    overdueTasks: 20,
    yetToStartTasks: 20
  },
  budgetInfo: {
    originalEstimateBudget: 500000,
    forecastedEstimateBudget: 350000,
    totalSpent: 150000,
    remainingBudget: 350000,
    underOverBudget: 150000,
    status: 'G'
  }
};

export const tasksOverTimeData = [
  { name: 'Jan', tasks: 30 },
  { name: 'Feb', tasks: 45 },
  { name: 'Mar', tasks: 60 },
  { name: 'Apr', tasks: 75 },
  { name: 'May', tasks: 90 },
  { name: 'Jun', tasks: 100 }
];

export const calendarEvents = [
  {
    date: '23',
    time: '9:00 - 10:30 AM',
    title: 'Foundation Inspection',
    lead: 'Terry Baptista'
  },
  {
    date: '24',
    time: '11:00 - 11:45 AM',
    title: 'Material Delivery Coordination',
    lead: 'John Doe'
  },
  {
    date: '25',
    time: '12:00 - 13:00 PM',
    title: 'Architectural Review Meeting',
    lead: 'Jane Smith'
  }
];

export const latestFiles = [
  {
    name: 'Structural Drawings',
    icon: 'FileText',
    uploadedBy: 'Emma Smith',
    date: '2 days ago'
  },
  {
    name: 'Site Survey Report',
    icon: 'Image',
    uploadedBy: 'Melody Macy',
    date: '1 week ago'
  },
  {
    name: 'Permit Approvals',
    icon: 'FileText',
    uploadedBy: 'Max Smith',
    date: '3 days ago'
  },
  {
    name: 'Construction Schedule',
    icon: 'Image',
    uploadedBy: 'Sean Bean',
    date: '5 days ago'
  }
];

export const newContributors = [
  { name: 'Emma Smith', avatar: avat_url, completedTasks: 18, pendingTasks: 5 },
  {
    name: 'Melody Macy',
    avatar: avat_url,
    completedTasks: 12,
    pendingTasks: 8
  },
  { name: 'Max Smith', avatar: avat_url, completedTasks: 9, pendingTasks: 4 },
  { name: 'Sean Bean', avatar: avat_url, completedTasks: 7, pendingTasks: 3 },
  { name: 'Brian Cox', avatar: avat_url, completedTasks: 4, pendingTasks: 6 }
];

export const projectSpendings = [
  {
    manager: {
      name: 'Emma Smith',
      avatar: avat_url,
      email: 'emma@example.com'
    },
    date: 'Jun 20, 2024',
    amount: 522000.0,
    status: 'rejected'
  },
  {
    manager: {
      name: 'Melody Macy',
      avatar: avat_url,
      email: 'melody@example.com'
    },
    date: 'Sep 22, 2024',
    amount: 742000.0,
    status: 'approved'
  },
  {
    manager: { name: 'Max Smith', avatar: avat_url, email: 'max@example.com' },
    date: 'Jun 24, 2024',
    amount: 977000.0,
    status: 'approved'
  },
  {
    manager: { name: 'Sean Bean', avatar: avat_url, email: 'sean@example.com' },
    date: 'Sep 22, 2024',
    amount: 521000.0,
    status: 'approved'
  },
  {
    manager: {
      name: 'Brian Cox',
      avatar: avat_url,
      email: 'brian@example.com'
    },
    date: 'Feb 21, 2024',
    amount: 641000.0,
    status: 'in progress'
  },
  {
    manager: {
      name: 'Mikaela Collins',
      avatar: avat_url,
      email: 'mikaela@example.com'
    },
    date: 'Sep 23, 2024',
    amount: 865000.0,
    status: 'in progress'
  },
  {
    manager: {
      name: 'Francis Mitcham',
      avatar: avat_url,
      email: 'francis@example.com'
    },
    date: 'Jun 24, 2024',
    amount: 948000.0,
    status: 'in progress'
  },
  {
    manager: {
      name: 'Olivia Wild',
      avatar: avat_url,
      email: 'olivia@example.com'
    },
    date: 'Oct 25, 2024',
    amount: 800000.0,
    status: 'in progress'
  },
  {
    manager: { name: 'Neil Owen', avatar: avat_url, email: 'neil@example.com' },
    date: 'Apr 15, 2024',
    amount: 675000.0,
    status: 'in progress'
  },
  {
    manager: { name: 'Dan Wilson', avatar: avat_url, email: 'dan@example.com' },
    date: 'Feb 21, 2024',
    amount: 485000.0,
    status: 'rejected'
  }
];

export const actualVsBudget = [
  // Pre-Construction
  {
    name: 'Site Evaluation',
    budgeted: 5000,
    actual: 4500,
    category: 'Pre-Construction',
    estimatedFinishDate: '2023-01-10',
    actualFinishDate: '2023-01-12'
  },
  {
    name: 'Architectural Design',
    budgeted: 20000,
    actual: 18000,
    category: 'Pre-Construction',
    estimatedFinishDate: '2023-01-25',
    actualFinishDate: '2023-01-28'
  },
  {
    name: 'Engineering Design',
    budgeted: 15000,
    actual: 14000,
    category: 'Pre-Construction',
    estimatedFinishDate: '2023-02-10',
    actualFinishDate: '2023-02-12'
  },
  {
    name: 'Permitting',
    budgeted: 8000,
    actual: 7500,
    category: 'Pre-Construction',
    estimatedFinishDate: '2023-02-28',
    actualFinishDate: '2023-03-02'
  },
  {
    name: 'Bid Process',
    budgeted: 3000,
    actual: 2800,
    category: 'Pre-Construction',
    estimatedFinishDate: '2023-03-15',
    actualFinishDate: '2023-03-18'
  },

  // Excavation
  {
    name: 'Site Clearing',
    budgeted: 6000,
    actual: 5500,
    category: 'Excavation',
    estimatedFinishDate: '2023-03-20',
    actualFinishDate: '2023-03-22'
  },
  {
    name: 'Excavation',
    budgeted: 12000,
    actual: 11000,
    category: 'Excavation',
    estimatedFinishDate: '2023-03-25',
    actualFinishDate: '2023-03-27'
  },
  {
    name: 'Foundation Formwork',
    budgeted: 8000,
    actual: 7500,
    category: 'Excavation',
    estimatedFinishDate: '2023-04-01',
    actualFinishDate: '2023-04-03'
  },
  {
    name: 'Foundation Reinforcement',
    budgeted: 5000,
    actual: 4800,
    category: 'Excavation',
    estimatedFinishDate: '2023-04-05',
    actualFinishDate: '2023-04-07'
  },
  {
    name: 'Foundation Pour',
    budgeted: 10000,
    actual: 9500,
    category: 'Excavation',
    estimatedFinishDate: '2023-04-10',
    actualFinishDate: '2023-04-12'
  },

  // Framing
  {
    name: 'Framing Materials',
    budgeted: 25000,
    actual: 24000,
    category: 'Framing',
    estimatedFinishDate: '2023-04-15',
    actualFinishDate: '2023-04-17'
  },
  {
    name: 'Framing Labor',
    budgeted: 18000,
    actual: 17500,
    category: 'Framing',
    estimatedFinishDate: '2023-04-20',
    actualFinishDate: '2023-04-22'
  },
  {
    name: 'Roof Framing',
    budgeted: 15000,
    actual: 14500,
    category: 'Framing',
    estimatedFinishDate: '2023-04-25',
    actualFinishDate: '2023-04-27'
  },
  {
    name: 'Roof Sheathing',
    budgeted: 6000,
    actual: 5800,
    category: 'Framing',
    estimatedFinishDate: '2023-04-30',
    actualFinishDate: '2023-05-02'
  },
  {
    name: 'Exterior Wall Framing',
    budgeted: 10000,
    actual: 9500,
    category: 'Framing',
    estimatedFinishDate: '2023-05-05',
    actualFinishDate: '2023-05-07'
  },

  // Mechanical, Electrical, and Plumbing (MEP)
  {
    name: 'Plumbing Rough-In',
    budgeted: 15000,
    actual: 14500,
    category: 'MEP',
    estimatedFinishDate: '2023-05-10',
    actualFinishDate: '2023-05-12'
  },
  {
    name: 'Electrical Rough-In',
    budgeted: 12000,
    actual: 11500,
    category: 'MEP',
    estimatedFinishDate: '2023-05-15',
    actualFinishDate: '2023-05-17'
  },
  {
    name: 'HVAC Installation',
    budgeted: 20000,
    actual: 19500,
    category: 'MEP',
    estimatedFinishDate: '2023-05-20',
    actualFinishDate: '2023-05-22'
  },
  {
    name: 'Insulation',
    budgeted: 8000,
    actual: 7500,
    category: 'MEP',
    estimatedFinishDate: '2023-05-25',
    actualFinishDate: '2023-05-27'
  },

  // Drywall and Finishes
  {
    name: 'Drywall Installation',
    budgeted: 10000,
    actual: 9500,
    category: 'Drywall and Finishes',
    estimatedFinishDate: '2023-05-30',
    actualFinishDate: '2023-06-01'
  },
  {
    name: 'Drywall Finishing',
    budgeted: 5000,
    actual: 4800,
    category: 'Drywall and Finishes',
    estimatedFinishDate: '2023-06-05',
    actualFinishDate: '2023-06-07'
  },
  {
    name: 'Interior Painting',
    budgeted: 8000,
    actual: 7500,
    category: 'Drywall and Finishes',
    estimatedFinishDate: '2023-06-10',
    actualFinishDate: '2023-06-12'
  },
  {
    name: 'Exterior Painting',
    budgeted: 6000,
    actual: 5500,
    category: 'Drywall and Finishes',
    estimatedFinishDate: '2023-06-15',
    actualFinishDate: '2023-06-17'
  },
  {
    name: 'Flooring Installation',
    budgeted: 15000,
    actual: 14500,
    category: 'Drywall and Finishes',
    estimatedFinishDate: '2023-06-20',
    actualFinishDate: '2023-06-22'
  },

  // Cabinets and Countertops
  {
    name: 'Kitchen Cabinets',
    budgeted: 12000,
    actual: 11500,
    category: 'Cabinets and Countertops',
    estimatedFinishDate: '2023-06-25',
    actualFinishDate: '2023-06-27'
  },
  {
    name: 'Bathroom Cabinets',
    budgeted: 5000,
    actual: 4800,
    category: 'Cabinets and Countertops',
    estimatedFinishDate: '2023-06-30',
    actualFinishDate: '2023-07-02'
  },
  {
    name: 'Countertops',
    budgeted: 8000,
    actual: 7500,
    category: 'Cabinets and Countertops',
    estimatedFinishDate: '2023-07-05',
    actualFinishDate: '2023-07-07'
  },

  // Fixtures and Appliances
  {
    name: 'Lighting Fixtures',
    budgeted: 5000,
    actual: 4500,
    category: 'Fixtures and Appliances',
    estimatedFinishDate: '2023-07-10',
    actualFinishDate: '2023-07-12'
  },
  {
    name: 'Plumbing Fixtures',
    budgeted: 8000,
    actual: 7500,
    category: 'Fixtures and Appliances',
    estimatedFinishDate: '2023-07-15',
    actualFinishDate: '2023-07-17'
  },
  {
    name: 'Kitchen Appliances',
    budgeted: 15000,
    actual: 14500,
    category: 'Fixtures and Appliances',
    estimatedFinishDate: '2023-07-20',
    actualFinishDate: '2023-07-22'
  },
  {
    name: 'Bathroom Appliances',
    budgeted: 5000,
    actual: 4800,
    category: 'Fixtures and Appliances',
    estimatedFinishDate: '2023-07-25',
    actualFinishDate: '2023-07-27'
  },

  // Landscaping and Exterior
  {
    name: 'Landscaping',
    budgeted: 10000,
    actual: 9500,
    category: 'Landscaping and Exterior',
    estimatedFinishDate: '2023-07-30',
    actualFinishDate: '2023-08-01'
  },
  {
    name: 'Driveway and Walkway',
    budgeted: 8000,
    actual: 7500,
    category: 'Landscaping and Exterior',
    estimatedFinishDate: '2023-08-05',
    actualFinishDate: '2023-08-07'
  },
  {
    name: 'Fencing',
    budgeted: 5000,
    actual: 4800,
    category: 'Landscaping and Exterior',
    estimatedFinishDate: '2023-08-10',
    actualFinishDate: '2023-08-12'
  },
  {
    name: 'Exterior Finishes',
    budgeted: 12000,
    actual: 11500,
    category: 'Landscaping and Exterior',
    estimatedFinishDate: '2023-08-15',
    actualFinishDate: '2023-08-17'
  },

  // Final Touches
  {
    name: 'Cleaning',
    budgeted: 3000,
    actual: 2800,
    category: 'Final Touches',
    estimatedFinishDate: '2023-08-20',
    actualFinishDate: '2023-08-22'
  },
  {
    name: 'Final Inspection',
    budgeted: 2000,
    actual: 1800,
    category: 'Final Touches',
    estimatedFinishDate: '2023-08-25',
    actualFinishDate: '2023-08-27'
  },
  {
    name: 'Occupancy Permit',
    budgeted: 1000,
    actual: 900,
    category: 'Final Touches',
    estimatedFinishDate: '2023-08-30',
    actualFinishDate: '2023-09-01'
  },

  // Additional Tasks to reach 50
  {
    name: 'Security System',
    budgeted: 3000,
    actual: 2800,
    category: 'MEP',
    estimatedFinishDate: '2023-09-05',
    actualFinishDate: '2023-09-07'
  },
  {
    name: 'Window Treatments',
    budgeted: 4000,
    actual: 3800,
    category: 'Drywall and Finishes',
    estimatedFinishDate: '2023-09-10',
    actualFinishDate: '2023-09-12'
  },
  {
    name: 'Garage Door Installation',
    budgeted: 5000,
    actual: 4800,
    category: 'Exterior',
    estimatedFinishDate: '2023-09-15',
    actualFinishDate: '2023-09-17'
  },
  {
    name: 'Siding Installation',
    budgeted: 7000,
    actual: 6500,
    category: 'Exterior',
    estimatedFinishDate: '2023-09-20',
    actualFinishDate: '2023-09-22'
  },
  {
    name: 'Gutter Installation',
    budgeted: 3000,
    actual: 2800,
    category: 'Exterior',
    estimatedFinishDate: '2023-09-25',
    actualFinishDate: '2023-09-27'
  },
  {
    name: 'Solar Panel Installation',
    budgeted: 10000,
    actual: 9500,
    category: 'MEP',
    estimatedFinishDate: '2023-09-30',
    actualFinishDate: '2023-10-02'
  },
  {
    name: 'Attic Insulation',
    budgeted: 4000,
    actual: 3800,
    category: 'MEP',
    estimatedFinishDate: '2023-10-05',
    actualFinishDate: '2023-10-07'
  },
  {
    name: 'Basement Finishing',
    budgeted: 15000,
    actual: 14500,
    category: 'Drywall and Finishes',
    estimatedFinishDate: '2023-10-10',
    actualFinishDate: '2023-10-12'
  },
  {
    name: 'Custom Shelving',
    budgeted: 6000,
    actual: 5500,
    category: 'Cabinets and Countertops',
    estimatedFinishDate: '2023-10-15',
    actualFinishDate: '2023-10-17'
  },
  {
    name: 'Home Automation',
    budgeted: 5000,
    actual: 4800,
    category: 'MEP',
    estimatedFinishDate: '2023-10-20',
    actualFinishDate: '2023-10-22'
  }
];

export const recentActivities = [
  {
    id: 1,
    user: 'Mike Johnson',
    action: 'Completed foundation inspection',
    details: 'Passed with no issues',
    date: '2023-08-25T14:30:00Z'
  },
  {
    id: 2,
    user: 'Sarah Lee',
    action: 'Updated electrical plans',
    details: 'Added three new outlets in the kitchen',
    date: '2023-08-25T13:45:00Z'
  },
  {
    id: 3,
    user: 'Tom Builder',
    action: 'Scheduled framing crew',
    details: 'Team of 5, starting next Monday',
    date: '2023-08-25T11:20:00Z'
  },
  {
    id: 4,
    user: 'Emma Client',
    action: 'Approved change order',
    details: 'Upgrade to marble countertops',
    date: '2023-08-25T10:00:00Z'
  },
  {
    id: 5,
    user: 'Dave Plumber',
    action: 'Completed rough-in plumbing',
    details: 'Ready for inspection',
    date: '2023-08-24T16:30:00Z'
  },
  {
    id: 6,
    user: 'Lisa Architect',
    action: 'Submitted revised blueprints',
    details: 'Modified roof pitch as requested',
    date: '2023-08-24T15:00:00Z'
  },
  {
    id: 7,
    user: 'George Foreman',
    action: 'Delivered materials',
    details: 'Roofing shingles and underlayment',
    date: '2023-08-24T14:20:00Z'
  },
  {
    id: 8,
    user: 'Harry Inspector',
    action: 'Scheduled HVAC inspection',
    details: 'Set for next Thursday at 10 AM',
    date: '2023-08-24T11:45:00Z'
  },
  {
    id: 9,
    user: 'Fiona Finisher',
    action: 'Started interior painting',
    details: 'Living room and dining area',
    date: '2023-08-24T10:30:00Z'
  },
  {
    id: 10,
    user: 'Robert Project Manager',
    action: 'Updated project timeline',
    details: 'Adjusted for weather delays, new completion date set',
    date: '2023-08-23T17:00:00Z'
  }
];
