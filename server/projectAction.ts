// file: app/actions/projectActions.ts

'use server';

import {
  deleteFile,
  listFilePermissions,
  listFiles,
  listFolderCodes,
  listMainUsers,
  listProjects,
  updateFile,
  updateFilePermission,
  upsertFilePermission
} from '@/server/api_old';
import {
  FilePermissionShape,
  FileShape,
  FolderCodesShape,
  ProjectShape,
  UserShape
} from '@/server/types/mappings';
import { redirect } from 'next/navigation';

export type Project = ProjectShape;
export type File = FileShape;
export type FolderCode = FolderCodesShape;
export type User = UserShape;

// export interface Project {
//   id: number;
//   name: string;
//   status: string;
//   progress: number;
//   budget: number;
//   dueDate: string;
// }

// Mock data for projects
// const projects = [
//   { id: 1, name: 'A Spieth\'s Home', status: 'In Progress', progress: 65, budget: 1500000, dueDate: '2023-12-31' },
//   { id: 2, name: 'B Theegala\'s House', status: 'Planning', progress: 20, budget: 3000000, dueDate: '2024-06-30' },
//   { id: 3, name: 'C Rose\'s House', status: 'Completed', progress: 100, budget: 5000000, dueDate: '2023-10-15' },
//   { id: 4, name: 'D Scheffler\'s House', status: 'Delayed', progress: 40, budget: 2000000, dueDate: '2023-11-30' },
//   { id: 5, name: 'F Shaffule\'s House', status: 'On Hold', progress: 50, budget: 1000000, dueDate: '2024-02-28' },
// ];

export async function getProjects(token: string): Promise<Project[]> {
  // console.log('****************getProjects******************');
  try {
    const projects = await listProjects({}, token);
    projects?.forEach((project) => {
      const projectName = project.name || 'Unnamed Project';
      // console.log(`Project ID: ${project.id}, Project Name: ${projectName}`);
    });
    return (
      projects?.map((project) => ({
        ...project,
        name: project.name || 'Unnamed Project',
        status: project.status || 'Unknown',
        budget_estimated:
          typeof project.budget_estimated === 'string'
            ? parseFloat(project.budget_estimated)
            : project.budget_estimated || 0,
        percentage_complete:
          typeof project.percentage_complete === 'string'
            ? parseFloat(project.percentage_complete)
            : project.percentage_complete || 0
      })) || []
    );
  } catch (error: any) {
    console.error('Error fetching project:', error);
    const errorMessage = error.toString()
      ? error.toString()
      : 'Uknown server error occurred';
    redirect(`/error?message=${errorMessage}`);
    // throw error;
  }
}

export async function getProject(
  id: number,
  token: string
): Promise<Project | undefined> {
  try {
    const projects = await listProjects({ filter: { id } }, token);
    if (projects && projects.length > 0) {
      const project = projects[0];
      return {
        ...project,
        name: project.name || 'Unnamed Project',
        status: project.status || 'Unknown',
        budget_estimated:
          typeof project.budget_estimated === 'string'
            ? parseFloat(project.budget_estimated)
            : project.budget_estimated || 0,
        percentage_complete:
          typeof project.percentage_complete === 'string'
            ? parseFloat(project.percentage_complete)
            : project.percentage_complete || 0
      };
    }
  } catch (error: any) {
    console.error('Error fetching project:', error);
    const errorMessage = error.toString()
      ? error.toString()
      : 'Uknown server error occurred';
    // redirect(`/error?message=${errorMessage}`);
    // throw error
  }
}

export async function getFiles(
  token: string,
  filterField: string,
  filterValue: any
): Promise<File[]> {
  console.log('****************get Files******************');
  try {
    let files;

    if (filterField) {
      files = await listFiles(
        { filter: { [filterField]: filterValue } },
        token
      );
    } else {
      files = await listFiles({}, token);
    }

    // const files = await listFiles({}, token);
    // files?.forEach((file) => {
    //   const fileName = file.name || 'Unnamed File';
    // });
    return (
      files?.map((file) => ({
        ...file,
        name: file.name || 'Unnamed File',
        status: file.status || 'Unknown'
        // budget_estimated:
        //   typeof project.budget_estimated === 'string'
        //     ? parseFloat(project.budget_estimated)
        //     : project.budget_estimated || 0,
        // percentage_complete:
        //   typeof project.percentage_complete === 'string'
        //     ? parseFloat(project.percentage_complete)
        //     : project.percentage_complete || 0
      })) || []
    );
  } catch (error: any) {
    console.error('Error fetching files:', error);
    const errorMessage = error.toString()
      ? error.toString()
      : 'Uknown server error occurred';
    redirect(`/error?message=${errorMessage}`);
    // throw error;
  }
}

export async function deleteFileFun(token: string, id: number): Promise<any> {
  console.log('****************delete Files******************');
  try {
    let fileResp = await deleteFile(id, token);
    console.log('fileResp:', fileResp);

    return fileResp;
  } catch (error: any) {
    console.error('Error fetching files:', error);
    const errorMessage = error.toString()
      ? error.toString()
      : 'Uknown server error occurred';
    redirect(`/error?message=${errorMessage}`);
    // throw error;
  }
}

