// file : components/forms/MultiStep/FileFields.tsx

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ProcessedFileInfo } from '@/server/utils/filehandler';
import { FilePreview } from '@/components/FilePreview';

interface SingleFileFieldProps {
  label: string;
  name: string;
  value:
    | File
    | ProcessedFileInfo
    | { id: number; deleted: true }
    | null
    | undefined;
  onChange: (
    value: File | ProcessedFileInfo | { id: number; deleted: true } | null
  ) => void;
  error?: string;
  accept?: string;
}

export const SingleFileField: React.FC<SingleFileFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  accept
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileState, setFileState] = useState<{
    file: File | ProcessedFileInfo | null;
    fileName: string | null;
  }>({ file: null, fileName: null });

  useEffect(() => {
    if (value instanceof File) {
      setFileState({ file: value, fileName: value.name });
    } else if (value && typeof value === 'object' && 'original_name' in value) {
      setFileState({ file: value, fileName: value.original_name });
    } else if (value === null || value === undefined) {
      setFileState({ file: null, fileName: null });
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileState({ file, fileName: file.name });
      onChange(file);
    } else {
      setFileState({ file: null, fileName: null });
      onChange(null);
    }
  };

  const handleRemoveFile = () => {
    setFileState({ file: null, fileName: null });
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-4">
      <Label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="mt-2 flex items-center">
        <Button
          onClick={() => fileInputRef.current?.click()}
          type="button"
          className="bg-violet-50 text-violet-700 hover:bg-violet-100"
        >
          Choose File
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          id={name}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        {fileState.fileName ? (
          <div className="ml-2 flex items-center">
            <span className="max-w-xs truncate text-sm text-gray-600">
              {fileState.fileName}
            </span>
          </div>
        ) : (
          <span className="ml-2 text-sm text-gray-500">No file chosen</span>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {fileState.file && (
        <FilePreview
          file={
            fileState.file instanceof File
              ? fileState.file
              : fileState.file.file_content
          }
          contentType={
            fileState.file instanceof File
              ? fileState.file.type
              : fileState.file.contentType
          }
          onDelete={handleRemoveFile}
          className="mt-2 w-full"
        />
      )}
    </div>
  );
};

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

interface MultiFileFieldProps {
  label: string;
  name: string;
  value: FileType[];
  onChange: (files: FileType[]) => void;
  error?: string;
  accept?: string;
  multiple?: boolean;
}

type DeletedFile = {
  id: number;
  deleted: true;
};

type FileType = File | ProcessedFileInfo | DeletedFile;

// Type guard for ProcessedFileInfo
function isProcessedFileInfo(file: FileType): file is ProcessedFileInfo {
  return 'file_content' in file && 'contentType' in file;
}

// Type guard for DeletedFile
function isDeletedFile(file: FileType): file is DeletedFile {
  return 'deleted' in file;
}

export const MultiFilesField: React.FC<MultiFileFieldProps> = ({
  label,
  name,
  value = [],
  onChange,
  error,
  accept
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const updatedFiles = [
      ...value.filter(
        (file): file is ProcessedFileInfo =>
          !isDeletedFile(file) && !(file instanceof File)
      ), // Keep existing processed files
      ...newFiles // Add new File objects
    ];
    onChange(updatedFiles);

    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const fileToRemove = value[index];
    const updatedFiles = value.filter((_, i) => i !== index);

    if (isProcessedFileInfo(fileToRemove)) {
      // If it's a ProcessedFileInfo, mark it as deleted
      updatedFiles.push({ id: fileToRemove.id, deleted: true });
    }

    onChange(updatedFiles);
  };

  const isImage = (file: FileType): boolean => {
    if (file instanceof File) {
      return file.type.startsWith('image/');
    } else if (isProcessedFileInfo(file)) {
      return file.original_name.match(/\.(jpeg|jpg|gif|png)$/) !== null;
    }
    return false;
  };

  const getFilePreviewProps = (file: FileType) => {
    if (file instanceof File) {
      return {
        file: file,
        contentType: file.type
      };
    } else if (isProcessedFileInfo(file)) {
      return {
        file: file.file_content,
        contentType: file.contentType
      };
    }
    return null;
  };

  const getFileName = (file: FileType): string => {
    if (file instanceof File) {
      return file.name;
    } else if (isProcessedFileInfo(file)) {
      return file.original_name;
    }
    return 'Deleted file';
  };

  return (
    <div className="mb-4">
      <Label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="mt-2">
        <input
          type="file"
          id={name}
          ref={fileInputRef}
          accept={accept}
          onChange={handleFileChange}
          multiple={true} // This should now be properly respected
          className="block w-full text-sm text-gray-500
                    file:mr-4 file:rounded-full file:border-0
                    file:bg-violet-50 file:px-4
                    file:py-2 file:text-sm
                    file:font-semibold file:text-violet-700
                    hover:file:bg-violet-100"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {value && value.length > 0 && (
        <div className="mt-4 space-y-2">
          {value
            .filter((file) => !isDeletedFile(file))
            .map((file, index) => {
              const previewProps = getFilePreviewProps(file);

              return (
                <div key={index} className="flex items-center justify-between">
                  {isImage(file) && previewProps ? (
                    <FilePreview
                      file={previewProps.file}
                      contentType={previewProps.contentType}
                      onDelete={() => handleRemoveFile(index)}
                      className="w-full"
                    />
                  ) : (
                    <>
                      <span className="text-sm text-gray-600">
                        {getFileName(file)}
                      </span>
                      <Button
                        onClick={() => handleRemoveFile(index)}
                        variant="destructive"
                        size="sm"
                        type="button"
                        className="ml-2"
                      >
                        <DeleteIcon />
                      </Button>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
