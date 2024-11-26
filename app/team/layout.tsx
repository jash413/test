// file : /app/team/layout.tsx

import AIChatWindow from '@/components/AIChatWindow';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { getSideMenuItems } from '@/server/utils/sidemenu_items_tabs';
import type { Metadata } from 'next';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

import Link from 'next/link';
import { headers } from 'next/headers';

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
      {/* <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100"> */}
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          defaultProjectId={someDefaultId}
          sideMenuItems={sideMenuItemsFromBackend}
          dynamicVariable="{projectId}"
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <div className="mx-auto max-w-7xl">
              <div className=" flex flex-col gap-5">
                {/* <div className=" flex flex-col gap-1 pl-1">
                  <h3 className=" text-lg font-semibold">Users List</h3>
                  <div className=" text-gray-600">
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem>
                          <BreadcrumbPage className="!text-xs !font-medium !text-gray-500">
                            User management
                          </BreadcrumbPage>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage className=" !text-xs !font-medium !text-gray-500">
                            Users List
                          </BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>
                </div> */}

                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
      <AIChatWindow />
    </>
  );
}