export async function editFile(
  token: string,
  id: number,
  data: any
): Promise<File | any> {
  console.log('****************edit Files******************');
  try {
    let fileResp = await updateFile(id, data, token);

    if (fileResp) {
      return {
        ...fileResp,
        id: fileResp.id || 0,
        name: fileResp.name || 'Unnamed File',
        status: fileResp.status || 'Unknown'
      };
    } else {
      return fileResp;
    }
  } catch (error: any) {
    console.error('Error editing files:', error);
    const errorMessage = error.toString()
      ? error.toString()
      : 'Uknown server error occurred';
    redirect(`/error?message=${errorMessage}`);
    // throw error;
  }
}

export async function getFilePermission(
  token: string,
  filterObj: any
): Promise<FilePermissionShape[]> {
  console.log('****************get File Permission******************');
  try {
    let filePermission;

    if (filterObj) {
      filePermission = await listFilePermissions({ filter: filterObj }, token);
    } else {
      filePermission = await listFilePermissions({}, token);
    }

    // const files = await listFiles({}, token);
    // files?.forEach((file) => {
    //   const fileName = file.name || 'Unnamed File';
    // });
    return (
      filePermission?.map((file_p) => ({
        ...file_p,
        name: file_p.name || 'Unnamed File Permission'
      })) || []
    );
  } catch (error: any) {
    console.error('Error fetching file permission:', error);
    const errorMessage = error.toString()
      ? error.toString()
      : 'Uknown server error occurred';
    redirect(`/error?message=${errorMessage}`);
    // throw error;
  }
}

export async function createFilePermission(
  token: string,
  data: any
): Promise<FilePermissionShape | any> {
  console.log('****************add File permission******************');
  try {
    let filePResp = await upsertFilePermission(data, token);

    console.log('filePResp add:', filePResp);

    if (filePResp) {
      return {
        ...filePResp,
        id: filePResp.id || 0,
        name: filePResp.name || 'Unnamed File'
      };
    } else {
      return filePResp;
    }
  } catch (error: any) {
    console.error('Error editing file permission:', error);
    const errorMessage = error.toString()
      ? error.toString()
      : 'Uknown server error occurred';
    redirect(`/error?message=${errorMessage}`);
    // throw error;
  }
}

export async function editFilePermission(
  token: string,
  id: number,
  data: any
): Promise<FilePermissionShape | any> {
  console.log('****************edit File permission******************');
  try {
    let filePResp = await updateFilePermission(id, data, token);

    if (filePResp) {
      return {
        ...filePResp,
        id: filePResp.id || 0,
        name: filePResp.name || 'Unnamed File'
      };
    } else {
      return filePResp;
    }
  } catch (error: any) {
    console.error('Error editing file permission:', error);
    const errorMessage = error.toString()
      ? error.toString()
      : 'Uknown server error occurred';
    redirect(`/error?message=${errorMessage}`);
    // throw error;
  }
}

export async function getFolderCodes(
  token: string,
  filterObj: any
): Promise<FolderCode[]> {
  console.log('****************get Folder Codes******************');
  try {
    let folder_Codes;

    if (filterObj) {
      folder_Codes = await listFolderCodes({ filter: filterObj }, token);
    } else {
      folder_Codes = await listFolderCodes({}, token);
    }

    // const files = await listFiles({}, token);
    // files?.forEach((file) => {
    //   const fileName = file.name || 'Unnamed File';
    // });
    return (
      folder_Codes?.map((folder) => ({
        ...folder,
        name: folder.name || 'Unnamed File',
        status: folder.status || 'Unknown'
        // budget_estimated:
        //   typeof project.budget_estimated === 'string'
        //     ? parseFloat(project.budget_estimated)
        //     : project.budget_estimated || 0,
        // percentage_complete:
        //   typeof project.percentage_complete === 'string'
        //     ? parseFloat(project.percentage_complete)
        //     : project.percentage_complete || 0
      })) || []
    );
  } catch (error: any) {
    console.error('Error fetching folder codes:', error);
    const errorMessage = error.toString()
      ? error.toString()
      : 'Uknown server error occurred';
    redirect(`/error?message=${errorMessage}`);
    // throw error;
  }
}

export async function getUsers(
  token: string,
  filterField: string,
  filterValue: any
): Promise<User[]> {
  console.log('****************get Users******************');
  try {
    let users;

    if (filterField) {
      users = await listMainUsers(
        { filter: { [filterField]: filterValue } },
        token
      );
    } else {
      users = await listMainUsers({}, token);
    }

    // const files = await listFiles({}, token);
    // files?.forEach((file) => {
    //   const fileName = file.name || 'Unnamed File';
    // });
    return (
      users?.map((user) => ({
        ...user,
        name: user.name || 'Unnamed File',
        status: user.status || 'Unknown'
        // budget_estimated:
        //   typeof project.budget_estimated === 'string'
        //     ? parseFloat(project.budget_estimated)
        //     : project.budget_estimated || 0,
        // percentage_complete:
        //   typeof project.percentage_complete === 'string'
        //     ? parseFloat(project.percentage_complete)
        //     : project.percentage_complete || 0
      })) || []
    );
  } catch (error: any) {
    console.error('Error fetching users:', error);
    const errorMessage = error.toString()
      ? error.toString()
      : 'Uknown server error occurred';
    redirect(`/error?message=${errorMessage}`);
    // throw error;
  }
}
