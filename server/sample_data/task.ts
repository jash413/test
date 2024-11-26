import moment from 'moment';
// Function to calculate dates based on start date and duration with deviation
const calculateDates = (
  startDate: string,
  duration: number,
  deviationPercent: number
): string => {
  const deviationDays = duration * (deviationPercent / 100);
  const adjustedDuration = duration + deviationDays;
  return moment(startDate).add(adjustedDuration, 'days').format('YYYY-MM-DD');
};

// Function to calculate actual cost based on budgeted cost and percentage deviation
const calculateActualCost = (
  budgeted: number,
  deviationPercent: number
): number => {
  return budgeted + budgeted * (deviationPercent / 100);
};

// Function to update task status based on current date
const updateTaskStatus = (task: any, currentDate: moment.Moment): string => {
  const startDate = moment(task.estimatedFinishDate).subtract(
    task.duration,
    'days'
  );
  const endDate = moment(task.estimatedFinishDate);

  if (task.status === 'Completed') {
    return 'Completed';
  } else if (currentDate.isBetween(startDate, endDate, null, '[]')) {
    return 'In Progress';
  } else if (currentDate.isAfter(endDate)) {
    return 'Delayed';
  } else {
    return 'Yet to Start';
  }
};

// Function to generate tasks with auto-populated dates, costs, and status
const generateTasks = (
  startDate: string,
  tasks: any[],
  deviationPercent: number,
  currentDate: moment.Moment
): any[] => {
  let currentTaskDate = moment(startDate);
  return tasks.map((task) => {
    const estimatedFinishDate = calculateDates(
      currentTaskDate.format('YYYY-MM-DD'),
      task.duration,
      deviationPercent
    );
    const actualFinishDate =
      task.status === 'Completed' ? estimatedFinishDate : null;
    const actual = calculateActualCost(task.budgeted, deviationPercent);
    currentTaskDate = moment(estimatedFinishDate);
    const status = updateTaskStatus(
      { ...task, estimatedFinishDate },
      currentDate
    );
    return {
      ...task,
      estimatedFinishDate,
      actualFinishDate,
      actual,
      status
    };
  });
};

