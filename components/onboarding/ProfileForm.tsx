// file : components/onboarding/ProfileForm.tsx

import React, { useState, useCallback } from 'react';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { MultiStepForm, Step } from '@/components/forms/del-MultiStepForm';
import {
  TooltipProvider,
  TooltipContent
} from '@/components/forms/TooltipContext';
import { Tooltip } from '@/components/forms/ToolTip';
import { useSession } from 'next-auth/react';
import { useLoadingAPI } from '@/app/hooks/useLoadingAPI';
import { useError } from '@/components/ErrorProvider';
import { FilePreview } from '@/components/FilePreview';

interface FileUploadProp {
  label: string;
  accept: string;
}

interface ProfileFormProps {
  profileType: 'user' | 'business';
  schema: any;
  steps: Step[];
  fieldTooltips: Record<string, TooltipContent>;
  fileUploadProps: Record<string, FileUploadProp>;
  multiSelectFields?: Record<string, string[]>;
  apiEndpoint: string;
  defaultValues?: any;
}

export default function ProfileForm({
  profileType,
  schema,
  steps,
  fieldTooltips,
  fileUploadProps,
  multiSelectFields,
  apiEndpoint,
  defaultValues = {}
}: ProfileFormProps) {
  const { data: session, status, update } = useSession();
  const [fileUploads, setFileUploads] = useState<Record<string, File | null>>(
    {}
  );
  const router = useCustomRouter();

  const { fetchWithLoading } = useLoadingAPI();
  const { setError } = useError();

  const [currentTooltip, setCurrentTooltip] = useState<TooltipContent>({
    description: 'Select an input to see tips.',
    example: 'Select an input to see example',
    label: ''
  });

  const updateTooltip = useCallback(
    (fieldName: string) => {
      const tooltipContent =
        fieldTooltips[fieldName as keyof typeof fieldTooltips];
      if (tooltipContent) {
        setCurrentTooltip(tooltipContent);
      } else {
        setCurrentTooltip({
          description: 'No tips available for this field.',
          example: '',
          label: ''
        });
      }
    },
    [fieldTooltips]
  );

  const resetTooltip = useCallback(() => {
    setCurrentTooltip({
      description: 'Select an input to see tips.',
      example: '',
      label: ''
    });
  }, []);

  const handleFileSelect = useCallback(
    (file: File | null, fieldName: string) => {
      if (file) {
        setFileUploads((prev) => ({ ...prev, [fieldName]: file }));
      }
    },
    []
  );

  const handleFileDelete = useCallback((fieldName: string) => {
    setFileUploads((prev) => ({ ...prev, [fieldName]: null }));
  }, []);

  const onSubmit = async (data: any) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value) || typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    try {
      const response = await fetchWithLoading(apiEndpoint, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${profileType} profile`);
      }

      const updatedProfile = await response.model;
      console.log('updatedProfile', updatedProfile);
      await update({
        ...session,
        user: {
          ...session?.user,
          [profileType]: updatedProfile
        }
      });
      router.push('/dashboard');
    } catch (error: any) {
      if (error.message) setError(`${error.message}`);
      else setError(`Failed to update ${profileType} profile`);
    }
  };

  if (status === 'unauthenticated') {
    return <div>Access Denied</div>;
  }

  const fileUploadPropsWithFiles = Object.entries(fileUploadProps).reduce(
    (acc, [key, value]) => {
      acc[key] = {
        ...value,
        file: fileUploads[key] || null,
        onFileSelect: (file: File | null) => handleFileSelect(file, key),
        preview: fileUploads[key] ? (
          <FilePreview
            file={fileUploads[key]!}
            onDelete={() => handleFileDelete(key)}
            className="mt-2"
          />
        ) : null
      };
      return acc;
    },
    {} as Record<string, any>
  );

  return (
    <TooltipProvider>
      <div className="mx-auto mt-8 max-w-6xl px-4">
        <div className="flex">
          <div className="w-2/3 pr-8">
            <div className="mb-4 text-right">
              <h1 className="text-xl font-semibold text-primary">
                Welcome, {session?.user?.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {session?.user?.email}
              </p>
            </div>

            <h2 className="mb-6 text-center text-2xl font-semibold text-secondary-foreground">
              Complete Your{' '}
              {profileType === 'user' ? 'Profile' : 'Business Profile'}
            </h2>

            <div className="relative">
              <MultiStepForm
                steps={steps}
                schema={schema}
                onSubmit={onSubmit}
                updateTooltip={updateTooltip}
                resetTooltip={resetTooltip}
                fileUploadProps={fileUploadPropsWithFiles}
                fieldTooltips={fieldTooltips}
                multiSelectFields={multiSelectFields}
                defaultValues={defaultValues}
              />
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
