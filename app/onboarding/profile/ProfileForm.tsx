// File: app/onboarding/profile/ProfileForm.tsx

'use client';

import React, { useMemo } from 'react';
import { MultiStepForm } from '@/components/forms/MultiStep/MultiStepForm';
import { TooltipProvider } from '@/components/forms/TooltipContext';
import { Tooltip } from '@/components/forms/ToolTip';
import GenericFormSubmitHandler from '@/components/forms/MultiStep/FormSubmitHandler';
import { useSession } from 'next-auth/react';
import { useFormTooltip } from '@/hooks/useFormTooltip';
import { UserProfileShape } from '@/server/types/user_business';
import {
  profileFieldTooltips,
  profileSchema,
  profileSteps
} from './schema_and_defaults';

// Constants
const MODEL_TYPE = 'UserProfile';
const API_ENDPOINT = '/api/generic-model/user_Profile';
const REDIRECT_PATH = '/dashboard';

interface ProfileFormProps {
  profileData?: UserProfileShape;
  profileId?: string;
}

export default function ProfileForm({
  profileData,
  profileId
}: ProfileFormProps) {
  const { data: session, update } = useSession();
  const isEditMode = !!profileId;

  const { currentTooltip, updateTooltip, resetTooltip } =
    useFormTooltip(profileFieldTooltips);

  const defaultValues = useMemo(() => {
    if (isEditMode && profileData) {
      return profileData;
    } else {
      return {
        name: session?.user?.name || '',
        bio: '',
        website: '',
        social_media_links: {
          facebook: '',
          twitter: '',
          linkedin: ''
        },
        address: '',
        date_of_birth: '',
        home_owner_interests: '',
        profile_image: []
      };
    }
  }, [isEditMode, profileData, session?.user?.name]);

  const handleSave = async (updatedProfile: any) => {
    await update({
      ...session,
      user: {
        ...session?.user,
        profile: updatedProfile
      }
    });
  };

  return (
    <TooltipProvider>
      <div className="mx-auto mt-8 max-w-6xl bg-white px-4">
        <div className="flex">
          <div className="w-2/3 pr-8">
            <h2 className="mb-6 text-center text-2xl font-semibold text-secondary-foreground">
              {isEditMode ? 'Edit Your Profile' : 'Complete Your Profile'}
            </h2>

            <div className="relative">
              <GenericFormSubmitHandler
                isEditMode={isEditMode}
                modelId={profileId}
                modelType={MODEL_TYPE}
                apiEndpoint={API_ENDPOINT}
                redirectPath={REDIRECT_PATH}
                onSave={handleSave}
                initialValues={defaultValues}
              >
                {(handleSubmit) => (
                  <MultiStepForm
                    steps={profileSteps}
                    schema={profileSchema}
                    onSubmit={handleSubmit}
                    updateTooltip={updateTooltip}
                    resetTooltip={resetTooltip}
                    fieldTooltips={profileFieldTooltips}
                    defaultValues={defaultValues}
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
