// file: app/layout.tsx

import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { auth } from '@/auth';

import { LoadingProvider } from '@/components/LoadingProvider';
import { ErrorProvider } from '@/components/ErrorProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BuildifyAI - AI-Powered Construction Management',
  description:
    'Revolutionize your construction projects with AI-driven insights and automation'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Providers session={session}>
          <ErrorProvider>
            <LoadingProvider>
              <Toaster />
              {children}
            </LoadingProvider>
          </ErrorProvider>
        </Providers>
      </body>
    </html>
  );
}
