import { ModelMapping } from '../converter';
import { formatAddress, parseAddress } from '@/server/utils/address';
import {
  parseInteger,
  parseFloat,
  formatIntegerForAPI,
  formatFloatForAPI,
  parseDate,
  parseDateArray,
  formatDateForAPI,
  formatDateArrayForAPI
} from '@/server/utils/parsers';

export type GenericModelShape = {
  id: number;
  created_at: Date;
  creator_id: number;
  updated_at: Date;
  [key: string]: any;
};

export class BaseModel implements GenericModelShape {
  id: number = 0;
  created_at: Date = new Date();
  creator_id: number = 0;
  updated_at: Date = new Date();
  file_info?: Record<string, any>;

  static baseMapping: ModelMapping = {
    formdata_to_object: [
      { from: 'id', to: 'id', transform: (v) => Number(v) || 0 },
      {
        from: 'created_at',
        to: 'created_at',
        transform: (v) => (v ? new Date(v as string) : new Date())
      },
      {
        from: 'updated_at',
        to: 'updated_at',
        transform: (v) => (v ? new Date(v as string) : new Date())
      },
      { from: 'creator_id', to: 'creator_id', transform: Number },
      { from: 'file_info', to: 'file_info', transform: JSON.parse }
    ],
    object_to_api: [
      { from: 'id', to: 'id' },
      {
        from: 'created_at',
        to: 'created_at',
        transform: (v) =>
          v instanceof Date ? v.toISOString() : new Date().toISOString()
      },
      {
        from: 'updated_at',
        to: 'updated_at',
        transform: (v) =>
          v instanceof Date ? v.toISOString() : new Date().toISOString()
      },
      { from: 'creator_id', to: 'creator_id' },
      { from: 'file_info', to: 'file_info', transform: JSON.stringify }
    ]
  };
}

export class UserProfile extends BaseModel implements UserProfileShape {
  user_id: number = 0;
  bio: string | null = null;
  website: string | null = null;
  social_media_links: any | null = null;
  home_owner_interests: string | null = null;
  address1: string | null = null;
  address2: string | null = null;
  state: string | null = null;
  zipcode: string | null = null;
  referral_code: string | null = null;
  referred_by: string | null = null;
  date_of_birth: Date | null = null;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'user_id', to: 'user_id', transform: Number },
      { from: 'name', to: 'name' },
      { from: 'bio', to: 'bio' },
      { from: 'website', to: 'website' },
      {
        from: 'social_media_links',
        to: 'social_media_links',
        transform: JSON.parse
      },
      { from: 'home_owner_interests', to: 'home_owner_interests' },
      { from: 'referral_code', to: 'referral_code' },
      { from: 'referred_by', to: 'referred_by' },
      {
        from: 'date_of_birth',
        to: 'date_of_birth',
        transform: (v) => (v ? new Date(v as string) : null)
      }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'user_id', to: 'user_id' },
      { from: 'name', to: 'name' },
      { from: 'bio', to: 'bio' },
      { from: 'website', to: 'website' },
      {
        from: 'social_media_links',
        to: 'social_media_links',
        transform: JSON.stringify
      },
      { from: 'profile_picture_url', to: 'profile_picture_url' },
      { from: 'home_owner_interests', to: 'home_owner_interests' },
      { from: 'address1', to: 'address1' },
      { from: 'address2', to: 'address2' },
      { from: 'state', to: 'state' },
      { from: 'zipcode', to: 'zipcode' },
      { from: 'referral_code', to: 'referral_code' },
      { from: 'referred_by', to: 'referred_by' },
      {
        from: 'date_of_birth',
        to: 'date_of_birth',
        transform: (v) => (v ? (v as Date).toISOString() : null)
      }
    ]
  };
}

export function parseArrayString(value: unknown): string[] {
  if (typeof value === 'string') {
    try {
      // First, try to parse it as JSON
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // If parsing fails, split by comma and trim each item
      return value.split(',').map((item) => item.trim());
    }
  }
  return Array.isArray(value) ? value : [];
}

