// File: server/api.ts

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
  businessUserRolesMapping,
  businessRolesPermissionsMapping,
  projectAssignmentsMapping,
  userProfileMapping,
  businessMapping,
  USER_PROFILE_UNIQUE_KEY
} from './types/user_business';

import {
  folderCodesMapping,
  fileMapping,
  filePermissionsMapping,
  uploadMapping
} from './types/files';

import {
  projectMapping,
  taskMapping,
  subTaskMapping,
  punchListMapping,
  dailyLogMapping,
  progressionNotesMapping,
  changeOrderMapping,
  inspirationMapping,
  purchaseOrderMapping,
  specificationMapping,
  specificationCodeMapping
} from './types/project';
import { defaultCostCodesMapping, userMapping } from './types/mappings';
import { endOfDay } from 'date-fns';

const ENDPOINTS = {
  USER_PROFILE: '/zen/user_Profile',
  BUSINESS: '/zen/business',
  PROJECT: '/zen/project',
  FOLDER_CODES: '/zen/folder_Codes',
  FILE: '/zen/file',
  FILE_PERMISSIONS: '/zen/file_Permissions',
  BUSINESS_USER_ROLES: '/zen/business_User_Roles',
  BUSINESS_ROLES_PERMISSIONS: '/zen/business_Roles_Permissions',
  PROJECT_ASSIGNMENTS: '/zen/project_assignments',
  TASK: '/zen/task',
  SUB_TASK: '/zen/sub_tasks',
  PUNCH_LIST: '/zen/punch_List',
  DAILY_LOG: '/zen/daily_logs',
  PROGRESSION_NOTES: '/zen/progression_Notes',
  CHANGE_ORDER: '/zen/change_Order',
  PURCHASE_ORDER: '/zen/purchase_Order',
  INSPIRATION: '/zen/inspiration',
  UPLOAD: '/zen/upload',
  USER: '/zen/user',
  DEFAULT_COST_CODES: '/zen/default_Cost_Codes',
  SPECIFICATIONS: '/zen/specification',
  SPECIFICATIONSCODES: '/zen/specification_Codes'
};

type ServiceConfig<T extends GenericModelShape> = {
  endpoint: string;
  mapping: ModelMapping;
  uniqueKey?: keyof T;
};

const serviceConfigs: Record<string, ServiceConfig<any>> = {
  userProfile: {
    endpoint: ENDPOINTS.USER_PROFILE,
    mapping: userProfileMapping,
    uniqueKey: USER_PROFILE_UNIQUE_KEY
  },
  business: { endpoint: ENDPOINTS.BUSINESS, mapping: businessMapping },
  project: { endpoint: ENDPOINTS.PROJECT, mapping: projectMapping },
  task: { endpoint: ENDPOINTS.TASK, mapping: taskMapping },
  subTask: { endpoint: ENDPOINTS.SUB_TASK, mapping: subTaskMapping },
  punchList: { endpoint: ENDPOINTS.PUNCH_LIST, mapping: punchListMapping },
  dailyLog: { endpoint: ENDPOINTS.DAILY_LOG, mapping: dailyLogMapping },
  progressionNotes: {
    endpoint: ENDPOINTS.PROGRESSION_NOTES,
    mapping: progressionNotesMapping
  },
  changeOrder: {
    endpoint: ENDPOINTS.CHANGE_ORDER,
    mapping: changeOrderMapping
  },
  purchaseOrder: {
    endpoint: ENDPOINTS.PURCHASE_ORDER,
    mapping: purchaseOrderMapping
  },
  folderCodes: {
    endpoint: ENDPOINTS.FOLDER_CODES,
    mapping: folderCodesMapping
  },
  file: { endpoint: ENDPOINTS.FILE, mapping: fileMapping },
  filePermissions: {
    endpoint: ENDPOINTS.FILE_PERMISSIONS,
    mapping: filePermissionsMapping
  },
  businessUserRoles: {
    endpoint: ENDPOINTS.BUSINESS_USER_ROLES,
    mapping: businessUserRolesMapping
  },
  businessRolesPermissions: {
    endpoint: ENDPOINTS.BUSINESS_ROLES_PERMISSIONS,
    mapping: businessRolesPermissionsMapping
  },
  projectAssignments: {
    endpoint: ENDPOINTS.PROJECT_ASSIGNMENTS,
    mapping: projectAssignmentsMapping
  },
  inspiration: { endpoint: ENDPOINTS.INSPIRATION, mapping: inspirationMapping },
  upload: { endpoint: ENDPOINTS.UPLOAD, mapping: uploadMapping },
  user: { endpoint: ENDPOINTS.USER, mapping: userMapping },
  defaultCostCodes: {
    endpoint: ENDPOINTS.DEFAULT_COST_CODES,
    mapping: defaultCostCodesMapping
  },
  specifications: {
    endpoint: ENDPOINTS.SPECIFICATIONS,
    mapping: specificationMapping
  },
  specificationCodes: {
    endpoint: ENDPOINTS.SPECIFICATIONSCODES,
    mapping: specificationCodeMapping
  }
};

