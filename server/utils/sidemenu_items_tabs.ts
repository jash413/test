export async function getSideMenuItems() {
  const sideMenuItems = [
    {
      name: 'Dashboard',
      iconName: 'LayoutDashboard',
      items: [
        { name: 'Overview', iconName: 'Home', href: '/dashboard' },
        {
          name: 'Analytics',
          iconName: 'BarChart',
          href: '/dashboard/analytics'
        }
      ]
    },
    {
      name: 'Business',
      iconName: 'Briefcase',
      items: [
        { name: 'Sales', iconName: 'TrendingUp', href: '/business/sales' },
        {
          name: 'Finances',
          iconName: 'DollarSign',
          href: '/business/finances'
        },
        { name: 'Reports', iconName: 'FileText', href: '/business/reports' }
      ]
    },
    {
      name: 'Projects',
      iconName: 'Folder',
      items: [
        {
          name: 'All Projects',
          iconName: 'FolderOpen',
          href: '/dashboard/all_projects'
        },
        {
          name: 'Project Details',
          iconName: 'FileText',
          href: '/dashboard/project_details/{projectId}'
        },
        {
          name: 'Schedule',
          iconName: 'Calendar',
          href: '/dashboard/schedule/{projectId}'
        },
        {
          name: 'Finances',
          iconName: 'DollarSign',
          href: '/dashboard/finances/{projectId}'
        },
        {
          name: 'Bids',
          iconName: 'FileSignature',
          href: '/dashboard/bids/{projectId}'
        }
      ]
    },
    {
      name: 'Team',
      iconName: 'Users',
      items: [
        { name: 'Members', iconName: 'User', href: '/team/members' },
        {
          name: 'Subcontractors',
          iconName: 'UserPlus',
          href: '/team/subcontractors'
        },
        {
          name: 'Performance',
          iconName: 'TrendingUp',
          href: '/team/performance'
        }
      ]
    },
    {
      name: 'Messages',
      iconName: 'Mail',
      href: '/communication/messages'
    },
    {
      name: 'Photos and Documents',
      iconName: 'Image',
      href: '/file-manager/folders'
    },
    {
      name: 'Account & Settings',
      iconName: 'Settings',
      // href: '/settings/profile'
      items: [
        {
          name: 'Profile',
          iconName: 'User',
          href: '/settings/profile'
        },
        {
          name: 'Company Profile',
          iconName: 'Building',
          href: '/settings/company'
        }
      ]
    }
    // {
    //   name: 'Settings',
    //   iconName: 'Settings',
    //   items: [
    //     {
    //       name: 'Profile',
    //       iconName: 'User',
    //       href: '/settings/profile'
    //     },
    //     {
    //       name: 'Permissions',
    //       iconName: 'Shield',
    //       href: '/settings/permissions'
    //     },
    //     {
    //       name: 'Onboarding',
    //       iconName: 'Clipboard',
    //       href: '/settings/onboarding'
    //     },
    //     {
    //       name: 'views',
    //       iconName: 'Eye',
    //       href: '/settings/views'
    //     },
    //     {
    //       name: 'Company Profile',
    //       iconName: 'Building',
    //       href: '/settings/company'
    //     },
    //     {
    //       name: 'User Preferences',
    //       iconName: 'UserCog',
    //       href: '/settings/preferences'
    //     },
    //     {
    //       name: 'Integrations',
    //       iconName: 'Link',
    //       href: '/settings/integrations'
    //     }
    //   ]
    // }
  ];

  return sideMenuItems;
}

interface Tab {
  name: string;
  href: string;
}
export const getTabs = async (menuItem: string): Promise<Tab[]> => {
  const bidTabs: Tab[] = [
    { name: 'All Bids', href: '' },
    { name: 'Bid Details', href: 'bid_details' }
  ];

  const financeTabs: Tab[] = [
    { name: 'Summary', href: '' },
    { name: 'Purchase Orders', href: 'purchase_orders' },
    { name: 'Estimate & Budget', href: 'estimate_budget' },
    { name: 'Cost and Performance', href: 'cost_performance' },
    { name: 'Payables', href: 'payables' },
    { name: 'Receivables', href: 'receivables' },
    { name: 'Reports', href: 'reports' }
  ];

  const scheduleTabs: Tab[] = [
    { name: 'Schedule Summary', href: '' },
    { name: 'Daily Logs', href: 'daily_logs' },
    { name: 'Task Schedule', href: 'task_schedule' },
    { name: 'Milestones', href: 'milestones' },
    { name: 'Punch List', href: 'punch_list' }
  ];
  const projectTabs: Tab[] = [
    { name: 'Overview', href: '' },
    { name: 'Takeoff', href: 'takeoff' },
    { name: 'Specifications', href: 'specifications' },
    { name: 'Inspiration', href: 'inspiration' },
    { name: 'Tasks', href: 'tasks' },
    { name: 'Change Orders', href: 'change_orders' },
    { name: 'Purchase Orders', href: 'purchase_orders' },
    { name: 'progression notes', href: 'progression_notes' },
    { name: 'Team', href: 'team' }
  ];

  switch (menuItem) {
    case 'bids':
      return bidTabs;
    case 'finances':
      return financeTabs;
    case 'project_details':
      return projectTabs;
    case 'schedule':
      return scheduleTabs;
    default:
      return [];
  }
};
