import * as api from '@/server/api';
import {
  UserProfileShape,
  BusinessShape,
  ProjectAssignmentsShape,
  BusinessUserRolesShape,
  BusinessRolesPermissionsShape
} from '@/server/types/user_business';
import {
  FolderCodesShape,
  FileShape,
  FilePermissionsShape,
  UploadShape
} from '@/server/types/files';

import {
  ProjectShape,
  TaskShape,
  SubTaskShape,
  PunchListShape,
  DailyLogShape,
  ProgressionNotesShape,
  ChangeOrderShape,
  InspirationShape,
  PurchaseOrderShape,
  SpecificationShape,
  SpecificationCodeShape
} from '@/server/types/project';
import { UserShape } from './types/user';
import { DefaultCostCodesShape } from './types/mappings';

export interface ModelConfig<T> {
  listFunction: (
    params: Record<string, any>,
    token: string
  ) => Promise<T[] | undefined>;
  getFunction: (
    uniqueValue: any,
    token: string
  ) => Promise<T | null | undefined>;
  deleteFunction: (id: number, token: string) => Promise<void>;
  upsertFunction: (model: T, token: string) => Promise<T | undefined>;
  updateFunction: (
    id: number,
    partialModel: Partial<T>,
    token: string
  ) => Promise<T | undefined>;
  fromFormData: (formData: FormData) => T;
  fileFields?: string[];
  idField: keyof T;
}

export type ModelType =
  | 'user_Profile'
  | 'business'
  | 'project'
  | 'business_User_Roles'
  | 'business_Roles_Permissions'
  | 'project_assignments'
  | 'folder_Codes'
  | 'file'
  | 'file_Permissions'
  | 'task'
  | 'subTask'
  | 'punchList'
  | 'dailyLog'
  | 'progressionNotes'
  | 'changeOrder'
  | 'purchaseOrder'
  | 'inspiration'
  | 'specification'
  | 'specificationCodes'
  | 'upload'
  | 'user';
// | 'default_Cost_Codes';

type ShapeMap = {
  user_Profile: UserProfileShape;
  business: BusinessShape;
  project: ProjectShape;
  business_User_Roles: BusinessUserRolesShape;
  business_Roles_Permissions: BusinessRolesPermissionsShape;
  project_assignments: ProjectAssignmentsShape;
  folder_Codes: FolderCodesShape;
  file: FileShape;
  file_Permissions: FilePermissionsShape;
  task: TaskShape;
  subTask: SubTaskShape;
  punchList: PunchListShape;
  dailyLog: DailyLogShape;
  progressionNotes: ProgressionNotesShape;
  changeOrder: ChangeOrderShape;
  inspiration: InspirationShape;
  specification: SpecificationShape;
  specificationCodes: SpecificationCodeShape;
  upload: UploadShape;
  user: UserShape;
  purchaseOrder: PurchaseOrderShape;
  // default_Cost_Codes: DefaultCostCodesShape;
};

