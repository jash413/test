// file components\forms\MultiStepForm.tsx

import React, { useState, useEffect } from 'react';
import { useForm, Controller, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { TooltipContent } from './TooltipContext';
import { FilePreview } from '../FilePreview';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  onAddCustom: (value: string) => void;
}

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
  schema: any;
  onSubmit: (data: any) => Promise<void>;
  defaultValues?: any;
  updateTooltip: (fieldName: string) => void;
  resetTooltip: () => void;
  renderCustomField?: (
    fieldName: string,
    control: any,
    errors: any
  ) => React.ReactNode;
  multiSelectFields?: Record<string, string[]>;
  fileUploadProps?: Record<string, FileUploadProps>;
  fieldTooltips: Record<string, TooltipContent>;
  onFilesChanged?: (changed: boolean) => void;
  selectFieldsWithCustomOptions?: Record<string, string[]>;
}

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  onAddCustom
}) => {
  const [customOption, setCustomOption] = useState('');

  const handleToggle = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter((v) => v !== option)
      : [...value, option];
    onChange(newValue);
  };

  const handleAddCustom = () => {
    if (customOption && !options.includes(customOption)) {
      onAddCustom(customOption);
      onChange([...value, customOption]);
      setCustomOption('');
    }
  };

  // Split options into two columns
  const midpoint = Math.ceil(options.length / 2);
  const leftColumnOptions = options.slice(0, midpoint);
  const rightColumnOptions = options.slice(midpoint);

  return (
    <div className="space-y-2">
      <div className="flex space-x-4">
        <div className="w-1/2 space-y-2">
          {leftColumnOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={value.includes(option)}
                onCheckedChange={() => handleToggle(option)}
              />
              <label
                htmlFor={option}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
        <div className="w-1/2 space-y-2">
          {rightColumnOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={value.includes(option)}
                onCheckedChange={() => handleToggle(option)}
              />
              <label
                htmlFor={option}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center space-x-2">
        <Input
          type="text"
          value={customOption}
          onChange={(e) => setCustomOption(e.target.value)}
          placeholder="Add custom option"
        />
        <Button onClick={handleAddCustom} type="button">
          Add
        </Button>
      </div>
    </div>
  );
};

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  steps,
  schema,
  onSubmit,
  defaultValues = {},
  updateTooltip,
  resetTooltip,
  renderCustomField,
  fileUploadProps,
  fieldTooltips,
  multiSelectFields = {},
  onFilesChanged,
  selectFieldsWithCustomOptions = {}
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<
    Record<string, File | null>
  >(
    Object.keys(fileUploadProps || {}).reduce(
      (acc, key) => ({ ...acc, [key]: null }),
      {}
    )
  );
  const [customOptions, setCustomOptions] = useState<Record<string, string[]>>(
    {}
  );

  const [editingLink, setEditingLink] = useState<number | null>(null);

  const [fileInfos, setFileInfos] = useState<FileInfo[]>([]);

  const [filesWereChanged, setFilesWereChanged] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    getValues,
    setValue
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues
  });

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
      setFileInfos(defaultValues.file_info); // Access the inner array
    }
  }, [defaultValues]);

  useEffect(() => {
    if (onFilesChanged) {
      onFilesChanged(filesWereChanged);
    }
  }, [filesWereChanged, onFilesChanged]);

  const [serverError] = useState<string | null>(null);
  const [isLoading] = useState(false);

  const handleFocus = (fieldName: string) => {
    const tooltip = fieldTooltips[fieldName];
    if (tooltip) {
      updateTooltip(fieldName);
    }
  };

  const handleNext = async () => {
    console.log(' currentStep:', currentStep);
    const currentStepFields = steps[currentStep].groups.flatMap(
      (group) => group.fields
    );
    const isStepValid = await trigger(currentStepFields);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // const handleFormSubmit = async (data: any) => {
  //   setServerError(null);
  //   setIsLoading(true);
  //   try {
  //     // Convert File objects to their names for display in the confirmation step
  //     const displayData = { ...data };
  //     Object.keys(fileUploadProps || {}).forEach(key => {
  //       if (displayData[key] instanceof File) {
  //         displayData[key] = displayData[key].name;
  //       }
  //     });

  //     await onSubmit(data);
  //     // Handle successful submission
  //   } catch (error : any) {
  //     console.error('Error submitting form:', error);
  //     setServerError(error.toString() || 'An unexpected error occurred. Please try again later.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleStepClick = async (index: number) => {
    if (index < currentStep) {
      setCurrentStep(index);
    } else if (index > currentStep) {
      const stepsToValidate = steps.slice(currentStep, index);
      const fieldsToValidate = stepsToValidate.flatMap((step) =>
        step.groups.flatMap((group) => group.fields)
      );
      const isValid = await trigger(fieldsToValidate);
      if (isValid) {
        setCurrentStep(index);
      }
    }
  };

  // const handleUploadClick = () => {
  //   fileInputRef.current?.click();
  // };

  const handleFileUpload = (fieldName: string, file: File | null) => {
    setUploadedFiles((prev) => ({ ...prev, [fieldName]: file }));
    setValue(fieldName, file, { shouldValidate: true });
    setFilesWereChanged(true);
  };

  const handleFileDelete = (fieldName: string, fileId: number) => {
    if (fileId === -1) {
      setUploadedFiles((prev) => ({ ...prev, [fieldName]: null }));
      setValue(fieldName, null, { shouldValidate: true });
    } else {
      setFileInfos((prev) => prev.filter((info) => info.id !== fileId));
    }
    setFilesWereChanged(true);
  };

  const isEnumField = (fieldName: string) => {
    const fieldSchema = schema.shape[fieldName];
    return fieldSchema?._def?.typeName === 'ZodEnum';
  };

  const getEnumValues = (fieldName: string) => {
    const fieldSchema = schema.shape[fieldName];
    return fieldSchema?._def?.values || [];
  };

  const renderFileInfo = (fieldName: string) => {
    console.log(fileInfos);
    const relevantFiles = fileInfos.filter(
      (file) => file.field_name === fieldName
    );

    if (relevantFiles.length > 0) {
      return (
        <div className="mt-2">
          <span className="text-sm">Current file(s): </span>
          {relevantFiles.map((fileInfo) => (
            <div key={fileInfo.id} className="mt-1 flex items-center space-x-2">
              <a
                href={`/api/download/${fileInfo.file_url}`}
                download={fileInfo.original_name}
                className="text-sm text-blue-600 hover:underline"
              >
                {fileInfo.original_name}
              </a>
              <button
                onClick={() => handleFileDelete(fieldName, fileInfo.id)}
                className="text-red-600 hover:underline"
                type="button"
              >
                <DeleteIcon />
              </button>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // const renderFileUpload = (fieldName: string) => {
  //   const props = fileUploadProps ? fileUploadProps[fieldName] : undefined;
  //   if (!props) return null;

  //   return (
  //     <Controller
  //       key={fieldName}
  //       name={fieldName}
  //       control={control}
  //       render={({ field }) => (
  //         <div className="mb-4">
  //           <Label
  //             htmlFor={fieldName}
  //             className="block text-sm font-medium text-gray-700"
  //           >
  //             {props.label}
  //           </Label>
  //           <div className="mt-2 flex items-center space-x-4">
  //             <input
  //               type="file"
  //               id={fieldName}
  //               accept={props.accept}
  //               onChange={(e) => {
  //                 const file = e.target.files ? e.target.files[0] : null;
  //                 handleFileUpload(fieldName, file);
  //                 field.onChange(file);
  //               }}
  //               className="hidden"
  //             />
  //             <Button
  //               type="button"
  //               variant="outline"
  //               onClick={() => document.getElementById(fieldName)?.click()}
  //             >
  //               {uploadedFiles[fieldName] ? 'Change File' : 'Upload File'}
  //             </Button>
  //             {uploadedFiles[fieldName] && (
  //               <FilePreview
  //                 file={uploadedFiles[fieldName]!}
  //                 onDelete={() => {
  //                   handleFileUpload(fieldName, null);
  //                   field.onChange(null);
  //                 }}
  //               />
  //             )}
  //           </div>
  //           {errors[fieldName] && (
  //             <p className="mt-1 text-sm text-red-500">
  //               {getErrorMessage(errors, fieldName)}
  //             </p>
  //           )}
  //         </div>
  //       )}
  //     />
  //   );
  // };

  const renderField = (fieldName: string) => {
    const tooltip = fieldTooltips[fieldName];
    const label = tooltip ? tooltip.label : fieldName;

    if (renderCustomField) {
      const customField = renderCustomField(fieldName, control, errors);
      if (customField) return customField;
    }

    if (fileUploadProps && fileUploadProps[fieldName]) {
      return (
        <Controller
          key={fieldName}
          name={fieldName}
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <Label
                htmlFor={fieldName}
                className="block text-sm font-medium text-gray-700"
              >
                {label}
              </Label>
              {renderFileInfo(fieldName)}
              <div className="mt-2 flex items-center space-x-4">
                <input
                  type="file"
                  id={fieldName}
                  accept={fileUploadProps[fieldName].accept}
                  onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    handleFileUpload(fieldName, file);
                    field.onChange(file);
                  }}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById(fieldName)?.click()}
                >
                  {uploadedFiles[fieldName] ? 'Change File' : 'Upload New File'}
                </Button>
                {uploadedFiles[fieldName] && (
                  <FilePreview
                    file={uploadedFiles[fieldName]!}
                    onDelete={() => {
                      handleFileUpload(fieldName, null);
                      field.onChange(null);
                    }}
                  />
                )}
              </div>
              {errors[fieldName] && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors, fieldName)}
                </p>
              )}
            </div>
          )}
        />
      );
    }

    if (multiSelectFields[fieldName]) {
      return (
        <Controller
          key={fieldName}
          name={fieldName}
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <div className="mb-4">
              <Label
                htmlFor={fieldName}
                className="block text-sm font-medium text-gray-700"
              >
                {label}
              </Label>
              <MultiSelect
                options={[
                  ...multiSelectFields[fieldName],
                  ...(customOptions[fieldName] || [])
                ]}
                value={field.value}
                onChange={field.onChange}
                onAddCustom={(newOption) => {
                  setCustomOptions((prev) => ({
                    ...prev,
                    [fieldName]: [...(prev[fieldName] || []), newOption]
                  }));
                }}
              />
              {errors[fieldName] && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors, fieldName)}
                </p>
              )}
            </div>
          )}
        />
      );
    }

    if (isEnumField(fieldName)) {
      const enumValues = getEnumValues(fieldName);
      return (
        <Controller
          key={fieldName}
          name={fieldName}
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <Label
                htmlFor={fieldName}
                className="block text-sm font-medium text-gray-700"
              >
                {label}
              </Label>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                onOpenChange={(open) => {
                  if (open) handleFocus(fieldName);
                  else resetTooltip();
                }}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder={`Select ${label}`} />
                </SelectTrigger>
                <SelectContent>
                  {enumValues.map((value: string) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors[fieldName] && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors, fieldName)}
                </p>
              )}
            </div>
          )}
        />
      );
    }

    if (
      selectFieldsWithCustomOptions &&
      selectFieldsWithCustomOptions[fieldName]
    ) {
      return (
        <Controller
          key={fieldName}
          name={fieldName}
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <Label
                htmlFor={fieldName}
                className="block text-sm font-medium text-gray-700"
              >
                {label}
              </Label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder={`Select ${label}`} />
                </SelectTrigger>
                <SelectContent>
                  {selectFieldsWithCustomOptions[fieldName].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="mt-2"
                placeholder={`Add new ${fieldName}`}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const newOption = (e.target as HTMLInputElement).value;
                    if (
                      newOption &&
                      !selectFieldsWithCustomOptions[fieldName].includes(
                        newOption
                      )
                    ) {
                      selectFieldsWithCustomOptions[fieldName].push(newOption);
                      field.onChange(newOption);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
              />
            </div>
          )}
        />
      );
    }

    // Check if the field is a boolean type
    if (schema.shape[fieldName] instanceof z.ZodBoolean) {
      return (
        <Controller
          key={fieldName}
          name={fieldName}
          control={control}
          render={({ field }) => (
            <div className="mb-4 flex items-center justify-between">
              <Label
                htmlFor={fieldName}
                className="text-sm font-medium text-gray-700"
              >
                {label}
              </Label>
              <Switch
                id={fieldName}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />
      );
    }

    if (fieldName === 'tags') {
      return (
        <Controller
          key={fieldName}
          name={fieldName}
          control={control}
          render={({ field }) => (
            <div className="mb-4">
              <Label
                htmlFor={fieldName}
                className="block text-sm font-medium text-gray-700"
              >
                {label}
              </Label>
              <div className="mt-1 flex flex-wrap gap-2">
                {field.value.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        const newTags = field.value.filter(
                          (_: string, i: number) => i !== index
                        );
                        field.onChange(newTags);
                      }}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <Select
                onValueChange={(value) => {
                  if (!field.value.includes(value)) {
                    field.onChange([...field.value, value]);
                  }
                }}
              >
                <SelectTrigger className="mt-2 w-full">
                  <SelectValue placeholder="Add a tag" />
                </SelectTrigger>
                <SelectContent>
                  {multiSelectFields['tags'].map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="mt-2"
                placeholder="Add a custom tag"
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const newTag = (e.target as HTMLInputElement).value.trim();
                    if (newTag && !field.value.includes(newTag)) {
                      field.onChange([...field.value, newTag]);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
              />
              {errors[fieldName] && (
                <p className="mt-1 text-sm text-red-500">
                  {getErrorMessage(errors, fieldName)}
                </p>
              )}
            </div>
          )}
        />
      );
    }

    if (fieldName === 'links') {
      return (
        <Controller
          key={fieldName}
          name={fieldName}
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <div className="mb-4">
              <Label
                htmlFor={fieldName}
                className="block text-sm font-medium text-gray-700"
              >
                {label}
              </Label>
              <div className="mt-2 space-y-2">
                {field.value.map((link: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    {editingLink === index ? (
                      <>
                        <Input
                          value={link.url}
                          onChange={(e) => {
                            const newLinks = [...field.value];
                            newLinks[index].url = e.target.value;
                            field.onChange(newLinks);
                          }}
                          placeholder="URL"
                          className="flex-grow"
                        />
                        <Input
                          value={link.description}
                          onChange={(e) => {
                            const newLinks = [...field.value];
                            newLinks[index].description = e.target.value;
                            field.onChange(newLinks);
                          }}
                          placeholder="Description"
                          className="flex-grow"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEditingLink(null)}
                        >
                          Save
                        </Button>
                      </>
                    ) : (
                      <>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-grow text-blue-600 hover:underline"
                        >
                          {link.description}
                        </a>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEditingLink(index)}
                        >
                          Edit
                        </Button>
                      </>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newLinks = field.value.filter(
                          (_: any, i: number) => i !== index
                        );
                        field.onChange(newLinks);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  field.onChange([
                    ...field.value,
                    { url: '', description: '' }
                  ]);
                  setEditingLink(field.value.length);
                }}
                className="mt-2"
              >
                Add Link
              </Button>
            </div>
          )}
        />
      );
    }

    return (
      <Controller
        key={fieldName}
        name={fieldName}
        control={control}
        render={({ field }) => (
          <div className="mb-4">
            <Label
              htmlFor={fieldName}
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {label}
            </Label>
            {fieldName.includes('bio') || fieldName.includes('description') ? (
              <Textarea
                {...field}
                id={fieldName}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onFocus={() => handleFocus(fieldName)}
                onBlur={resetTooltip}
              />
            ) : (
              <Input
                {...field}
                id={fieldName}
                type={fieldName.includes('date') ? 'date' : 'text'}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onFocus={() => handleFocus(fieldName)}
                onBlur={resetTooltip}
              />
            )}
            {errors[fieldName] && (
              <p className="mt-1 text-sm text-red-500">
                {getErrorMessage(errors, fieldName)}
              </p>
            )}
          </div>
        )}
      />
    );
  };

  const renderFieldGroup = (group: FieldGroup) => {
    let groupIndex = 0;
    if (group.layout === 'single') {
      return (
        <div key={`group-${groupIndex}`} className="space-y-4">
          {group.fields.map(renderField)}
        </div>
      );
    } else {
      const midpoint = Math.ceil(group.fields.length / 2);
      const leftColumnFields = group.fields.slice(0, midpoint);
      const rightColumnFields = group.fields.slice(midpoint);

      return (
        <div key={`group-${groupIndex}`} className="flex">
          <div className="w-[45%] space-y-4 pr-4">
            {leftColumnFields.map(renderField)}
          </div>
          <div className="ml-auto w-[45%] space-y-4">
            {rightColumnFields.map(renderField)}
          </div>
        </div>
      );
    }
  };

  const renderValueWithLink = (value: string) => {
    const urlRegex = /^(https?:\/\/[^\s]+)$/;
    if (urlRegex.test(value)) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {value}
        </a>
      );
    }
    return String(value);
  };

  const renderStep = () => {
    const currentStepData = steps[currentStep];

    if (currentStep === steps.length - 1) {
      // Render confirmation step
      const currentFormData = getValues();

      return (
        <Card>
          <CardContent>
            <h3 className="mb-4 text-lg font-semibold">
              Confirm Your Information
            </h3>
            <div className="space-y-4">
              {Object.keys(schema.shape).map((key) => {
                const tooltip = fieldTooltips[key];
                const label = tooltip ? tooltip.label : key;
                let value = currentFormData[key];

                if (fileUploadProps && fileUploadProps[key]) {
                  const file = uploadedFiles[key];
                  const existingFileInfo = fileInfos.find(
                    (info) => info.field_name === key
                  );
                  return (
                    <div key={key}>
                      <span className="font-medium">{label}:</span>
                      {file && (
                        <FilePreview
                          file={file}
                          onDelete={() => handleFileDelete(key, -1)}
                        />
                      )}
                      {!file && existingFileInfo && (
                        <div className="mt-2">
                          <a
                            href={existingFileInfo.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-600 hover:underline"
                          >
                            {existingFileInfo.original_name}
                          </a>
                        </div>
                      )}
                      {!file && !existingFileInfo && (
                        <span className="ml-2 text-gray-500">
                          No file uploaded
                        </span>
                      )}
                    </div>
                  );
                }

                if (
                  typeof value === 'object' &&
                  value !== null &&
                  !Array.isArray(value)
                ) {
                  return (
                    <div key={key}>
                      <strong>{label}:</strong>
                      <ul className="ml-4 list-inside list-disc">
                        {Object.entries(value).map(([subKey, subValue]) => {
                          if (subValue !== null && subValue !== undefined) {
                            return (
                              <li key={subKey}>
                                {subKey}:{' '}
                                {renderValueWithLink(String(subValue))}
                              </li>
                            );
                          }
                          return null;
                        })}
                      </ul>
                    </div>
                  );
                }

                if (Array.isArray(value)) {
                  return (
                    <div key={key}>
                      <strong>{label}:</strong>
                      <ul className="ml-4 list-inside list-disc">
                        {value.map((item, index) => {
                          if (item !== null && item !== undefined) {
                            return (
                              <li key={index}>
                                {renderValueWithLink(String(item))}
                              </li>
                            );
                          }
                          return null;
                        })}
                      </ul>
                    </div>
                  );
                }

                return (
                  <p key={key}>
                    <strong>{label}:</strong>{' '}
                    {value !== undefined && value !== null
                      ? renderValueWithLink(String(value))
                      : ''}
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
    }

    return (
      <div className="space-y-8">
        {currentStepData.groups.map((group, index) => (
          <div key={index}>{renderFieldGroup(group)}</div>
        ))}
      </div>
    );
  };

  const getErrorMessage = (
    errors: FieldErrors,
    fieldName: string
  ): string | undefined => {
    const error = errors[fieldName];
    if (error) {
      if (typeof error === 'string') {
        return error;
      }
      if ('message' in error) {
        return error.message as string;
      }
    }
    // Handle nested fields (e.g., social_media_links.facebook)
    const fieldParts = fieldName.split('.');
    if (fieldParts.length > 1) {
      let nestedError: any = errors;
      for (const part of fieldParts) {
        if (
          nestedError &&
          typeof nestedError === 'object' &&
          part in nestedError
        ) {
          nestedError = nestedError[part];
        } else {
          nestedError = undefined;
          break;
        }
      }
      if (
        nestedError &&
        typeof nestedError === 'object' &&
        'message' in nestedError
      ) {
        return nestedError.message as string;
      }
    }
    return undefined;
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

      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 space-y-6">
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
