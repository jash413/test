//file : app/(home)/Header.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              BuildifyAI
            </Link>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="/product"
                className="text-gray-500 hover:text-gray-900"
              >
                Product
              </Link>
              <Link
                href="/solutions"
                className="text-gray-500 hover:text-gray-900"
              >
                Solutions
              </Link>
              <Link
                href="/pricing"
                className="text-gray-500 hover:text-gray-900"
              >
                Pricing
              </Link>
              <Link
                href="/resources"
                className="text-gray-500 hover:text-gray-900"
              >
                Resources
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <Link
              href="/auth/signin"
              className="mr-4 text-gray-500 hover:text-gray-900"
            >
              Log in
            </Link>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
