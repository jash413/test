// formUtils.ts

import { FieldErrors } from 'react-hook-form';
import { z } from 'zod';

export const getErrorMessage = (
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

export const renderValueWithLink = (value: string) => {
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

// Link schema
export const linkSchema = z
  .object({
    url: z.string().url('Must be a valid URL'),
    description: z
      .string()
      .max(100, 'Description must be 100 characters or less')
  })
  .describe('link');

export const DeleteIcon = () => (
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

export const validateAddress = (address: string) => {
  const parts = address.split(',');
  return parts.length >= 3 && /\d+/.test(parts[0]); // Basic check for number in first part
};

export interface ProcessedFileInfo {
  id: number;
  original_name: string;
  file_url: string;
  field_name: string;
  contentType?: string;
  file_content?: string;
}

export const processedFileInfoSchema = z.object({
  id: z.number(),
  original_name: z.string(),
  file_url: z.string(),
  contentType: z.string().optional(),
  file_content: z.string().optional()
});

export const singleFileSchema = z
  .union([
    z.instanceof(File),
    processedFileInfoSchema,
    z.object({
      id: z.number(),
      deleted: z.literal(true)
    }),
    z.null(),
    z.array(z.any()).length(0) // Handle empty arrays
  ])
  .nullable()
  .optional()
  .describe('single-file');

// New multi-file schema
export const multiFileSchema = z
  .array(
    z.union([
      z.instanceof(File),
      processedFileInfoSchema,
      z.object({
        id: z.number(),
        deleted: z.literal(true)
      })
    ])
  )
  .default([])
  .describe('multi-file');
