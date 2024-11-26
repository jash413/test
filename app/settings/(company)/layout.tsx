// file : /app/team/layout.tsx

import AIChatWindow from '@/components/AIChatWindow';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { getSideMenuItems } from '@/server/utils/sidemenu_items_tabs';
import type { Metadata } from 'next';

import Link from 'next/link';
import { headers } from 'next/headers';
import CommonNav from '@/components/settings/CommonNav';

export const metadata: Metadata = {
  title: 'Buildify - AI-Powered Construction Management Tool',
  description:
    'Revolutionize your construction projects with AI-driven insights and automation'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const someDefaultId = 0;
  const sideMenuItemsFromBackend = await getSideMenuItems();

  // get url pathname in server side
  const headersList = headers();
  let pathname = headersList.get('referer') || '';

  return (
    <>
      {/* <main className="flex-1 overflow-auto p-6"> */}
      <div className="mx-auto max-w-7xl">
        <CommonNav />
        {children}
      </div>
      {/* </main> */}
    </>
  );
}