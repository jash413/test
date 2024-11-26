//file: app/onboarding/page.tsx

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Briefcase, Construction } from 'lucide-react';
import { useCustomRouter } from '@/hooks/useCustomRouter';

export type UserType = 'homeowner' | 'gc' | 'subcontractor';

export default function UserTypeStep() {
  const router = useCustomRouter();

  const userTypes: {
    type: UserType;
    title: string;
    description: string;
    icon: React.ElementType;
  }[] = [
    {
      type: 'homeowner',
      title: 'Home Owner',
      description: 'I want to manage home improvement projects',
      icon: Home
    },
    {
      type: 'gc',
      title: 'General Contractor',
      description: 'I manage construction projects',
      icon: Briefcase
    },
    {
      type: 'subcontractor',
      title: 'Subcontractor',
      description: 'I specialize in specific trades',
      icon: Construction
    }
  ];

  const handleUserTypeSelect = (type: UserType) => {
    if (type === 'homeowner') {
      router.push('/onboarding/homeowner');
    } else {
      router.push('/onboarding/business/create');
    }
  };

  return (
    <div className="onboarding-container">
      <h2 className="onboarding-title">What best describes you?</h2>
      <div className="grid-responsive">
        {userTypes.map(({ type, title, description, icon: Icon }) => (
          <Card
            key={type}
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => handleUserTypeSelect(type)}
          >
            <CardHeader>
              <Icon className="mx-auto mb-2 h-12 w-12 text-primary" />
              <CardTitle className="text-center">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
