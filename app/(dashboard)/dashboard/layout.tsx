import AIChatWindow from '@/components/AIChatWindow';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { getSideMenuItems } from '@/server/utils/sidemenu_items_tabs';
import type { Metadata } from 'next';

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
  return (
    <>
      <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Sidebar
          defaultProjectId={someDefaultId}
          sideMenuItems={sideMenuItemsFromBackend}
          dynamicVariable="{projectId}"
        />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-auto p-6">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
      <AIChatWindow />
    </>
  );
}