const modelConfigsData: {
  [K in ModelType]: {
    idField?: keyof ShapeMap[K];
    listFunction: keyof typeof api;
    getFunction: keyof typeof api;
    deleteFunction: keyof typeof api;
    upsertFunction: keyof typeof api;
    updateFunction: keyof typeof api;
    fromFormData: keyof typeof api;
  };
} = {
  user_Profile: {
    idField: 'user_id',
    listFunction: 'listUserProfiles',
    getFunction: 'getUserProfile',
    deleteFunction: 'deleteUserProfile',
    upsertFunction: 'upsertUserProfile',
    updateFunction: 'updateUserProfile',
    fromFormData: 'userProfileFromFormData'
  },
  business: {
    listFunction: 'listBusinesses',
    getFunction: 'getBusiness',
    deleteFunction: 'deleteBusiness',
    upsertFunction: 'upsertBusiness',
    updateFunction: 'updateBusiness',
    fromFormData: 'businessFromFormData'
  },
  project: {
    listFunction: 'listProjects',
    getFunction: 'getProject',
    deleteFunction: 'deleteProject',
    upsertFunction: 'upsertProject',
    updateFunction: 'updateProject',
    fromFormData: 'projectFromFormData'
  },
  // Add similar configurations for other model types
  business_User_Roles: {
    listFunction: 'listBusinessUserRoles',
    getFunction: 'getBusinessUserRoles',
    deleteFunction: 'deleteBusinessUserRoles',
    upsertFunction: 'upsertBusinessUserRoles',
    updateFunction: 'updateBusinessUserRoles',
    fromFormData: 'businessUserRolesFromFormData'
  },
  business_Roles_Permissions: {
    listFunction: 'listBusinessRolesPermissions',
    getFunction: 'getBusinessRolesPermissions',
    deleteFunction: 'deleteBusinessRolesPermissions',
    upsertFunction: 'upsertBusinessRolesPermissions',
    updateFunction: 'updateBusinessRolesPermissions',
    fromFormData: 'businessRolesPermissionsFromFormData'
  },
  project_assignments: {
    listFunction: 'listProjectAssignments',
    getFunction: 'getProjectAssignments',
    deleteFunction: 'deleteProjectAssignments',
    upsertFunction: 'upsertProjectAssignments',
    updateFunction: 'updateProjectAssignments',
    fromFormData: 'projectAssignmentsFromFormData'
  },
  folder_Codes: {
    listFunction: 'listFolderCodes',
    getFunction: 'getFolderCodes',
    deleteFunction: 'deleteFolderCodes',
    upsertFunction: 'upsertFolderCodes',
    updateFunction: 'updateFolderCodes',
    fromFormData: 'folderCodesFromFormData'
  },
  file: {
    listFunction: 'listFiles',
    getFunction: 'getFile',
    deleteFunction: 'deleteFile',
    upsertFunction: 'upsertFile',
    updateFunction: 'updateFile',
    fromFormData: 'fileFromFormData'
  },
  file_Permissions: {
    listFunction: 'listFilePermissions',
    getFunction: 'getFilePermissions',
    deleteFunction: 'deleteFilePermissions',
    upsertFunction: 'upsertFilePermissions',
    updateFunction: 'updateFilePermissions',
    fromFormData: 'filePermissionsFromFormData'
  },
  task: {
    listFunction: 'listTasks',
    getFunction: 'getTask',
    deleteFunction: 'deleteTask',
    upsertFunction: 'upsertTask',
    updateFunction: 'updateTask',
    fromFormData: 'taskFromFormData'
  },
  subTask: {
    listFunction: 'listSubTasks',
    getFunction: 'getSubTask',
    deleteFunction: 'deleteSubTask',
    upsertFunction: 'upsertSubTask',
    updateFunction: 'updateSubTask',
    fromFormData: 'subTaskFromFormData'
  },
  punchList: {
    listFunction: 'listPunchLists',
    getFunction: 'getPunchList',
    deleteFunction: 'deletePunchList',
    upsertFunction: 'upsertPunchList',
    updateFunction: 'updatePunchList',
    fromFormData: 'punchListFromFormData'
  },
  dailyLog: {
    listFunction: 'listDailyLogs',
    getFunction: 'getDailyLog',
    deleteFunction: 'deleteDailyLog',
    upsertFunction: 'upsertDailyLog',
    updateFunction: 'updateDailyLog',
    fromFormData: 'dailyLogFromFormData'
  },
  progressionNotes: {
    listFunction: 'listProgressionNotes',
    getFunction: 'getProgressionNotes',
    deleteFunction: 'deleteProgressionNotes',
    upsertFunction: 'upsertProgressionNotes',
    updateFunction: 'updateProgressionNotes',
    fromFormData: 'progressionNotesFromFormData'
  },
  changeOrder: {
    listFunction: 'listChangeOrders',
    getFunction: 'getChangeOrder',
    deleteFunction: 'deleteChangeOrder',
    upsertFunction: 'upsertChangeOrder',
    updateFunction: 'updateChangeOrder',
    fromFormData: 'changeOrderFromFormData'
  },
  purchaseOrder: {
    listFunction: 'listPurchaseOrders',
    getFunction: 'getPurchaseOrder',
    deleteFunction: 'deletePurchaseOrder',
    upsertFunction: 'upsertPurchaseOrder',
    updateFunction: 'updatePurchaseOrder',
    fromFormData: 'purchaseOrderFromFormData'
  },
  inspiration: {
    listFunction: 'listInspirations',
    getFunction: 'getInspiration',
    deleteFunction: 'deleteInspiration',
    upsertFunction: 'upsertInspiration',
    updateFunction: 'updateInspiration',
    fromFormData: 'inspirationFromFormData'
  },
  specification: {
    listFunction: 'listSpecifications',
    getFunction: 'getSpecification',
    deleteFunction: 'deleteSpecification',
    upsertFunction: 'upsertSpecification',
    updateFunction: 'updateSpecification',
    fromFormData: 'specificationFromFormData'
  },
  specificationCodes: {
    listFunction: 'listSpecificationCodes',
    getFunction: 'getSpecificationCodes',
    deleteFunction: 'deleteSpecificationCodes',
    upsertFunction: 'upsertSpecificationCodes',
    updateFunction: 'updateSpecificationCodes',
    fromFormData: 'specificationCodesFromFormData'
  },
  upload: {
    listFunction: 'listUploads',
    getFunction: 'getUpload',
    deleteFunction: 'deleteUpload',
    upsertFunction: 'uploadFiles',
    updateFunction: 'updateUpload',
    fromFormData: 'uploadFromFormData'
  },
  user: {
    listFunction: 'listUsers',
    getFunction: 'getUser',
    deleteFunction: 'deleteUser',
    upsertFunction: 'upsertUser',
    updateFunction: 'updateListUser',
    fromFormData: 'userFromFormData'
  }
  // default_Cost_Codes: {
  //   listFunction: 'listDefaultCostCodes',
  //   getFunction: 'getDefaultCostCodes',
  //   deleteFunction: 'deleteDefaultCostCodes',
  //   upsertFunction: 'upsertDefaultCostCodes',
  //   updateFunction: 'updateDefaultCostCodes',
  //   fromFormData: 'defaultCostCodesFromFormData',
  // }
};

export const modelConfigs: {
  [K in ModelType]: ModelConfig<ShapeMap[K]>;
} = Object.entries(modelConfigsData).reduce(
  (acc, [key, config]) => {
    const modelKey = key as ModelType;

    acc[modelKey] = {
      listFunction: api[config.listFunction] as ModelConfig<
        ShapeMap[typeof modelKey]
      >['listFunction'],
      getFunction: api[config.getFunction] as ModelConfig<
        ShapeMap[typeof modelKey]
      >['getFunction'],
      deleteFunction: api[config.deleteFunction] as ModelConfig<
        ShapeMap[typeof modelKey]
      >['deleteFunction'],
      upsertFunction: api[config.upsertFunction] as ModelConfig<
        ShapeMap[typeof modelKey]
      >['upsertFunction'],
      updateFunction: api[config.updateFunction] as ModelConfig<
        ShapeMap[typeof modelKey]
      >['updateFunction'],
      fromFormData: api[config.fromFormData] as ModelConfig<
        ShapeMap[typeof modelKey]
      >['fromFormData'],
      idField: (config.idField || 'id') as Extract<
        keyof ShapeMap[typeof modelKey],
        string | number
      >
    };
    return acc;
  },
  {} as { [K in ModelType]: ModelConfig<ShapeMap[K]> }
);
