// File: app/onboarding/business/BusinessForm.tsx

// File: app/onboarding/business/BusinessForm.tsx

'use client';

import React, { useMemo } from 'react';
import { MultiStepForm } from '@/components/forms/MultiStep/MultiStepForm';
import { TooltipProvider } from '@/components/forms/TooltipContext';
import { Tooltip } from '@/components/forms/ToolTip';
import GenericFormSubmitHandler from '@/components/forms/MultiStep/FormSubmitHandler';
import { useSession } from 'next-auth/react';
// import { useCustomRouter } from '@/hooks/useCustomRouter';
import { useFormTooltip } from '@/hooks/useFormTooltip';
// import { BUSINESS_INITIAL_SPECIALIZATIONS, BUSINESS_INITIAL_TRADE_TYPES } from '@/constants/values';
import { BusinessShape } from '@/server/types/user_business';
import { ProcessedFileInfo } from '@/server/utils/filehandler';
import {
  fieldTooltips,
  steps,
  businessSchema,
  defaultValues
} from './schema_and_defaults';

interface BusinessFormProps {
  businessData?: BusinessShape;
  businessId?: string;
  specializations: string[];
  tradeTypes: string[];
  processedLicenseDocument?: ProcessedFileInfo;
  processedInsuranceDocument?: ProcessedFileInfo;
}

// Constants
const MODEL_TYPE = 'Business';
const API_ENDPOINT = '/api/generic-model/business';
const REDIRECT_PATH = '/dashboard';

export default function BusinessForm({
  businessData,
  businessId,
  specializations,
  tradeTypes
}: BusinessFormProps) {
  const { data: session, update } = useSession();
  // const router = useCustomRouter();
  const isEditMode = !!businessId;

  const { currentTooltip, updateTooltip, resetTooltip } =
    useFormTooltip(fieldTooltips);

  const multiSelectFields = {
    specializations: specializations,
    trade_types: tradeTypes
  };

  // console.log('businessData', businessData);
  // console.log(' isEditMode', isEditMode);

  const initialValues = useMemo(() => {
    if (isEditMode && businessData) {
      return {
        type: businessData.type || 'GC',
        name: businessData.name || '',
        structure: businessData.structure || 'LLC',
        years_in_business: businessData.years_in_business?.toString() || '0',
        description: businessData.description || '',
        website: businessData.website || '',
        address: businessData.address || '',
        email: businessData.email || '',
        phone: businessData.phone || '',
        specializations: businessData.specializations || [],
        trade_types: businessData.trade_types || [],
        license_info: businessData.license_info || '',
        insurance_info: businessData.insurance_info || '',
        workers_comp_info: businessData.workers_comp_info || '',
        tax_id: businessData.tax_id || '',
        license_document: businessData.license_document || null,
        insurance_document: businessData.insurance_document || null
      };
    } else {
      return {
        ...defaultValues
      };
    }
  }, [isEditMode, businessData]);

  const handleSave = async (updatedBusiness: any) => {
    // console.log('Saving business data:', updatedBusiness);
    // Implement the logic to update the session or perform any necessary actions
    await update({
      ...session,
      user: { ...session?.user, business: updatedBusiness }
    });
  };

  return (
    <TooltipProvider>
      <div className="mx-auto mt-8 max-w-6xl bg-white px-4">
        <div className="flex">
          <div className="w-2/3 pr-8">
            <h2 className="mb-6 text-center text-2xl font-semibold text-secondary-foreground">
              {isEditMode
                ? 'Edit Your Business Profile'
                : 'Complete Your Business Profile'}
            </h2>

            <div className="relative">
              <GenericFormSubmitHandler
                isEditMode={isEditMode}
                modelId={businessId}
                modelType={MODEL_TYPE}
                apiEndpoint={API_ENDPOINT}
                redirectPath={REDIRECT_PATH}
                onSave={handleSave}
                initialValues={initialValues}
              >
                {(handleSubmit) => (
                  <MultiStepForm
                    steps={steps}
                    schema={businessSchema}
                    onSubmit={handleSubmit}
                    updateTooltip={updateTooltip}
                    resetTooltip={resetTooltip}
                    fieldTooltips={fieldTooltips}
                    defaultValues={initialValues}
                    multiSelectFields={multiSelectFields}
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
