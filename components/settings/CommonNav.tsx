'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import Link from 'next/link';

let tabData = [
  // {
  //   name: 'Permissions',
  //   href: '/settings/permissions',
  //   active: false
  // },
  {
    name: 'Company Profile',
    href: '/settings/company',
    active: false
  },
  // {
  //   name: 'Views',
  //   href: '/settings/views',
  //   active: false
  // },
  {
    name: 'Cost Codes',
    href: '/settings/cost-codes',
    active: false
  },
  {
    name: 'Integrations',
    href: '/settings/integrations',
    active: false
  }
];

const CommonNav = () => {
  const router = useRouter();
  const pathname = usePathname() || '';

  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    tabData = tabData.map((tab) => {
      return {
        ...tab,
        active: pathname.includes(tab.href)
      };
    });
    setActiveTab(pathname);
  }, [pathname]);

  return (
    <div className=" mb-5 flex flex-col gap-5">
      {/* <div className=" pl-1">
        <h3 className=" text-lg font-semibold">
          {tabData?.find((tab) => tab.active)?.name || 'Settings'}
        </h3>
      </div> */}
      <nav
        className="flex space-x-4 rounded-t-lg bg-[hsl(var(--secondary))] p-2"
        role="tablist"
      >
        {tabData.map((tab) => (
          <Link
            href={tab.href}
            key={tab.name}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out ${
              tab.active
                ? 'bg-[hsl(var(--sidebar-active))] text-white'
                : 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-white'
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default CommonNav;