// Sample tasks with duration and status
const sampleTasks = [
  // Pre-Construction
  {
    name: 'Site Evaluation',
    budgeted: 5000,
    category: 'Pre-Construction',
    duration: 10,
    status: 'Completed'
  },
  {
    name: 'Architectural Design',
    budgeted: 20000,
    category: 'Pre-Construction',
    duration: 15,
    status: 'Completed'
  },
  {
    name: 'Engineering Design',
    budgeted: 15000,
    category: 'Pre-Construction',
    duration: 20,
    status: 'Yet to Start'
  },
  {
    name: 'Permitting',
    budgeted: 8000,
    category: 'Pre-Construction',
    duration: 25,
    status: 'Yet to Start'
  },
  {
    name: 'Bid Process',
    budgeted: 3000,
    category: 'Pre-Construction',
    duration: 15,
    status: 'Yet to Start'
  },

  // Excavation
  {
    name: 'Site Clearing',
    budgeted: 6000,
    category: 'Excavation',
    duration: 10,
    status: 'Completed'
  },
  {
    name: 'Excavation',
    budgeted: 12000,
    category: 'Excavation',
    duration: 15,
    status: 'Completed'
  },
  {
    name: 'Foundation Formwork',
    budgeted: 8000,
    category: 'Excavation',
    duration: 10,
    status: 'Yet to Start'
  },
  {
    name: 'Foundation Reinforcement',
    budgeted: 5000,
    category: 'Excavation',
    duration: 10,
    status: 'Yet to Start'
  },
  {
    name: 'Foundation Pour',
    budgeted: 10000,
    category: 'Excavation',
    duration: 10,
    status: 'Yet to Start'
  },

  // Framing
  {
    name: 'Framing Materials',
    budgeted: 25000,
    category: 'Framing',
    duration: 15,
    status: 'Completed'
  },
  {
    name: 'Framing Labor',
    budgeted: 18000,
    category: 'Framing',
    duration: 15,
    status: 'Completed'
  },
  {
    name: 'Roof Framing',
    budgeted: 15000,
    category: 'Framing',
    duration: 10,
    status: 'Yet to Start'
  },
  {
    name: 'Roof Sheathing',
    budgeted: 6000,
    category: 'Framing',
    duration: 10,
    status: 'Yet to Start'
  },
  {
    name: 'Exterior Wall Framing',
    budgeted: 10000,
    category: 'Framing',
    duration: 10,
    status: 'Yet to Start'
  },

  // Mechanical, Electrical, and Plumbing (MEP)
  {
    name: 'Plumbing Rough-In',
    budgeted: 15000,
    category: 'MEP',
    duration: 15,
    status: 'Completed'
  },
  {
    name: 'Electrical Rough-In',
    budgeted: 12000,
    category: 'MEP',
    duration: 15,
    status: 'Completed'
  },
  {
    name: 'HVAC Installation',
    budgeted: 20000,
    category: 'MEP',
    duration: 20,
    status: 'Yet to Start'
  },
  {
    name: 'Insulation',
    budgeted: 8000,
    category: 'MEP',
    duration: 10,
    status: 'Yet to Start'
  },

  // Drywall and Finishes
  {
    name: 'Drywall Installation',
    budgeted: 10000,
    category: 'Drywall and Finishes',
    duration: 15,
    status: 'Completed'
  },
  {
    name: 'Drywall Finishing',
    budgeted: 5000,
    category: 'Drywall and Finishes',
    duration: 10,
    status: 'Completed'
  },
  {
    name: 'Interior Painting',
    budgeted: 8000,
    category: 'Drywall and Finishes',
    duration: 10,
    status: 'Yet to Start'
  },
  {
    name: 'Exterior Painting',
    budgeted: 6000,
    category: 'Drywall and Finishes',
    duration: 10,
    status: 'Yet to Start'
  },
  {
    name: 'Flooring Installation',
    budgeted: 15000,
    category: 'Drywall and Finishes',
    duration: 15,
    status: 'Yet to Start'
  },

  // Cabinets and Countertops
  {
    name: 'Kitchen Cabinets',
    budgeted: 12000,
    category: 'Cabinets and Countertops',
    duration: 15,
    status: 'Completed'
  },
  {
    name: 'Bathroom Cabinets',
    budgeted: 5000,
    category: 'Cabinets and Countertops',
    duration: 10,
    status: 'Completed'
  },
  {
    name: 'Countertops',
    budgeted: 8000,
    category: 'Cabinets and Countertops',
    duration: 10,
    status: 'Yet to Start'
  },

  // Fixtures and Appliances
  {
    name: 'Lighting Fixtures',
    budgeted: 5000,
    category: 'Fixtures and Appliances',
    duration: 10,
    status: 'Completed'
  },
  {
    name: 'Plumbing Fixtures',
    budgeted: 8000,
    category: 'Fixtures and Appliances',
    duration: 10,
    status: 'Completed'
  },
  {
    name: 'Kitchen Appliances',
    budgeted: 15000,
    category: 'Fixtures and Appliances',
    duration: 15,
    status: 'Yet to Start'
  },
  {
    name: 'Bathroom Appliances',
    budgeted: 5000,
    category: 'Fixtures and Appliances',
    duration: 10,
    status: 'Yet to Start'
  },

  // Landscaping and Exterior
  {
    name: 'Landscaping',
    budgeted: 10000,
    category: 'Landscaping and Exterior',
    duration: 15,
    status: 'Completed'
  },
  {
    name: 'Driveway and Walkway',
    budgeted: 8000,
    category: 'Landscaping and Exterior',
    duration: 10,
    status: 'Completed'
  },
  {
    name: 'Fencing',
    budgeted: 5000,
    category: 'Landscaping and Exterior',
    duration: 10,
    status: 'Yet to Start'
  },
  {
    name: 'Exterior Finishes',
    budgeted: 12000,
    category: 'Landscaping and Exterior',
    duration: 15,
    status: 'Yet to Start'
  },

  // Final Touches
  {
    name: 'Cleaning',
    budgeted: 3000,
    category: 'Final Touches',
    duration: 10,
    status: 'Completed'
  },
  {
    name: 'Final Inspection',
    budgeted: 2000,
    category: 'Final Touches',
    duration: 5,
    status: 'Completed'
  },
  {
    name: 'Occupancy Permit',
    budgeted: 1000,
    category: 'Final Touches',
    duration: 5,
    status: 'Yet to Start'
  },

  // Additional Tasks to reach 50
  {
    name: 'Security System',
    budgeted: 3000,
    category: 'MEP',
    duration: 10,
    status: 'Completed'
  },
  {
    name: 'Window Treatments',
    budgeted: 4000,
    category: 'Drywall and Finishes',
    duration: 10,
    status: 'Yet to Start'
  },
  {
    name: 'Garage Door Installation',
    budgeted: 5000,
    category: 'Exterior',
    duration: 10,
    status: 'Yet to Start'
  },
  {
    name: 'Siding Installation',
    budgeted: 7000,
    category: 'Exterior',
    duration: 10,
    status: 'Yet to Start'
  },
  {
    name: 'Gutter Installation',
    budgeted: 3000,
    category: 'Exterior',
    duration: 10,
    status: 'Yet to Start'
  },
  {
    name: 'Solar Panel Installation',
    budgeted: 10000,
    category: 'MEP',
    duration: 15,
    status: 'Completed'
  },
  {
    name: 'Attic Insulation',
    budgeted: 4000,
    category: 'MEP',
    duration: 10,
    status: 'Yet to Start'
  },
  {
    name: 'Basement Finishing',
    budgeted: 15000,
    category: 'Drywall and Finishes',
    duration: 15,
    status: 'Yet to Start'
  },
  {
    name: 'Custom Shelving',
    budgeted: 6000,
    category: 'Cabinets and Countertops',
    duration: 10,
    status: 'Yet to Start'
  },
  {
    name: 'Home Automation',
    budgeted: 5000,
    category: 'MEP',
    duration: 10,
    status: 'Yet to Start'
  }
];

// Start date for the project
const startDate = moment().format('YYYY-MM-DD');

// Current date
const currentDate = moment();

// Deviation percentage for costs and duration
const deviationPercent = 5; // +/- 5%

// Generate tasks with auto-populated dates, costs, and status
const tasks = generateTasks(
  startDate,
  sampleTasks,
  deviationPercent,
  currentDate
);

// console.log(tasks);

export function generateTasksSampleData(
  deviationPercent: number,
  startDate: string
): any[] {
  return generateTasks(startDate, sampleTasks, deviationPercent, currentDate);
}