function createServiceOperations<T extends GenericModelShape>(
  config: ServiceConfig<T>
) {
  const service = new GenericModelService<T>(
    config.endpoint,
    config.mapping,
    config.uniqueKey
  );
  const converters = createModelConverters<T, T>(
    config.endpoint,
    config.mapping
  );
  const uniqueKey = config.uniqueKey || 'id';

  return {
    upsert: (model: T, token: string) => service.upsert(model, token),
    get: async (uniqueValue: any, token: string) => {
      const items = await service.list(
        { filter: { [uniqueKey]: uniqueValue } },
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

const services = Object.entries(serviceConfigs).reduce(
  (acc, [key, config]) => {
    acc[key] = createServiceOperations(config);
    return acc;
  },
  {} as Record<string, ReturnType<typeof createServiceOperations>>
);

// Special upsert functions
export const upsertUserProfile = async (
  model: UserProfileShape,
  token: string
) => {
  const result = await services.userProfile.upsert(model as any, token);
  if (result) {
    const updatedUserData = { profile_created: true, name: model.name };
    await updateUser(result.user_id, token, updatedUserData);
  }
  return result;
};

export const upsertBusiness = async (model: BusinessShape, token: string) => {
  const result = await services.business.upsert(model as any, token);
  if (result) {
    const updatedUserData = { user_fully_onboarded: true };
    await updateUser(result.creator_id, token, updatedUserData);
  }
  return result;
};

// Export all operations
export const {
  userProfile: {
    get: getUserProfile,
    update: updateUserProfile,
    delete: deleteUserProfile,
    list: listUserProfiles,
    fromFormData: userProfileFromFormData,
    toFormData: userProfileToFormData
  },
  business: {
    get: getBusiness,
    update: updateBusiness,
    delete: deleteBusiness,
    list: listBusinesses,
    fromFormData: businessFromFormData,
    toFormData: businessToFormData
  },
  businessUserRoles: {
    upsert: upsertBusinessUserRoles,
    get: getBusinessUserRoles,
    update: updateBusinessUserRoles,
    delete: deleteBusinessUserRoles,
    list: listBusinessUserRoles,
    fromFormData: businessUserRolesFromFormData,
    toFormData: businessUserRolesToFormData
  },
  businessRolesPermissions: {
    upsert: upsertBusinessRolesPermissions,
    get: getBusinessRolesPermissions,
    update: updateBusinessRolesPermissions,
    delete: deleteBusinessRolesPermissions,
    list: listBusinessRolesPermissions,
    fromFormData: businessRolesPermissionsFromFormData,
    toFormData: businessRolesPermissionsToFormData
  },
  projectAssignments: {
    upsert: upsertProjectAssignments,
    get: getProjectAssignments,
    update: updateProjectAssignments,
    delete: deleteProjectAssignments,
    list: listProjectAssignments,
    fromFormData: projectAssignmentsFromFormData,
    toFormData: projectAssignmentsToFormData
  },
  folderCodes: {
    upsert: upsertFolderCodes,
    get: getFolderCodes,
    update: updateFolderCodes,
    delete: deleteFolderCodes,
    list: listFolderCodes,
    fromFormData: folderCodesFromFormData,
    toFormData: folderCodesToFormData
  },
  file: {
    upsert: upsertFile,
    get: getFile,
    update: updateFile,
    delete: deleteFile,
    list: listFiles,
    fromFormData: fileFromFormData,
    toFormData: fileToFormData
  },
  filePermissions: {
    upsert: upsertFilePermissions,
    get: getFilePermissions,
    update: updateFilePermissions,
    delete: deleteFilePermissions,
    list: listFilePermissions,
    fromFormData: filePermissionsFromFormData,
    toFormData: filePermissionsToFormData
  },
  project: {
    upsert: upsertProject,
    get: getProject,
    update: updateProject,
    delete: deleteProject,
    list: listProjects,
    fromFormData: projectFromFormData,
    toFormData: projectToFormData
  },
  task: {
    upsert: upsertTask,
    get: getTask,
    update: updateTask,
    delete: deleteTask,
    list: listTasks,
    fromFormData: taskFromFormData,
    toFormData: taskToFormData
  },
  subTask: {
    upsert: upsertSubTask,
    get: getSubTask,
    update: updateSubTask,
    delete: deleteSubTask,
    list: listSubTasks,
    fromFormData: subTaskFromFormData,
    toFormData: subTaskToFormData
  },
  punchList: {
    upsert: upsertPunchList,
    get: getPunchList,
    update: updatePunchList,
    delete: deletePunchList,
    list: listPunchLists,
    fromFormData: punchListFromFormData,
    toFormData: punchListToFormData
  },
  dailyLog: {
    upsert: upsertDailyLog,
    get: getDailyLog,
    update: updateDailyLog,
    delete: deleteDailyLog,
    list: listDailyLogs,
    fromFormData: dailyLogFromFormData,
    toFormData: dailyLogToFormData
  },
  progressionNotes: {
    upsert: upsertProgressionNotes,
    get: getProgressionNotes,
    update: updateProgressionNotes,
    delete: deleteProgressionNotes,
    list: listProgressionNotes,
    fromFormData: progressionNotesFromFormData,
    toFormData: progressionNotesToFormData
  },
  changeOrder: {
    upsert: upsertChangeOrder,
    get: getChangeOrder,
    update: updateChangeOrder,
    delete: deleteChangeOrder,
    list: listChangeOrders,
    fromFormData: changeOrderFromFormData,
    toFormData: changeOrderToFormData
  },
  purchaseOrder: {
    upsert: upsertPurchaseOrder,
    get: getPurchaseOrder,
    update: updatePurchaseOrder,
    delete: deletePurchaseOrder,
    list: listPurchaseOrders,
    fromFormData: purchaseOrderFromFormData,
    toFormData: purchaseOrderToFormData
  },
  inspiration: {
    upsert: upsertInspiration,
    get: getInspiration,
    update: updateInspiration,
    delete: deleteInspiration,
    list: listInspirations,
    fromFormData: inspirationFromFormData,
    toFormData: inspirationToFormData
  },
  upload: {
    upsert: uploadFiles,
    get: getUpload,
    update: updateUpload,
    delete: deleteUpload,
    list: listUploads,
    fromFormData: uploadFromFormData,
    toFormData: uploadToFormData
  },
  user: {
    upsert: upsertUser,
    get: getUser,
    update: updateListUser,
    delete: deleteUser,
    list: listUsers,
    fromFormData: userFromFormData,
    toFormData: userToFormData
  },
  defaultCostCodes: {
    upsert: upsertDefaultCostCodes,
    get: getDefaultCostCodes,
    update: updateDefaultCostCodes,
    delete: deleteDefaultCostCodes,
    list: listDefaultCostCodes,
    fromFormData: defaultCostCodesFromFormData,
    toFormData: defaultCostCodesToFormData
  },
  specifications: {
    upsert: upsertSpecification,
    get: getSpecification,
    update: updateSpecification,
    delete: deleteSpecification,
    list: listSpecifications,
    fromFormData: specificationFromFormData,
    toFormData: specificationToFormData
  },
  specificationCodes: {
    upsert: upsertSpecificationCodes,
    get: getSpecificationCodes,
    update: updateSpecificationCodes,
    delete: deleteSpecificationCodes,
    list: listSpecificationCodes,
    fromFormData: specificationCodesFromFormData,
    toFormData: specificationCodesToFormData
  }
} = services;

export const upload = uploadFile;
