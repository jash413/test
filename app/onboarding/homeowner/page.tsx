// File: app/onboarding/homeowner/page.tsx

import React from 'react';
import HomeOwnerOnboardingForm from './HomeOwnerOnboardingForm';

export default function HomeOwnerOnboardingPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-grow overflow-auto">
        <HomeOwnerOnboardingForm />
      </div>
    </div>
  );
}