export class Business extends BaseModel implements BusinessShape {
  name: string = '';
  type?: string;
  structure: 'Sole Proprietorship' | 'LLC' | 'Corporation' | 'Partnership' =
    'Sole Proprietorship';
  years_in_business?: number;
  description?: string;
  website?: string;
  address?: string;
  email?: string;
  phone?: string;
  specializations: string[] = [];
  license_info?: string;
  insurance_info?: string;
  workers_comp_info?: string;
  tax_id?: string;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'businessType', to: 'type' },
      { from: 'legalName', to: 'name' },
      { from: 'businessStructure', to: 'structure' },
      { from: 'yearsInBusiness', to: 'years_in_business', transform: Number },
      { from: 'website', to: 'website' },
      { from: 'address', to: 'address' },
      { from: 'email', to: 'email' },
      { from: 'phone', to: 'phone' },
      {
        from: 'specializations',
        to: 'specializations',
        transform: parseArrayString
      },
      { from: 'licenseNumber', to: 'license_info' },
      { from: 'insuranceProvider', to: 'insurance_info' },
      { from: 'workersCompProvider', to: 'workers_comp_info' },
      { from: 'taxId', to: 'tax_id' }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'type', to: 'type' },
      { from: 'name', to: 'name' },
      { from: 'structure', to: 'structure' },
      { from: 'years_in_business', to: 'years_in_business' },
      { from: 'website', to: 'website' },
      { from: 'address', to: 'address' },
      { from: 'email', to: 'email' },
      { from: 'phone', to: 'phone' },
      { from: 'specializations', to: 'specializations' },
      { from: 'license_info', to: 'license_info' },
      { from: 'insurance_info', to: 'insurance_info' },
      { from: 'workers_comp_info', to: 'workers_comp_info' },
      { from: 'tax_id', to: 'tax_id' }
    ]
  };
}

export class Project extends BaseModel implements ProjectShape {
  home_owner_id: number | null = null;
  business_id: number = 0;
  name: string = '';
  description: string | null = null;
  address1: string | null = null;
  address2: string | null = null;
  state: string | null = null;
  zipcode: string | null = null;
  city: string | null = null;
  status: string | null = null;
  project_type: string | null = null;
  contract_type: string | null = null;
  budget_estimated: number | null = null;
  actual_spent: number | null = null;
  percentage_complete: number | null = null;
  notes: string | null = null;
  start_date: Date | null = null;
  end_date: Date | null = null;
  exception_notes: string | null = null;
  exception_dates: Date[] = [];
  lot_size_in_acres: number | null = null;
  square_footage: number | null = null;
  non_heated_square_footage: number | null = null;
  heated_square_footage: number | null = null;
  number_of_baths: number | null = null;
  number_of_beds: number | null = null;
  file_info: any | null = null;
  timeline_info: any | null = null;
  budget_info: any | null = null;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'home_owner_id', to: 'home_owner_id', transform: parseInteger },
      { from: 'business_id', to: 'business_id', transform: parseInteger },
      { from: 'name', to: 'name' },
      { from: 'description', to: 'description' },
      { from: 'address1', to: 'address1' },
      { from: 'address2', to: 'address2' },
      { from: 'state', to: 'state' },
      { from: 'zipcode', to: 'zipcode' },
      { from: 'city', to: 'city' },
      { from: 'status', to: 'status' },
      { from: 'project_type', to: 'project_type' },
      { from: 'contract_type', to: 'contract_type' },
      {
        from: 'budget_estimated',
        to: 'budget_estimated',
        transform: parseInteger
      },
      { from: 'actual_spent', to: 'actual_spent', transform: parseFloat },
      {
        from: 'percentage_complete',
        to: 'percentage_complete',
        transform: parseFloat
      },
      { from: 'notes', to: 'notes' },
      { from: 'start_date', to: 'start_date', transform: parseDate },
      { from: 'end_date', to: 'end_date', transform: parseDate },
      { from: 'exception_notes', to: 'exception_notes' },
      {
        from: 'exception_dates',
        to: 'exception_dates',
        transform: parseDateArray
      },
      {
        from: 'lot_size_in_acres',
        to: 'lot_size_in_acres',
        transform: parseFloat
      },
      { from: 'square_footage', to: 'square_footage', transform: parseInteger },
      {
        from: 'number_of_baths',
        to: 'number_of_baths',
        transform: (v) => parseFloat(v, 1)
      },
      { from: 'number_of_beds', to: 'number_of_beds', transform: parseInteger },
      {
        from: 'heated_square_footage',
        to: 'heated_square_footage',
        transform: parseInteger
      },
      {
        from: 'non_heated_square_footage',
        to: 'non_heated_square_footage',
        transform: parseInteger
      },
      {
        from: 'file_info',
        to: 'file_info',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'home_owner_id', to: 'home_owner_id' },
      { from: 'business_id', to: 'gc_business_id' },
      { from: 'name', to: 'name' },
      { from: 'description', to: 'description' },
      { from: 'address1', to: 'address1' },
      { from: 'address2', to: 'address2' },
      { from: 'state', to: 'state' },
      { from: 'zipcode', to: 'zipcode' },
      { from: 'city', to: 'city' },
      { from: 'status', to: 'status' },
      { from: 'project_type', to: 'project_type' },
      { from: 'contract_type', to: 'contract_type' },
      { from: 'budget_estimated', to: 'budget_estimated' },
      { from: 'actual_spent', to: 'actual_spent' },
      { from: 'percentage_complete', to: 'percentage_complete' },
      { from: 'notes', to: 'notes' },
      { from: 'start_date', to: 'start_date', transform: formatDateForAPI },
      { from: 'end_date', to: 'end_date', transform: formatDateForAPI },
      { from: 'exception_notes', to: 'exception_notes' },
      { from: 'exception_dates', to: 'exception_dates' },
      { from: 'lot_size_in_acres', to: 'lot_size_in_acres' },
      { from: 'square_footage', to: 'square_footage' },
      { from: 'number_of_baths', to: 'number_of_baths' },
      { from: 'number_of_beds', to: 'number_of_beds' },
      { from: 'heated_square_footage', to: 'heated_square_footage' },
      { from: 'non_heated_square_footage', to: 'non_heated_square_footage' },
      { from: 'file_info', to: 'file_info', transform: JSON.stringify },
      { from: 'timeline_info', to: 'timeline_info', transform: JSON.stringify },
      { from: 'budget_info', to: 'budget_info', transform: JSON.stringify }
    ]
  };
}

