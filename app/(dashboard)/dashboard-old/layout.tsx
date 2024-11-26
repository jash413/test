import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { getSideMenuItems } from '@/server/utils/sidemenu_items_tabs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const someDefaultId = 0;
  const categoriesFromBackend = await getSideMenuItems();
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          defaultProjectId={someDefaultId}
          sideMenuItems={categoriesFromBackend}
          dynamicVariable="{projectId}"
        />
        <main className="flex-1 overflow-hidden pt-16">{children}</main>
      </div>
    </>
  );
}
