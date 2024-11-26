// @/server/types/roles_files_mappings.ts

import { ModelMapping } from '../converter';
import {
  parseInteger,
  parseBigInt,
  formatDateForAPI
} from '@/server/utils/parsers';
import { BaseModel, GenericModelShape } from './base_mapping';

export class FolderCodes extends BaseModel {
  folder_name: string = '';
  folder_display_name: string = '';
  description: string | null = null;
  business_id: number | null = null;
  project_id: number = 0;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'folder_name', to: 'folder_name' },
      { from: 'folder_display_name', to: 'folder_display_name' },
      { from: 'description', to: 'description' },
      { from: 'business_id', to: 'business_id', transform: parseInteger },
      { from: 'project_id', to: 'project_id', transform: parseInteger }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'folder_name', to: 'folder_name' },
      { from: 'folder_display_name', to: 'folder_display_name' },
      { from: 'description', to: 'description' },
      { from: 'business_id', to: 'business_id' },
      { from: 'project_id', to: 'project_id' }
    ]
  };
}

export class File extends BaseModel {
  file_name: string = '';
  file_id: string = '';
  original_name: string | null = null;
  file_type: string | null = null;
  file_size: BigInt | null = null;
  file_size_restriction: BigInt | null = null;
  uploaded_user_id: number = 0;
  uploaded_at: Date | null = null;
  description: string | null = null;
  tags: string[] = [];
  notes: string[] = [];
  folder_code_id: number | null = null;
  file_url: string = '';
  status: string | null = null;
  file_data: any | null = null;
  project_id: number | null = null;
  task_id: number | null = null;
  bid_id: number | null = null;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'file_name', to: 'file_name' },
      { from: 'file_id', to: 'file_id' },
      { from: 'original_name', to: 'original_name' },
      { from: 'file_type', to: 'file_type' },
      { from: 'file_size', to: 'file_size', transform: parseBigInt },
      {
        from: 'file_size_restriction',
        to: 'file_size_restriction',
        transform: parseBigInt
      },
      {
        from: 'uploaded_user_id',
        to: 'uploaded_user_id',
        transform: parseInteger
      },
      {
        from: 'uploaded_at',
        to: 'uploaded_at',
        transform: (v) => (v ? new Date(v as string) : null)
      },
      { from: 'description', to: 'description' },
      {
        from: 'tags',
        to: 'tags',
        transform: (v) => (v ? JSON.parse(v as string) : [])
      },
      {
        from: 'notes',
        to: 'notes',
        transform: (v) => (v ? JSON.parse(v as string) : [])
      },
      { from: 'folder_code_id', to: 'folder_code_id', transform: parseInteger },
      { from: 'file_url', to: 'file_url' },
      { from: 'status', to: 'status' },
      {
        from: 'file_data',
        to: 'file_data',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      },
      { from: 'project_id', to: 'project_id', transform: parseInteger },
      { from: 'task_id', to: 'task_id', transform: parseInteger },
      { from: 'bid_id', to: 'bid_id', transform: parseInteger }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'file_name', to: 'file_name' },
      { from: 'file_id', to: 'file_id' },
      { from: 'original_name', to: 'original_name' },
      { from: 'file_type', to: 'file_type' },
      {
        from: 'file_size',
        to: 'file_size',
        transform: (v) => (v ? v.toString() : null)
      },
      {
        from: 'file_size_restriction',
        to: 'file_size_restriction',
        transform: (v) => (v ? v.toString() : null)
      },
      { from: 'uploaded_user_id', to: 'uploaded_user_id' },
      { from: 'uploaded_at', to: 'uploaded_at', transform: formatDateForAPI },
      { from: 'description', to: 'description' },
      { from: 'tags', to: 'tags', transform: JSON.stringify },
      { from: 'notes', to: 'notes', transform: JSON.stringify },
      { from: 'folder_code_id', to: 'folder_code_id' },
      { from: 'file_url', to: 'file_url' },
      { from: 'status', to: 'status' },
      { from: 'file_data', to: 'file_data', transform: JSON.stringify },
      { from: 'project_id', to: 'project_id' },
      { from: 'task_id', to: 'task_id' },
      { from: 'bid_id', to: 'bid_id' }
    ]
  };
}

