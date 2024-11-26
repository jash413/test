// file: components/forms/MultiStep/FormSubmitHandler.tsx

import React, { useState } from 'react';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLoadingAPI } from '@/app/hooks/useLoadingAPI';

interface GenericFormSubmitHandlerProps {
  isEditMode: boolean;
  modelId?: string;
  modelType: string;
  projectId?: string;
  apiEndpoint: string;
  redirectPath: string;
  onSave?: (updatedModel: any) => void;
  initialValues?: Record<string, any>;
  children: (handleSubmit: (data: any) => Promise<void>) => React.ReactNode;
}

const GenericFormSubmitHandler: React.FC<GenericFormSubmitHandlerProps> = ({
  isEditMode,
  modelId,
  modelType,
  projectId,
  apiEndpoint,
  redirectPath,
  onSave,
  initialValues = {},
  children
}) => {
  const router = useCustomRouter();
  const { fetchWithLoading } = useLoadingAPI();
  const [error, setError] = useState<string | null>(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  // FormSubmitHandler.tsx
  const handleSubmit = async (data: any) => {
    const formData = new FormData();
    const fileChangeIndicators: Record<string, string> = {};

    const processFile = (
      key: string,
      value: any,
      isArrayField: boolean = false
    ) => {
      // console.log(' initialValues', initialValues);
      const initialValue = initialValues[key];

      if (Array.isArray(value)) {
        formData.append(`${key}_multiple_files`, 'yes');
        let originalValues: any[] = initialValue || [];
        const existingFilesWithoutContent = originalValues.map(
          ({ file_content, contentType, ...rest }) => rest
        );
        formData.append(
          `${key}_original`,
          JSON.stringify(existingFilesWithoutContent)
        );

        // Separate files into categories
        const newFiles = value.filter((file) => file instanceof File);
        const existingFiles = value.filter(
          (file) =>
            file &&
            typeof file === 'object' &&
            'id' in file &&
            !('deleted' in file)
        );
        const deletedFiles = value.filter(
          (file) =>
            file &&
            typeof file === 'object' &&
            'id' in file &&
            'deleted' in file
        );

        // For new files, create a properly structured array in FormData
        if (newFiles.length > 0) {
          // First, append the array length so backend knows how many files to expect
          formData.append(`${key}_count`, newFiles.length.toString());

          // Then append each file with an index
          newFiles.forEach((file, index) => {
            formData.append(`${key}[${index}]`, file);
          });
        }

        // Add existing file IDs as a single JSON array
        if (existingFiles.length > 0) {
          const existingFilesWithoutContent = existingFiles.map(
            ({ file_content, contentType, ...rest }) => rest
          );
          formData.append(
            `${key}_existing_file_info`,
            JSON.stringify(existingFilesWithoutContent)
          );
        }

        // Add deleted file IDs as a single JSON array
        if (deletedFiles.length > 0) {
          const deletedFileIds = deletedFiles.map((file) => file.id);
          formData.append(`${key}_deleted_ids`, JSON.stringify(deletedFileIds));
        }

        // Set change indicator if there are any changes
        fileChangeIndicators[`${key}_file_change_indicator`] =
          newFiles.length > 0 || deletedFiles.length > 0 ? 'yes' : 'no';

        // Add existing files info if needed
        if (initialValue) {
          formData.append(`${key}_existing`, JSON.stringify(initialValue));
        }

        // Debug log
        // console.log(`Processing ${newFiles.length} new files for ${key}`);
        // console.log('New files:', newFiles);
      } else {
        // Handle single file
        formData.append(`${key}_multiple_files`, 'no');
        if (value instanceof File) {
          formData.append(key, value);
          fileChangeIndicators[`${key}_file_change_indicator`] = 'yes';
        } else if (value && typeof value === 'object' && 'id' in value) {
          if ('deleted' in value && value.deleted) {
            formData.append(`${key}_deleted`, value.id.toString());
            fileChangeIndicators[`${key}_file_change_indicator`] = 'yes';
          } else {
            formData.append(`${key}_existing`, JSON.stringify(value));
            fileChangeIndicators[`${key}_file_change_indicator`] = 'no';
          }
        } else if (value === null && isEditMode) {
          if (initialValue !== null && initialValue !== undefined) {
            formData.append(`${key}_existing`, JSON.stringify(initialValue));
            formData.append(`${key}_deleted`, 'true');
            fileChangeIndicators[`${key}_file_change_indicator`] = 'yes';
          } else {
            fileChangeIndicators[`${key}_file_change_indicator`] = 'no';
          }
        } else {
          fileChangeIndicators[`${key}_file_change_indicator`] = 'no';
        }

        if (fileChangeIndicators[`${key}_file_change_indicator`] === 'yes') {
          formData.append(`${key}_existing`, JSON.stringify(initialValue));
        }
      }
    };

    Object.entries(data).forEach(([key, value]) => {
      if (key.includes('_image') || key.includes('_document')) {
        processFile(key, value, Array.isArray(value));
      } else if (Array.isArray(value) || typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === 'boolean') {
        formData.append(key, value.toString());
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // Add file change indicators to formData
    Object.entries(fileChangeIndicators).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (projectId && modelType !== 'Project') {
      formData.append('project_id', projectId);
    }

    try {
      const url = isEditMode ? `${apiEndpoint}/${modelId}` : apiEndpoint;
      const method = isEditMode ? 'PUT' : 'POST';

      // Log FormData contents for debugging
      // for (let pair of formData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }

      const response = await fetchWithLoading(url, {
        method: method,
        body: formData
      });

      if (onSave) {
        await onSave(response.model);
      }

      setIsSuccessDialogOpen(true);
    } catch (error) {
      console.error(`Error submitting ${modelType}:`, error);
      setError(`Failed to save ${modelType}. Please try again.`);
    }
  };

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
    router.push(redirectPath);
  };

  return (
    <>
      {children(handleSubmit)}
      {error && <div className="text-red-500">{error}</div>}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>
            {modelType} {isEditMode ? 'updated' : 'created'} successfully!
          </p>
          <Button onClick={handleCloseSuccessDialog}>OK</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GenericFormSubmitHandler;
