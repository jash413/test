// file: app/(dashboard)/dashboard/project_details/ProjectForm.tsx

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { MultiStepForm } from '@/components/forms/MultiStep/MultiStepForm';
import {
  TooltipProvider,
  TooltipContent
} from '@/components/forms/TooltipContext';
import { Tooltip } from '@/components/forms/ToolTip';
import { useSession } from 'next-auth/react';
import GenericFormSubmitHandler from '@/components/forms/MultiStep/FormSubmitHandler';
import {
  fieldTooltips,
  projectSchema,
  steps,
  defaultValues
} from './schema_and_defaults';

// Constants
const MODEL_TYPE = 'Project';
const API_ENDPOINT = '/api/generic-model/project';
const REDIRECT_PATH = `/dashboard/all_projects`;

interface ProjectFormProps {
  projectData?: any;
  projectId?: string;
}

export default function ProjectForm({
  projectData,
  projectId
}: ProjectFormProps) {
  const { status } = useSession();
  const isEditMode = !!projectId;

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
    if (isEditMode && projectData) {
      return {
        ...projectData
      };
    } else {
      return {
        ...defaultValues
      };
    }
  }, [isEditMode, projectData]);

  if (status === 'unauthenticated') {
    return <div>Access Denied</div>;
  }

  if (isEditMode && !projectData) {
    return <div>Loading...</div>;
  }

  return (
    <TooltipProvider>
      <div className="mx-auto mt-0 max-w-6xl bg-white px-4">
        <div className="flex">
          <div className="w-2/3 pr-8">
            <h2 className="mb-6 text-center text-2xl font-semibold text-secondary-foreground">
              {isEditMode ? 'Edit Project' : 'Create New Project'}
            </h2>

            <div className="relative">
              <GenericFormSubmitHandler
                isEditMode={isEditMode}
                modelId={projectId}
                modelType={MODEL_TYPE}
                projectId={projectId}
                apiEndpoint={API_ENDPOINT}
                redirectPath={REDIRECT_PATH}
                initialValues={initialValues}
              >
                {(handleSubmit) => (
                  <MultiStepForm
                    steps={steps}
                    schema={projectSchema}
                    onSubmit={handleSubmit}
                    updateTooltip={updateTooltip}
                    resetTooltip={resetTooltip}
                    fieldTooltips={fieldTooltips}
                    defaultValues={initialValues}
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