export class UserFile extends BaseModel {
  file_name: string = '';
  file_id: string = '';
  original_name: string | null = null;
  file_type: string | null = null;
  file_size: BigInt | null = null;
  file_size_restriction: BigInt | null = null;
  uploaded_user_id: number = 0;
  uploaded_at: Date | null = null;
  description: string | null = null;
  tags: string[] = [];
  notes: string[] = [];
  folder_code_id: number | null = null;
  file_url: string = '';
  status: string | null = null;
  file_data: any | null = null;
  project_id: number | null = null;
  task_id: number | null = null;
  bid_id: number | null = null;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'file_name', to: 'file_name' },
      { from: 'file_id', to: 'file_id' },
      { from: 'original_name', to: 'original_name' },
      { from: 'file_type', to: 'file_type' },
      { from: 'file_size', to: 'file_size', transform: parseBigInt },
      {
        from: 'file_size_restriction',
        to: 'file_size_restriction',
        transform: parseBigInt
      },
      {
        from: 'uploaded_user_id',
        to: 'uploaded_user_id',
        transform: parseInteger
      },
      {
        from: 'uploaded_at',
        to: 'uploaded_at',
        transform: (v) => (v ? new Date(v as string) : null)
      },
      { from: 'description', to: 'description' },
      {
        from: 'tags',
        to: 'tags',
        transform: (v) => (v ? JSON.parse(v as string) : [])
      },
      {
        from: 'notes',
        to: 'notes',
        transform: (v) => (v ? JSON.parse(v as string) : [])
      },
      { from: 'folder_code_id', to: 'folder_code_id', transform: parseInteger },
      { from: 'file_url', to: 'file_url' },
      { from: 'status', to: 'status' },
      {
        from: 'file_data',
        to: 'file_data',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      },
      { from: 'project_id', to: 'project_id', transform: parseInteger },
      { from: 'task_id', to: 'task_id', transform: parseInteger },
      { from: 'bid_id', to: 'bid_id', transform: parseInteger }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'file_name', to: 'file_name' },
      { from: 'file_id', to: 'file_id' },
      { from: 'original_name', to: 'original_name' },
      { from: 'file_type', to: 'file_type' },
      {
        from: 'file_size',
        to: 'file_size',
        transform: (v) => (v ? v.toString() : null)
      },
      {
        from: 'file_size_restriction',
        to: 'file_size_restriction',
        transform: (v) => (v ? v.toString() : null)
      },
      { from: 'uploaded_user_id', to: 'uploaded_user_id' },
      { from: 'uploaded_at', to: 'uploaded_at', transform: formatDateForAPI },
      { from: 'description', to: 'description' },
      { from: 'tags', to: 'tags', transform: JSON.stringify },
      { from: 'notes', to: 'notes', transform: JSON.stringify },
      { from: 'folder_code_id', to: 'folder_code_id' },
      { from: 'file_url', to: 'file_url' },
      { from: 'status', to: 'status' },
      { from: 'file_data', to: 'file_data', transform: JSON.stringify },
      { from: 'project_id', to: 'project_id' },
      { from: 'task_id', to: 'task_id' },
      { from: 'bid_id', to: 'bid_id' }
    ]
  };
}

export class FilePermissions extends BaseModel {
  file_id: number = 0;
  user_id: number = 0;
  permission_type: string[] = [];

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'file_id', to: 'file_id', transform: parseInteger },
      { from: 'user_id', to: 'user_id', transform: parseInteger },
      {
        from: 'permission_type',
        to: 'permission_type',
        transform: (v) => (v ? JSON.parse(v as string) : [])
      }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'file_id', to: 'file_id' },
      { from: 'user_id', to: 'user_id' },
      {
        from: 'permission_type',
        to: 'permission_type'
      }
    ]
  };
}

export class Upload extends BaseModel {
  // its a binary file
  files: any = null;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'files', to: 'files' }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'files', to: 'files' }
    ]
  };
}

export type FolderCodesShape = GenericModelShape &
  Omit<FolderCodes, keyof GenericModelShape>;
export type FileShape = GenericModelShape & Omit<File, keyof GenericModelShape>;
export type FilePermissionsShape = GenericModelShape &
  Omit<FilePermissions, keyof GenericModelShape>;
export type UploadShape = GenericModelShape &
  Omit<Upload, keyof GenericModelShape>;

export const folderCodesMapping = FolderCodes.baseMapping;
export const fileMapping = File.baseMapping;
export const filePermissionsMapping = FilePermissions.baseMapping;
export const uploadMapping = Upload.baseMapping;
