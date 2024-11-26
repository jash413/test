// file : server/utils/filehandler.ts

import { ModelType } from '@/server/model-config';
import { upload } from '@/server/api';
import api from '@/server/axios';
import { cachedFetchImage } from '@/lib/image_loader';
import { uploadMultipleFiles } from '../generic-model-service';

export const handleFileUpload = async (
  formData: FormData,
  session: any,
  type: ModelType
) => {
  let file_info: any = [];
  let file_fields: string[] = [];
  const multiFileFieldsMap = new Map<string, File[]>();

  // First pass: identify and group files
  formData.forEach((value, key) => {
    if (value instanceof File) {
      if (key.includes('[')) {
        // This is a multi-file field
        const baseFieldName = key.split('[')[0];
        if (!multiFileFieldsMap.has(baseFieldName)) {
          multiFileFieldsMap.set(baseFieldName, []);
        }
        multiFileFieldsMap.get(baseFieldName)?.push(value);
      } else {
        // This is a single file field
        file_fields.push(key);
      }
    }
  });

  // Handle single file fields (maintaining existing behavior)
  if (file_fields.length > 0) {
    for (const fileField of file_fields) {
      const file = formData.get(fileField) as File | null;
      if (file) {
        let data: any = {
          field_name: fileField,
          model: type
        };
        console.log('Uploading file:', file);
        let uploadedFileInfo: any = await upLoadFile(file, session, data);
        file_info.push(uploadedFileInfo);
        formData.delete(fileField);
        console.log(
          'File uploaded successfully in handleFileUpload:',
          uploadedFileInfo
        );
        formData.append(fileField, JSON.stringify(uploadedFileInfo));
      }
    }
  }

  // Handle multi-file fields
  if (multiFileFieldsMap.size > 0) {
    const multiFileFields = Array.from(multiFileFieldsMap.keys());
    for (const fieldName of multiFileFields) {
      const files = multiFileFieldsMap.get(fieldName);
      if (files && files.length > 0) {
        let data: any = {
          field_name: fieldName,
          model: type
        };

        try {
          console.log('Uploading files:', files);
          const uploadedFilesInfo = await uploadMultipleFiles(
            files,
            session.user.apiUserToken,
            session.id,
            data
          );

          file_info = uploadedFilesInfo;
          // file_info.push(...uploadedFilesInfo);

          // Remove all original file entries
          formData.forEach((_, key) => {
            if (key.startsWith(fieldName + '[')) {
              formData.delete(key);
            }
          });

          // Add the uploaded files info back to formData
          formData.append(fieldName, JSON.stringify(uploadedFilesInfo));

          console.log(
            `Multiple files uploaded successfully for ${fieldName}:`,
            uploadedFilesInfo
          );
        } catch (error) {
          console.error(`Error uploading files for ${fieldName}:`, error);
          throw error;
        }
      }
    }
  }

  return file_info;
};

