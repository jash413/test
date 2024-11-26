// File: app/onboarding/homeowner/HomeOwnerOnboardingForm.tsx

'use client';

import React, { useMemo } from 'react';
import { MultiStepForm } from '@/components/forms/MultiStep/MultiStepForm';
import { TooltipProvider } from '@/components/forms/TooltipContext';
import { Tooltip } from '@/components/forms/ToolTip';
import GenericFormSubmitHandler from '@/components/forms/MultiStep/FormSubmitHandler';
import { useSession } from 'next-auth/react';
import { useFormTooltip } from '@/hooks/useFormTooltip';

import { z } from 'zod';
import {
  homeOwnerFormdefaultValues,
  homeOwnerFormfieldTooltips,
  homeownerSchema,
  homeOwnerFormSteps
} from './schema_and_defaults';

// Constants
const MODEL_TYPE = 'Project';
const API_ENDPOINT = '/api/generic-model/project';
const REDIRECT_PATH = '/dashboard';

interface HomeOwnerOnboardingFormProps {
  homeownerData?: z.infer<typeof homeownerSchema>;
  homeownerId?: string;
}

export default function HomeOwnerOnboardingForm({
  homeownerData,
  homeownerId
}: HomeOwnerOnboardingFormProps) {
  const { data: session, update } = useSession();
  const isEditMode = !!homeownerId;

  const { currentTooltip, updateTooltip, resetTooltip } = useFormTooltip(
    homeOwnerFormfieldTooltips
  );

  const intitialValues = useMemo(() => {
    if (isEditMode && homeownerData) {
      return homeownerData;
    } else {
      return {
        name: session?.user?.name + "'s Home",
        project_documents: [],
        ...homeOwnerFormdefaultValues
      };
    }
  }, [isEditMode, homeownerData]);

  const handleSave = async (updatedHomeowner: any) => {
    await update({
      ...session,
      user: {
        ...session?.user,
        homeowner: updatedHomeowner
      }
    });
  };

  return (
    <TooltipProvider>
      <div className="mx-auto mt-8 max-w-6xl bg-white px-4">
        <div className="flex">
          <div className="w-2/3 pr-8">
            <h2 className="mb-6 text-center text-2xl font-semibold text-secondary-foreground">
              {isEditMode
                ? 'Edit Your Project Information'
                : 'Tell Us About Your Project'}
            </h2>

            <div className="relative">
              <GenericFormSubmitHandler
                isEditMode={isEditMode}
                modelId={homeownerId}
                modelType={MODEL_TYPE}
                apiEndpoint={API_ENDPOINT}
                redirectPath={REDIRECT_PATH}
                onSave={handleSave}
              >
                {(handleSubmit) => (
                  <MultiStepForm
                    steps={homeOwnerFormSteps}
                    schema={homeownerSchema}
                    onSubmit={handleSubmit}
                    updateTooltip={updateTooltip}
                    resetTooltip={resetTooltip}
                    fieldTooltips={homeOwnerFormfieldTooltips}
                    defaultValues={intitialValues}
                  />
                )}
              </GenericFormSubmitHandler>
            </div>
          </div>

          <div className="relative w-1/3">
            <div
              className="fixed top-1/2 -translate-y-1/2 transform pr-16"
              style={{ width: 'calc(33.333% - 2rem)' }}
            >
              <Tooltip content={currentTooltip} />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
