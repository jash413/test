// File: app/lib/model-configs.ts

import {
  getUserProfile,
  getBusiness,
  getProject,
  listUserProfiles,
  listBusinesses,
  listProjects,
  deleteUserProfile,
  deleteBusiness,
  deleteProject,
  upsertUserProfile,
  upsertBusiness,
  upsertProject,
  updateUserProfile,
  updateBusiness,
  updateProject,
  userProfileFromFormData,
  businessFromFormData,
  projectFromFormData
} from '@/server/api_old';
import {
  UserProfileShape,
  BusinessShape,
  ProjectShape
} from '@/server/types/mappings';

export interface ModelConfig<T> {
  listFunction: (
    params: Record<string, any>,
    token: string
  ) => Promise<T[] | undefined>;
  getFunction: (id: number, token: string) => Promise<T | null>;
  deleteFunction: (id: number, token: string) => Promise<void>;
  upsertFunction: (model: T, token: string) => Promise<T | undefined>;
  updateFunction: (
    id: number,
    partialModel: Partial<T>,
    token: string
  ) => Promise<T | undefined>;
  fromFormData: (formData: FormData) => T;
  idField: keyof T;
}

type GenericFunctions<T> = {
  list: (
    params: Record<string, any>,
    token: string
  ) => Promise<T[] | undefined>;
  get: (id: number, token: string) => Promise<T | null>;
  delete: (id: number, token: string) => Promise<void>;
  upsert: (model: T, token: string) => Promise<T | undefined>;
  update: (
    id: number,
    partialModel: Partial<T>,
    token: string
  ) => Promise<T | undefined>;
  fromFormData: (formData: FormData) => T;
};

export function createModelConfig<T>(
  functions: GenericFunctions<T>,
  idField: keyof T = 'id' as keyof T
): ModelConfig<T> {
  return {
    listFunction: functions.list,
    getFunction: functions.get,
    deleteFunction: functions.delete,
    upsertFunction: functions.upsert,
    updateFunction: functions.update,
    fromFormData: functions.fromFormData,
    idField
  };
}

export type ModelType = 'user_Profile' | 'business' | 'project'; // Add your other model types here

export const modelConfigs: Record<ModelType, ModelConfig<any>> = {
  user_Profile: createModelConfig<UserProfileShape>(
    {
      list: listUserProfiles,
      get: getUserProfile,
      delete: deleteUserProfile,
      upsert: upsertUserProfile,
      update: updateUserProfile,
      fromFormData: userProfileFromFormData
    },
    'user_id'
  ),
  business: createModelConfig<BusinessShape>({
    list: listBusinesses,
    get: getBusiness,
    delete: deleteBusiness,
    upsert: upsertBusiness,
    update: updateBusiness,
    fromFormData: businessFromFormData
  }),
  project: createModelConfig<ProjectShape>({
    list: listProjects,
    get: getProject,
    delete: deleteProject,
    upsert: upsertProject,
    update: updateProject,
    fromFormData: projectFromFormData
  })
  // Add your other models here following the same pattern
};