export class User extends BaseModel implements UserShape {
  creator_id: number = 0;
  active: boolean = true;
  email: string = '';
  name: string = '';
  first_name: string | null = null;
  middle_name: string | null = null;
  last_name: string | null = null;
  image: string | null = null;
  phone_number_mobile: string = '';
  text_enabled: boolean = false;
  phone_verified: Date | null = null;
  phone_number_home: string | null = null;
  email_verified: Date | null = null;
  admin: boolean = false;
  status: string = '';
  language: string[] = [];
  profile_created: boolean = true;
  user_fully_onboarded: boolean = true;
  user_type: string | null = null;
  address1: string | null = null;
  address2: string | null = null;
  state: string | null = null;
  zipcode: string | null = null;
  date_of_birth: Date | null = null;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'creator_id', to: 'creator_id', transform: parseInteger },
      { from: 'active', to: 'active', transform: Boolean },
      { from: 'email', to: 'email' },
      { from: 'name', to: 'name' },
      { from: 'first_name', to: 'first_name' },
      { from: 'middle_name', to: 'middle_name' },
      { from: 'last_name', to: 'last_name' },
      { from: 'image', to: 'image' },
      { from: 'phone_number_mobile', to: 'phone_number_mobile' },
      { from: 'text_enabled', to: 'text_enabled', transform: Boolean },
      { from: 'phone_verified', to: 'phone_verified', transform: parseDate },
      { from: 'phone_number_home', to: 'phone_number_home' },
      { from: 'email_verified', to: 'email_verified', transform: parseDate },
      { from: 'admin', to: 'admin', transform: Boolean },
      { from: 'status', to: 'status' },
      { from: 'language', to: 'language', transform: parseArrayString },
      { from: 'profile_created', to: 'profile_created', transform: Boolean },
      {
        from: 'user_fully_onboarded',
        to: 'user_fully_onboarded',
        transform: Boolean
      },
      { from: 'user_type', to: 'user_type' },
      { from: 'address1', to: 'address1' },
      { from: 'address2', to: 'address2' },
      { from: 'state', to: 'state' },
      { from: 'zipcode', to: 'zipcode' },
      { from: 'date_of_birth', to: 'date_of_birth', transform: parseDate }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'creator_id', to: 'creator_id', transform: parseInteger },
      { from: 'active', to: 'active', transform: Boolean },
      { from: 'email', to: 'email' },
      { from: 'name', to: 'name' },
      { from: 'first_name', to: 'first_name' },
      { from: 'middle_name', to: 'middle_name' },
      { from: 'last_name', to: 'last_name' },
      { from: 'image', to: 'image' },
      { from: 'phone_number_mobile', to: 'phone_number_mobile' },
      { from: 'text_enabled', to: 'text_enabled', transform: Boolean },
      {
        from: 'phone_verified',
        to: 'phone_verified',
        transform: formatDateForAPI
      },
      { from: 'phone_number_home', to: 'phone_number_home' },
      {
        from: 'email_verified',
        to: 'email_verified',
        transform: formatDateForAPI
      },
      { from: 'admin', to: 'admin', transform: Boolean },
      { from: 'status', to: 'status' },
      { from: 'language', to: 'language', transform: parseArrayString },
      { from: 'profile_created', to: 'profile_created', transform: Boolean },
      {
        from: 'user_fully_onboarded',
        to: 'user_fully_onboarded',
        transform: Boolean
      },
      { from: 'user_type', to: 'user_type' },
      { from: 'address1', to: 'address1' },
      { from: 'address2', to: 'address2' },
      { from: 'state', to: 'state' },
      { from: 'zipcode', to: 'zipcode' },
      {
        from: 'date_of_birth',
        to: 'date_of_birth',
        transform: formatDateForAPI
      }
    ]
  };
}

