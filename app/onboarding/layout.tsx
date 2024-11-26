// File: app/onboarding/layout.tsx

import React from 'react';

export default function OnboardingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar - Logo */}
      <div className="w-1/6 bg-gray-100 p-4">
        <h1 className="mb-6 overflow-hidden whitespace-nowrap text-center text-2xl font-bold">
          Buildify AI
        </h1>
      </div>

      {/* Main Content */}
      <div className="w-5/6 bg-white p-4">{children}</div>
    </div>
  );
}
