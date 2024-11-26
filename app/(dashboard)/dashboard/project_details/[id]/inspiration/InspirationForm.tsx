// File: app/(dashboard)/dashboard/project_details/[id]/inspiration/InspirationForm.tsx

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { MultiStepForm } from '@/components/forms/MultiStep/MultiStepForm';
import {
  TooltipProvider,
  TooltipContent
} from '@/components/forms/TooltipContext';
import { Tooltip } from '@/components/forms/ToolTip';
import GenericFormSubmitHandler from '@/components/forms/MultiStep/FormSubmitHandler';
import {
  fieldTooltips,
  inspirationSchema,
  inspration_steps,
  defaultValues
} from './schema_and_defaults';
import { useSession } from 'next-auth/react';

// Define constants for the hardcoded values
const MODEL_TYPE = 'Inspiration';
const API_ENDPOINT = '/api/generic-model/inspiration';
const getRedirectPath = (projectId: string) =>
  `/dashboard/project_details/${projectId}/inspiration`;

// Use this type for your form state and default values
interface InspirationFormProps {
  inspirationData?: any;
  inspirationId?: string;
  projectId: string;
  categories: string[];
  tags: string[];
}

export default function InspirationForm({
  inspirationData,
  inspirationId,
  projectId,
  categories,
  tags
}: InspirationFormProps) {
  const { status } = useSession();
  const isEditMode = !!inspirationId;

  // console.log('inspirationData:', inspirationData);
  const [currentTooltip, setCurrentTooltip] = useState<TooltipContent>({
    description: 'Select an input to see tips.',
    example: 'Select an input to see example',
    label: ''
  });

  const updateTooltip = useCallback((fieldName: string) => {
    const tooltipContent = fieldTooltips[fieldName];
    if (tooltipContent) {
      setCurrentTooltip(tooltipContent);
    } else {
      setCurrentTooltip({
        description: 'No tips available for this field.',
        example: '',
        label: ''
      });
    }
  }, []);

  const resetTooltip = useCallback(() => {
    setCurrentTooltip({
      description: 'Select an input to see tips.',
      example: '',
      label: ''
    });
  }, []);

  const initialValues = useMemo(() => {
    if (isEditMode && inspirationData) {
      return {
        ...inspirationData
      };
    } else {
      return {
        ...defaultValues
      };
    }
  }, [isEditMode, inspirationData]);

  if (status === 'unauthenticated') {
    return <div>Access Denied</div>;
  }

  if (isEditMode && !inspirationData) {
    return <div>Loading...</div>;
  }

  return (
    <TooltipProvider>
      <div className="mx-auto mt-0 max-w-6xl bg-white px-4">
        <div className="flex">
          <div className="w-2/3 pr-8">
            <h2 className="mb-6 text-center text-2xl font-semibold text-secondary-foreground">
              {isEditMode ? 'Edit Inspiration' : 'Create New Inspiration'}
            </h2>

            <div className="relative">
              <GenericFormSubmitHandler
                isEditMode={isEditMode}
                modelId={inspirationId}
                modelType={MODEL_TYPE}
                projectId={projectId}
                apiEndpoint={API_ENDPOINT}
                redirectPath={getRedirectPath(projectId)}
                initialValues={initialValues}
              >
                {(handleSubmit) => (
                  <MultiStepForm
                    steps={inspration_steps}
                    schema={inspirationSchema}
                    onSubmit={handleSubmit}
                    updateTooltip={updateTooltip}
                    resetTooltip={resetTooltip}
                    fieldTooltips={fieldTooltips}
                    defaultValues={initialValues}
                    selectFieldsWithCustomOptions={{
                      category: categories
                    }}
                    multiSelectFields={{
                      tags: tags
                    }}
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
