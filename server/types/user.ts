import { ModelMapping } from '../converter';
import { parseInteger, parseArrayString } from '@/server/utils/parsers';
import { BaseModel, GenericModelShape } from './base_mapping';

// creator_id: 59,
//     active: true,
//     email: 'gaurang2@gmail.com',
//     name: 'gaurang',
//     first_name: null,
//     middle_name: null,
//     last_name: null,
//     image: null,
//     phone_number_mobile: '9875139782',
//     text_enabled: false,
//     phone_verified: '2024-08-25T19:56:38.213Z',
//     phone_number_home: null,
//     email_verified: '2024-07-20T20:12:27.874Z',
//     admin: false,
//     status: 'active',
//     language: [],
//     profile_created: true,
//     user_fully_onboarded: true,
//     user_type: null,
//     address1: null,
//     address2: null,
//     state: null,
//     zipcode: null,
//     date_of_birth: null

export class User extends BaseModel implements UserShape {
  // user_id: number = 0;
  // bio: string | null = null;
  // website: string | null = null;
  // social_media_links: any | null = null;
  // home_owner_interests: string | null = null;
  // address1: string | null = null;
  // address2: string | null = null;
  // state: string | null = null;
  // zipcode: string | null = null;
  // referral_code: string | null = null;
  // referred_by: string | null = null;
  // date_of_birth: Date | null = null;

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
      {
        from: 'phone_verified',
        to: 'phone_verified',
        transform: (v) => (v ? new Date(v as string) : null)
      },
      { from: 'phone_number_home', to: 'phone_number_home' },
      {
        from: 'email_verified',
        to: 'email_verified',
        transform: (v) => (v ? new Date(v as string) : null)
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
        transform: (v) => (v ? new Date(v as string) : null)
      }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'creator_id', to: 'creator_id' },
      { from: 'active', to: 'active' },
      { from: 'email', to: 'email' },
      { from: 'name', to: 'name' },
      { from: 'first_name', to: 'first_name' },
      { from: 'middle_name', to: 'middle_name' },
      { from: 'last_name', to: 'last_name' },
      { from: 'image', to: 'image' },
      { from: 'phone_number_mobile', to: 'phone_number_mobile' },
      { from: 'text_enabled', to: 'text_enabled' },
      {
        from: 'phone_verified',
        to: 'phone_verified',
        transform: (v) => (v ? (v as Date).toISOString() : null)
      },
      { from: 'phone_number_home', to: 'phone_number_home' },
      {
        from: 'email_verified',
        to: 'email_verified',
        transform: (v) => (v ? (v as Date).toISOString() : null)
      },
      { from: 'admin', to: 'admin' },
      { from: 'status', to: 'status' },
      { from: 'language', to: 'language', transform: (v) => v.join(',') },
      { from: 'profile_created', to: 'profile_created' },
      { from: 'user_fully_onboarded', to: 'user_fully_onboarded' },
      { from: 'user_type', to: 'user_type' },
      { from: 'address1', to: 'address1' },
      { from: 'address2', to: 'address2' },
      { from: 'state', to: 'state' },
      { from: 'zipcode', to: 'zipcode' },
      {
        from: 'date_of_birth',
        to: 'date_of_birth',
        transform: (v) => (v ? (v as Date).toISOString() : null)
      }
    ]
  };
}

export type UserShape = GenericModelShape & Omit<User, keyof GenericModelShape>;

export const userMapping = User.baseMapping;