export class File extends BaseModel implements FileShape {
  creator_id: number = 0;
  active: boolean = true;
  file_name: string = '';
  file_id: string = '';
  original_name: string = '';
  file_type: string = '';
  file_size: string = '';
  file_size_restriction: string | null = null;
  uploaded_user_id: number = 0;
  uploaded_at: Date = new Date();
  description: string | null = null;
  tags: string[] = [];
  notes: string[] = [];
  folder_code_id: number = 0;
  file_url: string = '';
  status: string | null = null;
  file_data: any | null = null;
  project_id: number | null = null;
  task_id: number | null = null;
  bid_id: number | null = null;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'creator_id', to: 'creator_id', transform: parseInteger },
      { from: 'active', to: 'active', transform: Boolean },
      { from: 'file_name', to: 'file_name' },
      { from: 'file_id', to: 'file_id' },
      { from: 'original_name', to: 'original_name' },
      { from: 'file_type', to: 'file_type' },
      { from: 'file_size', to: 'file_size' },
      { from: 'file_size_restriction', to: 'file_size_restriction' },
      {
        from: 'uploaded_user_id',
        to: 'uploaded_user_id',
        transform: parseInteger
      },
      { from: 'uploaded_at', to: 'uploaded_at', transform: parseDate },
      { from: 'description', to: 'description' },
      { from: 'tags', to: 'tags', transform: parseArrayString },
      { from: 'notes', to: 'notes', transform: parseArrayString },
      { from: 'folder_code_id', to: 'folder_code_id', transform: parseInteger },
      { from: 'file_url', to: 'file_url' },
      { from: 'status', to: 'status' },
      { from: 'file_data', to: 'file_data' },
      { from: 'project_id', to: 'project_id', transform: parseInteger },
      { from: 'task_id', to: 'task_id', transform: parseInteger },
      { from: 'bid_id', to: 'bid_id', transform: parseInteger }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'creator_id', to: 'creator_id', transform: parseInteger },
      { from: 'active', to: 'active', transform: Boolean },
      { from: 'file_name', to: 'file_name' },
      { from: 'file_id', to: 'file_id' },
      { from: 'original_name', to: 'original_name' },
      { from: 'file_type', to: 'file_type' },
      { from: 'file_size', to: 'file_size' },
      { from: 'file_size_restriction', to: 'file_size_restriction' },
      {
        from: 'uploaded_user_id',
        to: 'uploaded_user_id',
        transform: parseInteger
      },
      { from: 'uploaded_at', to: 'uploaded_at', transform: parseDate },
      { from: 'description', to: 'description' },
      { from: 'tags', to: 'tags', transform: parseArrayString },
      { from: 'notes', to: 'notes', transform: parseArrayString },
      { from: 'folder_code_id', to: 'folder_code_id', transform: parseInteger },
      { from: 'file_url', to: 'file_url' },
      { from: 'status', to: 'status' },
      { from: 'file_data', to: 'file_data' },
      { from: 'project_id', to: 'project_id', transform: parseInteger },
      { from: 'task_id', to: 'task_id', transform: parseInteger },
      { from: 'bid_id', to: 'bid_id', transform: parseInteger }
    ]
  };
}

export class Folder_Codes extends BaseModel implements FolderCodesShape {
  creator_id: number = 0;
  active: boolean = true;
  folder_name: string = '';
  folder_display_name: string = '';
  description: string = '';
  business_id: number | null = null;
  project_id: number | null = null;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'creator_id', to: 'creator_id', transform: parseInteger },
      { from: 'active', to: 'active', transform: Boolean },
      { from: 'folder_name', to: 'folder_name' },
      { from: 'folder_display_name', to: 'folder_display_name' },
      { from: 'description', to: 'description' },
      { from: 'business_id', to: 'business_id', transform: parseInteger },
      { from: 'project_id', to: 'project_id', transform: parseInteger }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'creator_id', to: 'creator_id', transform: parseInteger },
      { from: 'active', to: 'active', transform: Boolean },
      { from: 'folder_name', to: 'folder_name' },
      { from: 'folder_display_name', to: 'folder_display_name' },
      { from: 'description', to: 'description' },
      { from: 'business_id', to: 'business_id', transform: parseInteger },
      { from: 'project_id', to: 'project_id', transform: parseInteger }
    ]
  };
}

