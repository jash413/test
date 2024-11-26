// file : components/project/create_edit/ProjectForm.tsx

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { MultiStepForm } from '@/components/forms/del-MultiStepForm';
import {
  TooltipProvider,
  TooltipContent
} from '@/components/forms/TooltipContext';
import { Tooltip } from '@/components/forms/ToolTip';
import { useSession } from 'next-auth/react';
import { useLoadingAPI } from '@/app/hooks/useLoadingAPI';
import { FilePreview } from '@/components/FilePreview';
import {
  fieldTooltips,
  projectSchema,
  steps,
  defaultValues
} from './stepsAndSchema';

const fileUploadProps = {
  project_documents: {
    label: 'Project Documents',
    accept: '.pdf,.jpg,.jpeg,.png'
  }
};

interface FileInfo {
  id: number;
  field_name: string;
  orignal_name: string;
  file_url: string;
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

export default function ProjectPage({ projectId }: { projectId?: number }) {
  const { status } = useSession();

  const [fileUploads, setFileUploads] = useState<Record<string, File | null>>(
    {}
  );
  const [filesWereChanged, setFilesWereChanged] = useState(false);

  const router = useCustomRouter();
  const { fetchWithLoading } = useLoadingAPI();
  const [projectData, setProjectData] = useState<any>(null);
  const [fileInfos, setFileInfos] = useState<FileInfo[]>([]);
  const isEditMode = !!projectId;

  const [currentTooltip, setCurrentTooltip] = useState<TooltipContent>({
    description: 'Select an input to see tips.',
    example: 'Select an input to see example',
    label: ''
  });

  useEffect(() => {
    const fetchProjectData = async () => {
      if (isEditMode && projectId) {
        try {
          const data = await fetchWithLoading(
            `/api/generic-model/project/${projectId}`
          );
          setProjectData(data.model);
          if (data.model.file_info && Array.isArray(data.model.file_info)) {
            // console.log("File info:", data.model.file_info[0]);
            setFileInfos(data.model.file_info);
          }
        } catch (error) {
          console.error('Error fetching project data:', error);
        }
      }
    };

    fetchProjectData();
  }, [isEditMode, projectId, fetchWithLoading]);

  const updateTooltip = useCallback((fieldName: string) => {
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
  }, []);

  const resetTooltip = useCallback(() => {
    setCurrentTooltip({
      description: 'Select an input to see tips.',
      example: '',
      label: ''
    });
  }, []);

  const handleFilesChanged = useCallback((changed: boolean) => {
    setFilesWereChanged(changed);
  }, []);

  const handleFileSelect = useCallback(
    (file: File | null, fieldName: string) => {
      if (file) {
        setFileUploads((prev) => ({ ...prev, [fieldName]: file }));
        // Remove the corresponding fileInfo when a new file is uploaded
        setFileInfos((prev) =>
          prev.filter((info) => info.field_name !== fieldName)
        );
      }
    },
    []
  );

  const handleFileDelete = useCallback((fieldName: string, fileId: number) => {
    if (fileId === -1) {
      // This is a newly uploaded file
      setFileUploads((prev) => ({ ...prev, [fieldName]: null }));
    } else {
      // This is an existing file
      setFileInfos((prev) => prev.filter((info) => info.id !== fileId));
    }
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

    // Append file_info for existing files that weren't changed
    formData.append('file_info', JSON.stringify(fileInfos));

    // Add the files_were_changed indicator
    formData.append('files_were_changed', String(filesWereChanged));

    try {
      const url = isEditMode
        ? `/api/generic-model/project/${projectId}`
        : '/api/generic-model/project';

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetchWithLoading(url, {
        method: method,
        body: formData
      });

      router.push(`/dashboard/project_details/${response.model.id}`);
    } catch (error) {
      // setError is called within fetchWithLoading, so we don't need to call it here
    }
  };

  if (status === 'unauthenticated') {
    return <div>Access Denied</div>;
  }

  if (isEditMode && !projectData) {
    return <div>Loading...</div>;
  }

  const fileUploadPropsWithFiles = Object.entries(fileUploadProps).reduce(
    (acc, [key, value]) => {
      const existingFileInfo = fileInfos.find(
        (info) => info.field_name === key
      );
      acc[key] = {
        ...value,
        file: fileUploads[key] || null,
        onFileSelect: (file: File | null) => handleFileSelect(file, key),
        preview: fileUploads[key] ? (
          <FilePreview
            file={fileUploads[key]!}
            onDelete={() => handleFileDelete(key, -1)}
            className="mt-2"
          />
        ) : existingFileInfo ? (
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <span>Current file: </span>
              <a
                href={existingFileInfo.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {existingFileInfo.orignal_name}
              </a>
              <button
                onClick={() => handleFileDelete(key, existingFileInfo.id)}
                className="text-red-600 hover:underline"
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        ) : null
      };
      return acc;
    },
    {} as Record<string, any>
  );

  return (
    <TooltipProvider>
      <div className="mx-auto mt-0 max-w-6xl bg-white px-4">
        <div className="flex">
          <div className="w-2/3 pr-8">
            <h2 className="mb-6 text-center text-2xl font-semibold text-secondary-foreground">
              {isEditMode ? 'Edit Project' : 'Create New Project'}
            </h2>

            <div className="relative">
              <MultiStepForm
                steps={steps}
                schema={projectSchema}
                onSubmit={onSubmit}
                updateTooltip={updateTooltip}
                resetTooltip={resetTooltip}
                fileUploadProps={fileUploadPropsWithFiles}
                fieldTooltips={fieldTooltips}
                defaultValues={isEditMode ? projectData : defaultValues}
                onFilesChanged={handleFilesChanged}
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
