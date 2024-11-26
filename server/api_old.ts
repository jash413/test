import { updateUser } from './auth/user';
import { createModelConverters, ModelMapping } from './converter';
import {
  GenericModelService,
  GenericModelShape,
  uploadFile
} from './generic-model-service';
import {
  UserProfileShape,
  BusinessShape,
  ProjectShape,
  FileShape,
  FolderCodesShape,
  UserShape,
  FilePermissionShape,
  userProfileMapping,
  businessMapping,
  projectMapping,
  fileMapping,
  folderCodesMapping,
  userMapping,
  filePermissionMapping,
  USER_PROFILE_UNIQUE_KEY
} from './types/mappings';

const USER_PROFILE_ENDPOINT = '/zen/user_Profile';
const BUSINESS_PROFILE_ENDPOINT = '/zen/business';
const PROJECT_ENDPOINT = '/zen/project';
const FILE_ENDPOINT = '/zen/file';
const FOLDER_CODES_ENDPOINT = '/zen/folder_Codes';
const USER_ENDPOINT = '/zen/user';
const FILE_PERMISSION_ENDPOINT = '/zen/file_Permissions';

export const userProfileService = new GenericModelService<UserProfileShape>(
  USER_PROFILE_ENDPOINT,
  userProfileMapping,
  USER_PROFILE_UNIQUE_KEY
);

export const businessService = new GenericModelService<BusinessShape>(
  BUSINESS_PROFILE_ENDPOINT,
  businessMapping
);

export const projectService = new GenericModelService<ProjectShape>(
  PROJECT_ENDPOINT,
  projectMapping
);

export const fileService = new GenericModelService<FileShape>(
  FILE_ENDPOINT,
  fileMapping
);

export const folderCodesService = new GenericModelService<FolderCodesShape>(
  FOLDER_CODES_ENDPOINT,
  folderCodesMapping
);

export const userService = new GenericModelService<UserShape>(
  USER_ENDPOINT,
  userMapping
);

export const filePermissionService =
  new GenericModelService<FilePermissionShape>(
    FILE_PERMISSION_ENDPOINT,
    filePermissionMapping
  );

function createModelOperations<T extends GenericModelShape>(
  service: GenericModelService<T>,
  mapping: ModelMapping,
  uniqueKey?: any
) {
  const converters = createModelConverters<T, T>(service.apiEndpoint, mapping);
  let localUniqueKey = uniqueKey;
  if (localUniqueKey === undefined) {
    localUniqueKey = 'id';
  }

  return {
    upsert: (model: T, token: string) => service.upsert(model, token),
    get: async (uniqueValue: any, token: string) => {
      const items = await service.list(
        { filter: { [localUniqueKey]: uniqueValue } },
        token
      );
      return items && items.length > 0 ? items[0] : null;
    },
    update: (id: number, partialModel: Partial<T>, token: string) =>
      service.update(id, partialModel, token),
    delete: (id: number, token: string) => service.delete(id, token),
    list: (params: Record<string, any>, token: string) =>
      service.list(params, token),
    fromFormData: (formData: FormData): T => converters.fromFormData(formData),
    toFormData: (model: T): FormData => converters.toFormData(model)
  };
}

// User Profile operations
const userProfileOperations = createModelOperations<UserProfileShape>(
  userProfileService,
  userProfileMapping,
  USER_PROFILE_UNIQUE_KEY
);

// Wrapper function for upsertUserProfile
export const upsertUserProfile = async (
  model: UserProfileShape,
  token: string
) => {
  const result = await userProfileOperations.upsert(model, token);
  if (result) {
    // Additional code to run after successful upsert
    const updatedUserData = { profile_created: true, name: model.name };

    const updatedUser = await updateUser(
      result.user_id,
      token,
      updatedUserData
    );
    // You can add more code here, like updating local state, triggering other actions, etc.
  }
  return result;
};

export const getUserProfile = userProfileOperations.get;
export const updateUserProfile = userProfileOperations.update;
export const deleteUserProfile = userProfileOperations.delete;
export const listUserProfiles = userProfileOperations.list;
export const userProfileFromFormData = userProfileOperations.fromFormData;
export const userProfileToFormData = userProfileOperations.toFormData;

// Business Profile operations
const businessOperations = createModelOperations<BusinessShape>(
  businessService,
  businessMapping
);

// Wrapper function for upsertUserProfile
export const upsertBusiness = async (
  model: UserProfileShape,
  token: string
) => {
  const result = await businessOperations.upsert(model, token);
  if (result) {
    // Additional code to run after successful upsert
    const updatedUserData = { user_fully_onboarded: true };

    const updatedUser = await updateUser(
      result.creator_id,
      token,
      updatedUserData
    );
    // You can add more code here, like updating local state, triggering other actions, etc.
  }
  return result;
};

export const getBusiness = businessOperations.get;
export const updateBusiness = businessOperations.update;
export const deleteBusiness = businessOperations.delete;
export const listBusinesses = businessOperations.list;
export const businessFromFormData = businessOperations.fromFormData;
export const businessToFormData = businessOperations.toFormData;

const projectOperations = createModelOperations<ProjectShape>(
  projectService,
  projectMapping
);

// Project operations
export const upsertProject = projectOperations.upsert;
export const getProject = projectOperations.get;
export const updateProject = projectOperations.update;
export const deleteProject = projectOperations.delete;
export const listProjects = projectOperations.list;
export const projectFromFormData = projectOperations.fromFormData;
export const projectToFormData = projectOperations.toFormData;

export const upload = uploadFile;

const fileManagementOperations = createModelOperations<FileShape>(
  fileService,
  fileMapping
);

export const upsertFile = fileManagementOperations.upsert;
export const getFile = fileManagementOperations.get;
export const updateFile = fileManagementOperations.update;
export const deleteFile = fileManagementOperations.delete;
export const listFiles = fileManagementOperations.list;
export const fileFromFormData = fileManagementOperations.fromFormData;

const folderCodesOperations = createModelOperations<FolderCodesShape>(
  folderCodesService,
  folderCodesMapping
);

export const upsertFolderCode = folderCodesOperations.upsert;
export const getFolderCode = folderCodesOperations.get;
export const updateFolderCode = folderCodesOperations.update;
export const deleteFolderCode = folderCodesOperations.delete;
export const listFolderCodes = folderCodesOperations.list;
export const folderCodeFromFormData = folderCodesOperations.fromFormData;
export const folderCodeToFormData = folderCodesOperations.toFormData;

const userOperations = createModelOperations<UserShape>(
  userService,
  userMapping
);

export const upsertMainUser = userOperations.upsert;
export const getMainUser = userOperations.get;
export const updateMainUser = userOperations.update;
export const deleteMainUser = userOperations.delete;
export const listMainUsers = userOperations.list;
export const mainUserFromFormData = userOperations.fromFormData;
export const mainUserToFormData = userOperations.toFormData;

const filePermissionOperations = createModelOperations<FilePermissionShape>(
  filePermissionService,
  filePermissionMapping
);

export const upsertFilePermission = filePermissionOperations.upsert;
export const getFilePermission = filePermissionOperations.get;
export const updateFilePermission = filePermissionOperations.update;
export const deleteFilePermission = filePermissionOperations.delete;
export const listFilePermissions = filePermissionOperations.list;
export const filePermissionFromFormData = filePermissionOperations.fromFormData;
export const filePermissionToFormData = filePermissionOperations.toFormData;
