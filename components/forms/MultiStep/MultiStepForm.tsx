//file : components/forms/MultiStep/MultiStepForm.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { z } from 'zod';

import { renderField } from './InputFields';
import { useFormNavigation } from './useFormNavigation';
import { getErrorMessage, renderValueWithLink } from './formUtils';
import { TooltipContent } from '../TooltipContext';
import { ProcessedFileInfo } from '@/server/utils/filehandler';
import { FilePreview } from '@/components/FilePreview';

export interface Step {
  id: string;
  title: string;
  groups: FieldGroup[];
}

interface FileInfo {
  id: number;
  field_name: string;
  original_name: string;
  file_url: string;
}

export interface FieldGroup {
  title: string;
  fields: string[];
  layout: 'single' | 'double';
}

interface FileUploadProps {
  file: File | null;
  accept: string;
  label: string;
  onFileSelect: (file: File | null) => void;
  preview?: React.ReactNode;
}

interface MultiStepFormProps {
  steps: Step[];
  schema: z.ZodObject<any>;
  onSubmit: (data: any) => Promise<void>;
  defaultValues?: any;
  updateTooltip: (fieldName: string) => void;
  resetTooltip: () => void;
  multiSelectFields?: Record<string, string[]>;
  fileUploadProps?: Record<string, FileUploadProps>;
  fieldTooltips: Record<string, TooltipContent>;
  onFilesChanged?: (changed: boolean) => void;
  selectFieldsWithCustomOptions?: Record<string, string[]>;
  onAddCustomOption?: (fieldName: string, newOption: string) => void;
  onAddCustomTag?: (fieldName: string, newTag: string) => void;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  steps,
  schema,
  onSubmit,
  defaultValues = {},
  updateTooltip,
  resetTooltip,
  fieldTooltips,
  multiSelectFields = {},
  fileUploadProps = {},
  onFilesChanged,
  selectFieldsWithCustomOptions = {},
  onAddCustomOption,
  onAddCustomTag
}) => {
  const [
    localSelectFieldsWithCustomOptions,
    setLocalSelectFieldsWithCustomOptions
  ] = useState(selectFieldsWithCustomOptions);

  const [fileChangeIndicators, setFileChangeIndicators] = useState<
    Record<string, boolean>
  >({});

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    getValues,
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues
  });

  // Watch for changes in file fields
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name && (name.includes('_document') || name.includes('_image'))) {
        setFileChangeIndicators((prev) => ({
          ...prev,
          [name]: true
        }));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // console.log("Initial localSelectFieldsWithCustomOptions:", localSelectFieldsWithCustomOptions);

  // console.log("Current form values:", getValues());

  const { currentStep, handleNext, handleBack, handleStepClick } =
    useFormNavigation(steps, trigger, getValues);

  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>(
    Object.keys(fileUploadProps).reduce(
      (acc, key) => ({ ...acc, [key]: [] }),
      {}
    )
  );

  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [fileInfos, setFileInfos] = useState<FileInfo[]>([]);
  const [filesWereChanged, setFilesWereChanged] = useState(false);

  useEffect(() => {
    if (currentStep === steps.length - 1) {
      updateTooltip('confirm');
    } else {
      resetTooltip();
    }
  }, [currentStep, steps.length, updateTooltip, resetTooltip]);

  useEffect(() => {
    if (
      defaultValues.file_info &&
      Array.isArray(defaultValues.file_info) &&
      defaultValues.file_info[0]
    ) {
      setFileInfos(defaultValues.file_info);
    }
  }, [defaultValues]);

  useEffect(() => {
    if (onFilesChanged) {
      onFilesChanged(filesWereChanged);
    }
  }, [filesWereChanged, onFilesChanged]);

  const handleFocus = (fieldName: string) => {
    const tooltip = fieldTooltips[fieldName];
    if (tooltip) {
      updateTooltip(fieldName);
    }
  };

  const handleFileUpload = (fieldName: string, files: File[]) => {
    setUploadedFiles((prev) => ({ ...prev, [fieldName]: files }));
    setValue(fieldName, files, { shouldValidate: true });
  };

  const handleAddCustomOption = (fieldName: string, newOption: string) => {
    // console.log(`Adding custom option for ${fieldName}:`, newOption);
    setLocalSelectFieldsWithCustomOptions((prev) => {
      const updatedOptions = {
        ...prev,
        [fieldName]: [...(prev[fieldName] || []), newOption]
      };
      // console.log(`Updated localSelectFieldsWithCustomOptions:`, updatedOptions);
      return updatedOptions;
    });
    setValue(fieldName, newOption, { shouldValidate: true });
    onAddCustomOption?.(fieldName, newOption);
  };

  const formatValue = (value: any, field: z.ZodTypeAny): string => {
    if (value === null || value === undefined) {
      return '';
    }

    if (field.description === 'dollar') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    } else if (field.description === 'percentage') {
      return `${(value * 100).toFixed(2)}%`;
    } else if (field.description === 'date') {
      const parseDate = (dateString: string): Date | null => {
        if (!dateString) return null;
        if (dateString.includes('T')) {
          const date = new Date(dateString);
          return isNaN(date.getTime()) ? null : date;
        }
        const [day, month, year] = dateString.split('-');
        if (!day || !month || !year) return null;
        const monthIndex = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ].indexOf(month);
        if (monthIndex === -1) return null;
        const date = new Date(Number(year), monthIndex, Number(day));
        return isNaN(date.getTime()) ? null : date;
      };

      const date = parseDate(value);
      if (date) {
        return date
          .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
          .replace(/ /g, '-');
      } else {
        return 'Invalid Date';
      }
    }
    return String(value);
  };

  const renderFormField = (fieldName: string) => {
    const fieldSchema = schema.shape[fieldName];
    const tooltip = fieldTooltips[fieldName];
    const label = tooltip?.label || fieldName;

    return (
      <Controller
        key={fieldName}
        name={fieldName}
        control={control}
        render={({ field }) =>
          renderField(fieldName, fieldSchema, {
            label,
            name: fieldName,
            value: field.value,
            onChange: field.onChange,
            error: getErrorMessage(errors, fieldName),
            onFocus: () => handleFocus(fieldName),
            onBlur: resetTooltip,
            options:
              localSelectFieldsWithCustomOptions[fieldName] ||
              multiSelectFields[fieldName],
            multiple: fieldSchema instanceof z.ZodArray,
            onAddCustomOption: (newOption) =>
              handleAddCustomOption(fieldName, newOption),
            onAddCustomTag: (newTag) => onAddCustomTag?.(fieldName, newTag)
          })
        }
      />
    );
  };

  const renderFieldGroup = (group: FieldGroup, groupIndex: number) => {
    if (group.layout === 'single') {
      return (
        <div key={`group-${groupIndex}`} className="space-y-4">
          {group.fields.map(renderFormField)}
        </div>
      );
    } else {
      const midpoint = Math.ceil(group.fields.length / 2);
      const leftColumnFields = group.fields.slice(0, midpoint);
      const rightColumnFields = group.fields.slice(midpoint);

      return (
        <div key={`group-${groupIndex}`} className="flex">
          <div className="w-[45%] space-y-4 pr-4">
            {leftColumnFields.map(renderFormField)}
          </div>
          <div className="ml-auto w-[45%] space-y-4">
            {rightColumnFields.map(renderFormField)}
          </div>
        </div>
      );
    }
  };

  const renderConfirmationStep = () => {
    const currentFormData = getValues();

    const isImage = (
      file: File | ProcessedFileInfo | { id: number; deleted: true } | null
    ): boolean => {
      if (file instanceof File) {
        return file.type.startsWith('image/');
      } else if (file && 'file_url' in file) {
        return file.file_url.match(/\.(jpeg|jpg|gif|png)$/) !== null;
      }
      return false;
    };

    const renderFileValue = (value: any, isSingleFile: boolean) => {
      if (isSingleFile) {
        if (!value) {
          return <span className="text-gray-500">No file uploaded</span>;
        }
        if ('deleted' in value) {
          return <span className="text-gray-500">File removed</span>;
        }
        return (
          <div className="flex items-center">
            {isImage(value) ? (
              <div className="max-w-xs">
                {value instanceof File ? (
                  <img
                    src={URL.createObjectURL(value)}
                    alt={value.name}
                    className="h-20 w-auto object-contain"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(value.file_content)}
                    alt={value.original_name}
                    className="h-20 w-auto object-contain"
                  />
                )}
              </div>
            ) : null}
            <span className="ml-2">
              {value instanceof File ? value.name : value.original_name}
            </span>
          </div>
        );
      } else if (Array.isArray(value)) {
        if (!value.length) {
          return <span className="text-gray-500">No files uploaded</span>;
        }
        return (
          <ul className="space-y-2">
            {value
              .filter((file) => !('deleted' in file))
              .map((file, index) => (
                <li key={index} className="flex items-center">
                  <FilePreview
                    file={file instanceof File ? file : file.file_content}
                    contentType={
                      file instanceof File ? file.type : file.contentType
                    }
                  />
                  <span className="ml-2">
                    {file instanceof File ? file.name : file.original_name}
                  </span>
                </li>
              ))}
          </ul>
        );
      }
      return null;
    };

    return (
      <Card>
        <CardContent>
          <h3 className="mb-4 text-lg font-semibold">
            Confirm Your Information
          </h3>
          <div className="space-y-4">
            {Object.entries(schema.shape).map(([key, field]) => {
              const tooltip = fieldTooltips[key];
              const label = tooltip ? tooltip.label : key;
              const value = currentFormData[key];
              const typedField = field as z.ZodTypeAny;

              // Handle special field types
              if (key === 'social_media_links' && typeof value === 'object') {
                return (
                  <div key={key}>
                    <strong>
                      {fieldTooltips[key]?.label || 'Social Links'}:
                    </strong>
                    <ul className="list-disc pl-5">
                      {Object.entries(value).map(([platform, link]) => {
                        const platformLabel =
                          fieldTooltips[`social_media_links.${platform}`]
                            ?.label || platform;
                        return (
                          <li key={platform}>
                            {platformLabel}:{' '}
                            {link ? (
                              <a
                                href={link as string}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {link as string}
                              </a>
                            ) : (
                              <span className="text-gray-500">
                                Not provided
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              }

              // Handle links array
              if (key === 'links' && Array.isArray(value)) {
                return (
                  <div key={key}>
                    <strong>{label}:</strong>
                    <ul className="list-disc pl-5">
                      {value.map((link, index) => (
                        <li key={index}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {link.description}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              // Handle file fields
              if (
                typedField._def.description === 'single-file' ||
                typedField._def.description === 'multi-file'
              ) {
                return (
                  <div key={key}>
                    <strong>{label}:</strong>
                    {renderFileValue(
                      value,
                      typedField._def.description === 'single-file'
                    )}
                  </div>
                );
              }

              // Handle arrays (not files)
              console.log(' value: ', value);
              if (
                Array.isArray(value) &&
                !value.some((item) => item instanceof File)
              ) {
                return (
                  <div key={key}>
                    <strong>{label}:</strong>
                    <ul className="list-disc pl-5">
                      {value.map((item, index) => (
                        <li key={index}>{String(item)}</li>
                      ))}
                    </ul>
                  </div>
                );
              }

              // Handle all other fields
              const formattedValue = formatValue(value, typedField);
              return (
                <p key={key}>
                  <strong>{label}:</strong>{' '}
                  {value !== undefined && value !== null ? (
                    renderValueWithLink(formattedValue)
                  ) : (
                    <span className="text-gray-500">Not provided</span>
                  )}
                </p>
              );
            })}
          </div>

          <div className="mt-6">
            <div className="mt-6 flex items-center space-x-[10%]">
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="w-[10%]"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="w-[80%]"
                disabled={!isValid || isLoading}
              >
                {isLoading ? 'Saving...' : 'Confirm and Save Changes'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStep = () => {
    const currentStepData = steps[currentStep];

    if (currentStep === steps.length - 1) {
      return renderConfirmationStep();
    }

    if (!currentStepData) {
      console.error(`Step data not found for step ${currentStep}`);
      return null;
    }

    return (
      <div className="space-y-8">
        {currentStepData.groups.map((group, index) =>
          renderFieldGroup(group, index)
        )}
      </div>
    );
  };

  const handleFormSubmit = async (data: any) => {
    setServerError(null);
    setIsLoading(true);
    try {
      // Add file change indicators to the submitted data
      const dataWithFileChanges = {
        ...data,
        ...Object.entries(fileChangeIndicators).reduce(
          (acc, [key, value]) => {
            acc[`${key}_file_change_indicator`] = value ? 'yes' : 'no';
            return acc;
          },
          {} as Record<string, string>
        )
      };

      await onSubmit(data);
      // Handle successful submission
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setServerError(
        error.toString() ||
          'An unexpected error occurred. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex cursor-pointer flex-col items-center"
            onClick={() => handleStepClick(index)}
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                index === currentStep
                  ? 'bg-blue-600 text-white'
                  : index < currentStep
                  ? 'bg-blue-300 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
            <span className="mt-1 text-center text-xs">{step.title}</span>
          </div>
        ))}
      </div>

      <Progress
        value={(currentStep / (steps.length - 1)) * 100}
        className="mb-6"
      />

      {serverError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="mb-4 space-y-6"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {currentStep < steps.length - 1 && (
          <div className="mt-8 flex justify-between">
            {currentStep > 0 && (
              <Button type="button" onClick={handleBack} variant="outline">
                Back
              </Button>
            )}
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
