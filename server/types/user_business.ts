import { ModelMapping } from '../converter';
import { parseInteger, parseArrayString } from '@/server/utils/parsers';
import { BaseModel, GenericModelShape } from './base_mapping';

export class UserProfile extends BaseModel implements UserProfileShape {
  user_id: number = 0;
  bio: string | null = null;
  website: string | null = null;
  social_media_links: any | null = null;
  home_owner_interests: string | null = null;
  name: string | null = null;
  address: string | null = null;
  address1: string | null = null;
  address2: string | null = null;
  state: string | null = null;
  zipcode: string | null = null;
  referral_code: string | null = null;
  referred_by: string | null = null;
  date_of_birth: Date | null = null;
  profile_image?: JSON;

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
      },
      { from: 'address', to: 'address' },
      {
        from: 'profile_image',
        to: 'profile_image',
        transform: (v) => (v ? JSON.parse(v as string) : null)
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
      { from: 'address', to: 'address' },
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
      },
      { from: 'profile_image', to: 'profile_image' }
    ]
  };
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
  trade_types?: string[];
  license_info?: string;
  insurance_info?: string;
  workers_comp_info?: string;
  tax_id?: string;
  license_document?: JSON;
  insurance_document?: JSON;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'type', to: 'type' },
      { from: 'name', to: 'name' },
      { from: 'structure', to: 'structure' },
      { from: 'years_in_business', to: 'years_in_business', transform: Number },
      { from: 'website', to: 'website' },
      { from: 'address', to: 'address' },
      { from: 'email', to: 'email' },
      { from: 'phone', to: 'phone' },
      {
        from: 'specializations',
        to: 'specializations',
        transform: parseArrayString
      },
      {
        from: 'trade_types',
        to: 'trade_types',
        transform: parseArrayString
      },
      { from: 'license_info', to: 'license_info' },
      { from: 'insurance_info', to: 'insurance_info' },
      { from: 'workers_comp_info', to: 'workers_comp_info' },
      { from: 'tax_id', to: 'tax_id' },
      {
        from: 'license_document',
        to: 'license_document',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      },
      {
        from: 'insurance_document',
        to: 'insurance_document',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      }
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
      { from: 'trade_types', to: 'trade_types' },
      { from: 'license_info', to: 'license_info' },
      { from: 'insurance_info', to: 'insurance_info' },
      { from: 'workers_comp_info', to: 'workers_comp_info' },
      { from: 'tax_id', to: 'tax_id' },
      { from: 'license_document', to: 'license_document' },
      { from: 'insurance_document', to: 'insurance_document' }
    ]
  };
}

export class BusinessUserRoles extends BaseModel {
  user_id: number = 0;
  business_id: number | null = null;
  role_codes: string[] = [];

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'user_id', to: 'user_id', transform: parseInteger },
      { from: 'business_id', to: 'business_id', transform: parseInteger },
      {
        from: 'role_codes',
        to: 'role_codes',
        transform: (v) => (v ? JSON.parse(v as string) : [])
      }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'user_id', to: 'user_id' },
      { from: 'business_id', to: 'business_id' },
      { from: 'role_codes', to: 'role_codes', transform: JSON.stringify }
    ]
  };
}

export class BusinessRolesPermissions extends BaseModel {
  role_code: string = '';
  role_name: string = '';
  feature: string = '';
  feature_permissions: any = {};
  business_id: number = 0;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'role_code', to: 'role_code' },
      { from: 'role_name', to: 'role_name' },
      { from: 'feature_permissions', to: 'feature_permissions' },
      { from: 'permission', to: 'permission' },
      { from: 'business_id', to: 'business_id', transform: parseInteger }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'role_code', to: 'role_code' },
      { from: 'role_name', to: 'role_name' },
      { from: 'feature_permissions', to: 'feature_permissions' },
      { from: 'permission', to: 'permission' },
      { from: 'business_id', to: 'business_id' }
    ]
  };
}

export class ProjectAssignments extends BaseModel {
  user_id: number = 0;
  project_id: number = 0;
  trades_type: string = '';
  task_descriptions: string[] = [];
  permissions: any = {};

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'user_id', to: 'user_id', transform: parseInteger },
      { from: 'project_id', to: 'project_id', transform: parseInteger },
      { from: 'trades_type', to: 'trades_type' },
      {
        from: 'task_descriptions',
        to: 'task_descriptions',
        transform: (v) => (v ? JSON.parse(v as string) : [])
      },
      {
        from: 'permissions',
        to: 'permissions',
        transform: (v) => (v ? JSON.parse(v as string) : {})
      }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'user_id', to: 'user_id' },
      { from: 'project_id', to: 'project_id' },
      { from: 'trades_type', to: 'trades_type' },
      {
        from: 'task_descriptions',
        to: 'task_descriptions',
        transform: JSON.stringify
      },
      { from: 'permissions', to: 'permissions', transform: JSON.stringify }
    ]
  };
}

export type UserProfileShape = GenericModelShape &
  Omit<UserProfile, keyof GenericModelShape>;
export type BusinessShape = GenericModelShape &
  Omit<Business, keyof GenericModelShape>;
export type BusinessUserRolesShape = GenericModelShape &
  Omit<BusinessUserRoles, keyof GenericModelShape>;
export type BusinessRolesPermissionsShape = GenericModelShape &
  Omit<BusinessRolesPermissions, keyof GenericModelShape>;
export type ProjectAssignmentsShape = GenericModelShape &
  Omit<ProjectAssignments, keyof GenericModelShape>;

export const USER_PROFILE_UNIQUE_KEY: keyof UserProfileShape = 'user_id';

export const userProfileMapping = UserProfile.baseMapping;
export const businessMapping = Business.baseMapping;

export const businessUserRolesMapping = BusinessUserRoles.baseMapping;
export const businessRolesPermissionsMapping =
  BusinessRolesPermissions.baseMapping;
export const projectAssignmentsMapping = ProjectAssignments.baseMapping;