export async function upLoadFile(
  file: any,
  session: any,
  data?: any,
  retries = 3
) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log(
        `Attempt ${attempt + 1} of ${retries} to upload file:`,
        file.name
      );

      // Create a new FormData instance for the file upload

      const uploadedFileInfo = await upload(
        file,
        session.user.apiUserToken,
        session.user.id,
        data
      );

      // console.log('File uploaded successfully:', uploadedFileInfo);

      if (uploadedFileInfo && Array.isArray(uploadedFileInfo)) {
        if (uploadedFileInfo.length === 1) {
          return uploadedFileInfo[0]; // Return the single element
        } else {
          return uploadedFileInfo; // Return the entire array
        }
      } else {
        console.error(
          'File upload failed: uploadedFileInfo is undefined or not an array'
        );
        return null; // or handle the error appropriately
      }
    } catch (error) {
      console.error(`Upload attempt ${attempt + 1} failed:`, error);

      if (attempt === retries - 1) {
        // If this was the last attempt, throw the error
        throw error;
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
}

export async function processChangedFormDataFiles(
  formData: FormData,
  modelType: ModelType,
  session: any
) {
  const updatedFormData = new FormData();
  const entries = Array.from(formData.entries());

  for (const [key, value] of entries) {
    try {
      if (key.endsWith('_file_change_indicator') && value === 'yes') {
        updatedFormData.append(key, value);
        const baseFieldName = key.replace('_file_change_indicator', '');

        // Determine if this is a multiple file field
        const isMultipleFiles =
          formData.has(`${baseFieldName}_count`) ||
          formData.has(`${baseFieldName}[0]`) ||
          formData.get(`${baseFieldName}_multiple_files`) == 'yes';

        if (isMultipleFiles) {
          // Handle multiple files
          const uploadedFiles = [];

          // Handle new files if they exist
          const fileCount = formData.get(`${baseFieldName}_count`);
          if (fileCount) {
            const count = parseInt(fileCount as string, 10);

            // Upload each new file
            for (let i = 0; i < count; i++) {
              const file = formData.get(`${baseFieldName}[${i}]`);
              if (file instanceof File) {
                try {
                  console.log(
                    `Processing file ${i + 1} of ${count} for ${baseFieldName}`,
                    file
                  );
                  let data = {
                    field_name: baseFieldName,
                    model: modelType
                  };

                  const uploadedFileInfo = await upLoadFile(
                    file,
                    session,
                    data
                  );
                  console.log(
                    `File ${i + 1} uploaded successfully:`,
                    uploadedFileInfo
                  );
                  uploadedFiles.push(uploadedFileInfo);
                } catch (error) {
                  console.error(
                    `Error uploading file ${i + 1} for ${baseFieldName}:`,
                    error
                  );
                }
              }
            }
          }

          // Handle existing files
          let existingFiles = [];
          const existingFilesInfo = formData.get(`${baseFieldName}_original`);
          if (existingFilesInfo) {
            existingFiles = JSON.parse(existingFilesInfo as string);
          }

          // Handle deleted files
          const deletedFileIds = formData.get(`${baseFieldName}_deleted_ids`);
          if (deletedFileIds) {
            const idsToDelete = JSON.parse(deletedFileIds as string);

            // Delete the files from storage
            for (const fileId of idsToDelete) {
              const fileToDelete = existingFiles.find(
                (file_info: { id: any }) => file_info.id === fileId
              );
              if (fileToDelete?.file_url) {
                try {
                  await deleteFile(fileToDelete.file_url, session);
                  console.log(`Deleted file with ID ${fileId}`);
                } catch (error) {
                  console.error(
                    `Error deleting file with ID ${fileId}:`,
                    error
                  );
                }
              }
            }

            // Remove deleted files from existing files array
            existingFiles = existingFiles.filter(
              (file: { id: any }) => !idsToDelete.includes(file.id)
            );
          }

          // Combine remaining existing files with any new uploads
          const allFiles = [...existingFiles, ...uploadedFiles];

          // Update form data with final files array
          updatedFormData.delete(baseFieldName);
          updatedFormData.append(baseFieldName, JSON.stringify(allFiles));
        } else {
          // Handle single file
          const file = formData.get(baseFieldName);
          const existingFile = formData.get(`${baseFieldName}_existing`);
          const isDeleted = formData.get(`${baseFieldName}_deleted`);

          if (file instanceof File) {
            // Upload new file
            try {
              let data = {
                field_name: baseFieldName,
                model: modelType
              };
              const uploadedFileInfo = await upLoadFile(file, session, data);
              console.log(
                'Single file uploaded successfully:',
                uploadedFileInfo
              );

              // Delete existing file if there is one
              if (existingFile) {
                const existingFileInfo = JSON.parse(existingFile as string);
                if (existingFileInfo?.file_url) {
                  await deleteFile(existingFileInfo.file_url, session);
                }
              }

              updatedFormData.append(
                baseFieldName,
                JSON.stringify(uploadedFileInfo)
              );
            } catch (error) {
              console.error(
                `Error uploading single file for ${baseFieldName}:`,
                error
              );
            }
          } else if (isDeleted) {
            // Handle deletion of single file
            if (existingFile) {
              const existingFileInfo = JSON.parse(existingFile as string);
              if (existingFileInfo?.file_url) {
                try {
                  await deleteFile(existingFileInfo.file_url, session);
                  console.log(`Deleted single file for ${baseFieldName}`);
                } catch (error) {
                  console.error(
                    `Error deleting single file for ${baseFieldName}:`,
                    error
                  );
                }
              }
            }
            updatedFormData.append(baseFieldName, 'null');
          }
        }
      } else if (
        !key.includes('_file_change_indicator') &&
        !key.endsWith('_count') &&
        !key.endsWith('_original') &&
        !key.endsWith('_deleted_ids') &&
        !key.endsWith('_existing') &&
        !key.endsWith('_deleted') &&
        !key.match(/\[\d+\]$/) // Skip array indexed files
      ) {
        // Copy all other form fields that aren't related to file handling
        updatedFormData.append(key, value);
      }
    } catch (error) {
      console.error(`Error processing field ${key}:`, error);
    }
  }

  return updatedFormData;
}

export async function deleteFile(fileUrl: string, session: any) {
  try {
    const delete_url =
      process.env.NEXT_PUBLIC_SERVER_API_URL + '/api/delete_file/' + fileUrl;
    const headers = {
      Authorization: 'Bearer ' + session.user.apiUserToken
    };
    await api.delete(delete_url, { headers });
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

export async function fetchImage(shortCode: string, token: string) {
  try {
    const download_url =
      process.env.NEXT_PUBLIC_SERVER_API_URL + '/api/download/' + shortCode;
    const headers = {
      Authorization: 'Bearer ' + token,
      Accept: 'image/*',
      Connection: 'keep-alive'
    };
    const response = await api.get(download_url, {
      headers,
      responseType: 'arraybuffer'
    });

    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    // console.log(' response headers :', response.headers)
    // console.log(' response data :', response.data)
    return {
      data: base64,
      contentType: response.headers['content-type'],
      contentDisposition: response.headers['content-disposition']
    };
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
}

export async function processImages(fileInfo: any[], apiUserToken: string) {
  const processedFileInfo = await Promise.all(
    fileInfo.map(async (file) => {
      try {
        const imageData = await cachedFetchImage(file.file_url, apiUserToken);
        const file_content = `data:${imageData.contentType};base64,${imageData.data}`;
        return { ...file, file_content, contentType: imageData.contentType };
      } catch (error) {
        console.error('Error fetching image:', error);
        return file;
      }
    })
  );
  return processedFileInfo;
}

export async function processDocumentsAndImages<T extends Record<string, any>>(
  obj: T,
  apiUserToken: string,
  documentFieldSuffixes: string[] = [
    '_document',
    '_image',
    '_documents',
    '_images'
  ]
): Promise<T> {
  const result = { ...obj };
  const documentFields = Object.keys(obj).filter((key) =>
    documentFieldSuffixes.some((suffix) => key.endsWith(suffix))
  );

  for (const field of documentFields) {
    const document = obj[field];

    // Handle array of documents
    if (Array.isArray(document)) {
      const processedDocuments = await Promise.all(
        document.map(async (doc) => {
          const processed = await processSingleDocument(
            doc,
            field,
            apiUserToken
          );
          return processed || doc; // Fall back to original if processing failed
        })
      );

      // Filter out any null values and assign back to result
      (result as any)[field] = processedDocuments.filter(Boolean);
    }
    // Handle single document
    else {
      const processedDocument = await processSingleDocument(
        document,
        field,
        apiUserToken
      );
      if (processedDocument) {
        (result as any)[field] = processedDocument;
      }
    }
  }

  return result as T;
}

async function processSingleDocument(
  document: any,
  field: string,
  apiUserToken: string
): Promise<ProcessedFileInfo | null> {
  if (document && typeof document === 'object' && 'file_url' in document) {
    try {
      // console.log(`Processing document ${field}:`, document);
      const imageData = await cachedFetchImage(document.file_url, apiUserToken);
      return {
        ...document,
        file_content: `data:${imageData.contentType};base64,${imageData.data}`,
        contentType: imageData.contentType,
        field_name: field
      } as ProcessedFileInfo;
    } catch (error) {
      console.error(`Error processing document ${field}:`, error);
      return null;
    }
  }
  return null;
}

export interface ProcessedFileInfo {
  id: number;
  original_name: string;
  file_url: string;
  field_name: string;
  file_content: string; // This will contain the base64 image data
  contentType: string; // MIME type of the image
  file_size?: number; // Optional, if you want to include the file size
  model_api_name?: string;
}

interface FileInfo {
  id: number;
  original_name: string;
  file_url: string;
  download_url: string;
  model_api_name: string;
}

export function extractDocument(
  files: FileInfo[],
  documentType: string
): FileInfo[] {
  return files.filter((file) => {
    try {
      const { field_name } = JSON.parse(file.model_api_name);
      return field_name.startsWith(documentType);
    } catch (error) {
      console.error(`Error parsing model_api_name for file ${file.id}:`, error);
      return false;
    }
  });
}