export class file_permission extends BaseModel implements FilePermissionShape {
  creator_id: number = 0;
  active: boolean = true;
  file_id: number = 0;
  user_id: number = 0;
  permission_type: string[] = [];

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'creator_id', to: 'creator_id', transform: parseInteger },
      { from: 'active', to: 'active', transform: Boolean },
      { from: 'file_id', to: 'file_id', transform: parseInteger },
      { from: 'user_id', to: 'user_id', transform: parseInteger },
      {
        from: 'permission_type',
        to: 'permission_type',
        transform: parseArrayString
      }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'creator_id', to: 'creator_id', transform: parseInteger },
      { from: 'active', to: 'active', transform: Boolean },
      { from: 'file_id', to: 'file_id', transform: parseInteger },
      { from: 'user_id', to: 'user_id', transform: parseInteger },
      {
        from: 'permission_type',
        to: 'permission_type',
        transform: parseArrayString
      }
    ]
  };
}

export class default_Cost_Codes
  extends BaseModel
  implements DefaultCostCodesShape
{
  creator_id: number = 0;
  active: boolean = true;
  cost_code: string = '';
  task_code: string = '';
  description: string = '';
  unit: string = '';
  unit_cost: number = 0;
  cost_type: string = '';
  builder_cost: number = 0;
  markup: number = 0;
  owner_price: number = 0;
  margin_percent: number = 0;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'creator_id', to: 'creator_id', transform: parseInteger },
      { from: 'active', to: 'active', transform: Boolean },
      { from: 'cost_code', to: 'cost_code' },
      { from: 'task_code', to: 'task_code' },
      { from: 'description', to: 'description' },
      { from: 'unit', to: 'unit' },
      { from: 'unit_cost', to: 'unit_cost', transform: parseFloat },
      { from: 'cost_type', to: 'cost_type' },
      { from: 'builder_cost', to: 'builder_cost', transform: parseFloat },
      { from: 'markup', to: 'markup', transform: parseFloat },
      { from: 'owner_price', to: 'owner_price', transform: parseFloat },
      { from: 'margin_percent', to: 'margin_percent', transform: parseFloat }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'creator_id', to: 'creator_id', transform: parseInteger },
      { from: 'active', to: 'active', transform: Boolean },
      { from: 'cost_code', to: 'cost_code' },
      { from: 'task_code', to: 'task_code' },
      { from: 'description', to: 'description' },
      { from: 'unit', to: 'unit' },
      { from: 'unit_cost', to: 'unit_cost', transform: formatFloatForAPI },
      { from: 'cost_type', to: 'cost_type' },
      {
        from: 'builder_cost',
        to: 'builder_cost',
        transform: formatFloatForAPI
      },
      { from: 'markup', to: 'markup', transform: formatFloatForAPI },
      { from: 'owner_price', to: 'owner_price', transform: formatFloatForAPI },
      {
        from: 'margin_percent',
        to: 'margin_percent',
        transform: formatFloatForAPI
      }
    ]
  };
}

export type UserProfileShape = GenericModelShape &
  Omit<UserProfile, keyof GenericModelShape>;
export type BusinessShape = GenericModelShape &
  Omit<Business, keyof GenericModelShape>;
export type ProjectShape = GenericModelShape &
  Omit<Project, keyof GenericModelShape>;
export type FileShape = GenericModelShape & Omit<File, keyof GenericModelShape>;
export type FolderCodesShape = GenericModelShape &
  Omit<Folder_Codes, keyof GenericModelShape>;
export type UserShape = GenericModelShape & Omit<User, keyof GenericModelShape>;
export type FilePermissionShape = GenericModelShape &
  Omit<file_permission, keyof GenericModelShape>;
export type DefaultCostCodesShape = GenericModelShape &
  Omit<default_Cost_Codes, keyof GenericModelShape>;

export const USER_PROFILE_UNIQUE_KEY: keyof UserProfileShape = 'user_id';

export const userProfileMapping = UserProfile.baseMapping;
export const businessMapping = Business.baseMapping;
export const projectMapping = Project.baseMapping;
export const fileMapping = File.baseMapping;
export const folderCodesMapping = Folder_Codes.baseMapping;
export const userMapping = User.baseMapping;
export const filePermissionMapping = file_permission.baseMapping;
export const defaultCostCodesMapping = default_Cost_Codes.baseMapping;
