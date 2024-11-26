// file: @/components/forms/MultiStep/useFormNavigation.ts

import { useState } from 'react';
import {
  UseFormTrigger,
  UseFormGetValues,
  FieldValues,
  Path
} from 'react-hook-form';

interface ProcessedFileInfo {
  id: number;
  original_name: string;
  file_url: string;
  field_name: string;
  contentType?: string;
  file_content?: string;
}

const preprocessFileData = (data: any): any => {
  console.log('Preprocessing file data:', data);
  if (
    data === null ||
    data === undefined ||
    (Array.isArray(data) && data.length === 0)
  ) {
    return null;
  }
  if (Array.isArray(data)) {
    return data.map((item) => preprocessFileData(item));
  }
  if (data instanceof File) {
    return data;
  }
  if (data && typeof data === 'object') {
    if ('file_url' in data && 'original_name' in data) {
      return data as ProcessedFileInfo;
    }
    if ('model_api_name' in data) {
      const parsedModelApi = JSON.parse(data.model_api_name);
      return {
        id: data.id,
        original_name: data.original_name,
        file_url: data.file_url,
        field_name: parsedModelApi.field_name,
        contentType: data.contentType,
        file_content: data.file_content
      } as ProcessedFileInfo;
    }
  }
  return data;
};

export const useFormNavigation = <T extends FieldValues>(
  steps: any[],
  trigger: UseFormTrigger<T>,
  getValues: UseFormGetValues<T>
) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = async () => {
    const currentStepData = steps[currentStep];
    if (!currentStepData) {
      console.error(`Step data not found for step ${currentStep}`);
      return;
    }
    const currentStepFields = currentStepData.groups.flatMap(
      (group: { fields: any }) => group.fields
    );

    const validationResults = await Promise.all(
      currentStepFields.map(async (field: Path<T>) => {
        const rawValue = getValues(field);
        const processedValue = preprocessFileData(rawValue);
        const isValid = await trigger(field, { shouldFocus: true });
        return { field, isValid, rawValue, processedValue };
      })
    );

    const invalidFields = validationResults.filter((result) => !result.isValid);

    if (invalidFields.length === 0) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      console.log(
        'Invalid fields:',
        invalidFields.map((f) => ({
          field: f.field,
          rawValue: f.rawValue,
          processedValue: f.processedValue
        }))
      );
      console.log('Current values:', getValues());
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleStepClick = async (index: number) => {
    if (index < currentStep) {
      setCurrentStep(index);
    } else if (index > currentStep) {
      const stepsToValidate = steps.slice(currentStep, index);
      const fieldsToValidate = stepsToValidate.flatMap((step) =>
        step.groups
          ? step.groups.flatMap((group: { fields: any }) => group.fields)
          : []
      );
      const isValid = await trigger(fieldsToValidate);
      if (isValid) {
        setCurrentStep(index);
      }
    }
  };

  return {
    currentStep,
    handleNext,
    handleBack,
    handleStepClick
  };
};
