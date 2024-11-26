//file components/file-manager/FolderTable.tsx
'use client';

import folder_plus from '@/public/assets/folder-plus.svg';
import folder_upload from '@/public/assets/folder-upload.svg';
import folder from '@/public/assets/folder.svg';
import file from '@/public/assets/file.svg';
import morevert_hori from '@/public/assets/morevert_horizontal.svg';
import linkIcon from '@/public/assets/link.svg';
import tick from '@/public/assets/tick.svg';
import cross from '@/public/assets/cross.svg';

import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

import { useSession } from 'next-auth/react';
import { useLoadingAPI } from '@/app/hooks/useLoadingAPI';
import { useEffect, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Trash2 } from 'lucide-react';

import AsyncSelect from 'react-select/async';

import { Switch } from '@/components/ui/switch';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import ProjectSelector from '../dashboard/ProjectSelector';
import { useProjectState } from '@/hooks/useProjectState';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

import { OptionsOrGroups, GroupBase } from 'react-select';

import { useLoading } from '@/components/LoadingProvider';
import { getFolderCodes } from '@/server/projectAction';

import DeleteConfirmation from '@/components/DeleteConfirmation';
import { FolderCodesShape } from '@/server/types/mappings';

import { downloadFolder } from '@/server/auth/files';

import { editFilePermission } from '@/server/projectAction';
import { FileShape } from '@/server/types/files';

const FolderTable = () => {
  const { data: session, status, update } = useSession();
  const { setIsLoading } = useLoading();

  const { toast } = useToast();

  const router = useRouter();

  const { fetchWithLoading } = useLoadingAPI();
  const [folderCodes, setFolderCodes] = useState<any[] | undefined>([]);
  const [files, setFiles] = useState<any[] | undefined>([]);
  const [filteredFolderCodes, setFilteredFolderCodes] = useState<
    any[] | undefined
  >([]);
  const [createFolder, setCreateFolder] = useState<boolean>(false);
  const [folderCreateName, setFolderCreateName] = useState<string>('');
  const [filterText, setFilterText] = useState<string>('');
  const [editFolderData, setEditFolderData] = useState<any | undefined>(
    undefined
  );
  const [folderNewName, setFolderNewName] = useState<string>('');

  const [fileDialogOpen, setFileDialogOpen] = useState<boolean>(false);

  const { currentProjectId, setCurrentProjectId, projects } = useProjectState();

  const [fileRes, setFileRes] = useState<any | undefined>(undefined);
  const [fileUploadLoading, setFileUploadLoading] = useState<boolean>(false);
  const [dialogOpen2, setDialogOpen2] = useState<boolean>(false);
  const [dialogOpen3, setDialogOpen3] = useState<boolean>(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('');

  const [selectedDeleteData, setSelectedDeleteData] = useState<{
    ids: any;
    selectedAll: boolean;
  }>({
    ids: [],
    selectedAll: false
  });
  const [selectedFileDeleteData, setSelectedFileDeleteData] = useState<{
    ids: any;
    selectedAll: boolean;
  }>({
    ids: [],
    selectedAll: false
  });

  const [generateShareLink, setGenerateShareLink] = useState<{
    link: string;
    loading: boolean;
    copied: boolean;
  }>({
    link: '',
    loading: false,
    copied: false
  });

  const [editFileData, setEditFileData] = useState<any | undefined>(undefined);
  const [fileNewName, setFileNewName] = useState<string>('');
  const [editFileDataMove, setEditFileDataMove] = useState<any | undefined>(
    undefined
  );

  const [permissionData, setPermissionData] = useState<any | undefined>({
    read: false,
    delete: false,
    selectedUser: undefined,
    file_id: undefined
  });

  console.log('session yser;', session?.user);

  const handleFileUpload = async (fileRes: any) => {
    setFileUploadLoading(true);

    console.log('file res', fileRes);

    if (!session?.user.apiUserToken) {
      toast({
        title: 'Error',
        description: 'User token is required',
        variant: 'destructive'
      });
      return;
    }

    if (!fileRes) {
      toast({
        title: 'Error',
        description: 'File is required',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      // let response = await editFile(
      //   session?.user.apiUserToken as string,
      //   Number(fileRes?.id),
      //   { folder_code_id: Number(params?.folderId) }
      // );

      // if (response) {
      //   toast({
      //     title: 'Success',
      //     description: 'File uploaded successfully'
      //   });
      //   setFileRes(undefined);
      //   setDialogOpen(false);
      //   fetchAPIData();
      // } else {
      //   console.log('error');
      // }

      let response = await fetchWithLoading(`/api/file/${fileRes?.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          data: {
            type: 'file',
            attributes: {
              original_name: fileRes?.original_name,
              file_url: fileRes?.file_url,
              folder_code_id: null
            }
          }
        })
      });

      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'File uploaded successfully'
        });
        setFileRes(undefined);
        setFileDialogOpen(false);
        fetchAPIData();
      } else {
        console.log('error');
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Error while uploading file',
        variant: 'destructive'
      });
    } finally {
      setFileUploadLoading(false);
      setIsLoading(false);
    }
  };

  const generateShareLinkAPI = async (item: any) => {
    console.log('item', item);

    if (!session?.user.apiUserToken) {
      toast({
        title: 'Error',
        description: 'User token is required',
        variant: 'destructive'
      });

      return;
    }

    if (!item?.attributes?.file_id) {
      toast({
        title: 'Error',
        description: 'File id is required',
        variant: 'destructive'
      });

      return;
    }

    try {
      const response = await fetchWithLoading(
        `/api/generate-share-link/${item?.attributes?.file_id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user.apiUserToken}`
          }
        }
      );

      console.log('resp', response);

      if (response) {
        setGenerateShareLink({
          link: response.shareLink,
          loading: false,
          copied: false
        });
      } else {
        console.log('error');
        setGenerateShareLink({
          link: '',
          loading: false,
          copied: false
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Error while generating share link',
        variant: 'destructive'
      });
      setGenerateShareLink({
        link: '',
        loading: false,
        copied: false
      });
    }
  };

  const updateFileData = async () => {
    if (fileNewName == editFileData?.original_name) {
      toast({
        title: 'Error',
        description: 'No changes made',
        variant: 'destructive'
      });
      return;
    }

    if (!session?.user.apiUserToken) {
      return;
    }

    if (!fileNewName) {
      toast({
        title: 'Error',
        description: 'File name is required',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetchWithLoading(`/api/file/${editFileData?.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          data: {
            type: 'file',
            attributes: {
              original_name: fileNewName
            }
          }
        })
      });

      console.log(response);

      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'FIle updated successfully'
        });
        setEditFileData(undefined);
        setFileNewName('');
        fetchNullFile();
      } else {
        console.log('error');
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Error while updating folder',
        variant: 'destructive'
      });
    }
  };

  const handlePermissionSubmit = async () => {
    if (!session?.user.apiUserToken) {
      toast({
        title: 'Error',
        description: 'User token is required',
        variant: 'destructive'
      });
      console.log('user token is required');
      return;
    }

    if (!permissionData.file_id) {
      toast({
        title: 'Error',
        description: 'File id is required',
        variant: 'destructive'
      });
      console.log('file id is required', permissionData);
      return;
    }

    if (!permissionData.selectedUser?.value) {
      toast({
        title: 'Error',
        description: 'User is required',
        variant: 'destructive'
      });
      console.log('user is required');
      return;
    }

    setIsLoading(true);

    let resultObj = await getPermissionDataByUserAndFile(
      permissionData.file_id,
      permissionData.selectedUser?.value
    );

    let apiMethod = null;

    if (resultObj) {
      console.log(resultObj);
      if (resultObj.length > 0) {
        apiMethod = 'PATCH';
      } else {
        apiMethod = 'POST';
      }
    } else {
      // console.log('error while fetching permission data');

      toast({
        title: 'Error',
        description: 'Error while fetching permission data',
        variant: 'destructive'
      });

      return;
    }

    try {
      let permissionType = [];
      if (permissionData.read) {
        permissionType.push('read');
      }
      if (permissionData.delete) {
        permissionType.push('delete');
      }

      if (apiMethod === 'POST') {
        let payload = {
          active: true,
          file_id: permissionData.file_id,
          user_id: permissionData.selectedUser?.value,
          permission_type: permissionType
        };

        let formData = new FormData();

        Object.entries(payload).forEach(([key, value]) => {
          if (Array.isArray(value) || typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value as string);
          }
        });

        let response = await fetchWithLoading(
          `/api/generic-model/file_Permissions`,
          {
            method: 'POST',
            body: formData
          }
        );

        if (response) {
          toast({
            title: 'Success',
            description: 'Permission added successfully'
          });
          setPermissionData({
            read: false,
            delete: false,
            selectedUser: undefined,
            file_id: undefined
          });
          setDialogOpen2(false);
        } else {
          console.log('error');
          toast({
            title: 'Error',
            description: 'Something went wrong',
            variant: 'destructive'
          });
        }
      } else if (apiMethod === 'PATCH') {
        let response = await editFilePermission(
          session?.user.apiUserToken as string,
          Number(resultObj[0].id),
          { permission_type: permissionType }
        );

        if (response) {
          toast({
            title: 'Success',
            description: 'Permission updated successfully'
          });
          setPermissionData({
            read: false,
            delete: false,
            selectedUser: undefined,
            file_id: undefined
          });
          setDialogOpen2(false);
        } else {
          console.log('error');
          toast({
            title: 'Error',
            description: 'Something went wrong',
            variant: 'destructive'
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Error while adding permission',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissionDataByUserAndFile = async (
    fileId: string,
    userId: string
  ) => {
    if (!session?.user.apiUserToken) {
      toast({
        title: 'Error',
        description: 'User token is required',
        variant: 'destructive'
      });

      return;
    }

    try {
      let response = await fetchWithLoading(
        `/api/generic-model/file_Permissions?filter[file]=${fileId}&filter[user]=${userId}`
      );

      if (response) {
        return response?.models;
      } else {
        toast({
          title: 'Error',
          description: 'Error while fetching data',
          variant: 'destructive'
        });
        return false;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error while fetching data',
        variant: 'destructive'
      });
      console.log(error);
      return false;
    }
  };

  const loadUsers = async (
    inputValue: string,
    callback: (options: OptionsOrGroups<string, GroupBase<string>>) => void
  ) => {
    if (inputValue.trim() === '') {
      callback([]);
      return;
    }

    try {
      let response = await fetchWithLoading(
        `/api/generic-model/user?filter[name$icontains]=${inputValue}`
      );

      if (response) {
        const options: OptionsOrGroups<
          any,
          GroupBase<any>
        > = response?.models.map((user: any) => ({
          value: user?.id,
          label: user?.name
        }));

        callback(options);
      } else {
        callback([]);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error.message);
      callback([]);
    }
  };

  const moveToOtherFile = async () => {
    if (parseInt(selectedFolder) == editFileDataMove?.folder_code_id) {
      toast({
        title: 'Error',
        description: 'No changes made',
        variant: 'destructive'
      });
      return;
    }

    if (!session?.user.apiUserToken) {
      return;
    }

    if (!selectedFolder) {
      toast({
        title: 'Error',
        description: 'Folder is required',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetchWithLoading(
        `/api/file/${editFileDataMove?.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            data: {
              type: 'file',
              attributes: {
                folder_code_id: parseInt(selectedFolder)
              }
            }
          })
        }
      );

      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'FIle transfered successfully'
        });
        setEditFileDataMove(undefined);
        setSelectedFolder('');
        // fetchAPIData();
        fetchNullFile();
        setDialogOpen3(false);
      } else {
        toast({
          title: 'Error',
          description: 'Error while transferring file',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Error while transferring file',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    folderCodes: FolderCodesShape | null;
  }>({
    isOpen: false,
    folderCodes: null
  });

  const [deleteConfirmation2, setDeleteConfirmation2] = useState<{
    isOpen: boolean;
    file: FileShape | null;
  }>({
    isOpen: false,
    file: null
  });

  const handleDeleteFolder = (file: FolderCodesShape) => {
    setDeleteConfirmation({ isOpen: true, folderCodes: file });
  };

  const closeDeleteFolder = () => {
    setDeleteConfirmation({ isOpen: false, folderCodes: null });
  };

  const closeDeleteFile = () => {
    setDeleteConfirmation2({ isOpen: false, file: null });
  };

  const handleProjectChange = (newProjectId: string) => {
    const numericProjectId = parseInt(newProjectId, 10);
    setCurrentProjectId(numericProjectId);
  };

  const fetchAPIData = async () => {
    if (!session?.user.apiUserToken) {
      return;
    }

    if (!currentProjectId) {
      return;
    }

    try {
      let response;

      if (currentProjectId === 0) {
        response = await fetchWithLoading(`/api/generic-model/folder_Codes`);
      } else {
        response = await fetchWithLoading(
          `/api/generic-model/folder_Codes?filter[project_id]=${currentProjectId}`
        );
      }

      if (response) {
        setFolderCodes(response?.models);
      } else {
        toast({
          title: 'Error',
          description: 'Error while fetching data',
          variant: 'destructive'
        });
        setFolderCodes([]);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error while fetching data',
        variant: 'destructive'
      });
    }
  };

  const fetchNullFile = async () => {
    if (!session?.user.apiUserToken) {
      return;
    }

    try {
      let formData = new FormData();

      let response = await fetchWithLoading(
        `/api/user-files?filter[folder_code_id]=null&filter[project_id]=${currentProjectId}`
      );

      if (response) {
        setFiles(response?.body?.data);
        console.log(response?.body?.data);
      } else {
        toast({
          title: 'Error',
          description: 'Error while fetching data',
          variant: 'destructive'
        });

        setFiles([]);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error while fetching data',
        variant: 'destructive'
      });
    }
  };

  const createFolderAPI = async () => {
    if (!session?.user.apiUserToken) {
      return;
    }

    if (!folderCreateName) {
      toast({
        title: 'Error',
        description: 'Folder name is required',
        variant: 'destructive'
      });
      return;
    }

    let formData = new FormData();

    let payload = {
      folder_name: folderCreateName,
      folder_display_name: folderCreateName,
      active: true,
      description: '',
      project_id: currentProjectId
    };

    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value) || typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    try {
      const response = await fetchWithLoading(
        `/api/generic-model/folder_Codes`,
        {
          method: 'POST',
          body: formData
        }
      );

      console.log(response);

      if (response.ok) {
        setFolderCodes([...(folderCodes as [] | any), response.model]);
        toast({
          title: 'Success',
          description: 'Folder created successfully',
          variant: 'default'
        });
        setCreateFolder(false);
        setFolderCreateName('');
      } else {
        console.log('error');
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Error while creating folder',
        variant: 'destructive'
      });
    }
  };

  const updateFolderAPI = async () => {
    if (folderNewName == editFolderData?.folder_display_name) {
      toast({
        title: 'Error',
        description: 'No changes made',
        variant: 'destructive'
      });
      return;
    }

    if (!session?.user.apiUserToken) {
      return;
    }

    if (!folderNewName) {
      toast({
        title: 'Error',
        description: 'Folder name is required',
        variant: 'destructive'
      });
      return;
    }

    let formData = new FormData();

    let payload = {
      ...editFolderData,
      folder_name: folderNewName,
      folder_display_name: folderNewName
    };

    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value) || typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    try {
      let response = await fetchWithLoading(
        `/api/generic-model/folder_Codes/${editFolderData?.id}`,
        {
          method: 'PUT',
          body: formData
        }
      );

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Folder updated successfully'
        });
        setEditFolderData(undefined);
        setFolderNewName('');
        fetchAPIData();
      } else {
        console.log('error');
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Error while updating folder',
        variant: 'destructive'
      });
    }
  };

  const downloadFolderFun = async (folderId: string) => {
    if (!session?.user.apiUserToken) {
      toast({
        title: 'Error',
        description: 'User token is required',
        variant: 'destructive'
      });
      return;
    }

    if (!folderId) {
      toast({
        title: 'Error',
        description: 'Folder ID is required',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://backend-api-topaz.vercel.app/api/download-folder/${folderId}`,
        {
          headers: {
            Authorization: `Bearer ${session?.user.apiUserToken}`
          }
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sample.zip`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast({
          title: 'Success',
          description: 'Folder downloaded successfully'
        });
      } else {
        console.error('Download failed:', response.statusText);
        toast({
          title: 'Error',
          description: 'Failed to download folder'
        });
      }
    } catch (error) {
      console.error('Error while downloading folder:', error);
      toast({
        title: 'Error',
        description: 'Error while downloading folder',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAPIData();
  }, [session?.user.apiUserToken, currentProjectId]);

  useEffect(() => {
    fetchNullFile();
  }, [session?.user.apiUserToken]);

  useEffect(() => {
    if (folderCodes) {
      setFilteredFolderCodes(folderCodes);
    }
  }, [folderCodes]);

  useEffect(() => {
    if (filterText) {
      const filteredData = folderCodes?.filter((item) => {
        return item?.folder_display_name
          ?.toLowerCase()
          .includes(filterText.toLowerCase());
      });
      setFilteredFolderCodes(filteredData);
    } else {
      setFilteredFolderCodes(folderCodes);
    }
  }, [filterText]);

  const handleMultipleDelete = async () => {
    if (!session?.user.apiUserToken) {
      toast({
        title: 'Error',
        description: 'User token is required',
        variant: 'destructive'
      });
      return;
    }

    if (
      selectedDeleteData.ids.length === 0 &&
      selectedFileDeleteData.ids.length === 0
    ) {
      toast({
        title: 'Error',
        description: 'No items selected',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      // let response = await fetchWithLoading(
      //   `/api/generic-model/folder_Codes/${selectedDeleteData.ids.join(',')}`,
      //   {
      //     method: 'DELETE'
      //   }
      // );

      // if (response) {
      //   toast({
      //     title: 'Success',
      //     description: 'Items deleted successfully'
      //   });
      //   fetchAPIData();
      //   setSelectedDeleteData({
      //     ids: [],
      //     selectedAll: false
      //   });
      // } else {
      //   console.log('error');
      // }

      // doing one by one delete with Promise.all
      let promises = selectedDeleteData.ids.map((id: any) => {
        return fetchWithLoading(`/api/generic-model/folder_Codes/${id}`, {
          method: 'DELETE'
        });
      });

      let response = await Promise.all(promises);

      if (response) {
        toast({
          title: 'Success',
          description: 'Items deleted successfully'
        });
        fetchAPIData();
        setSelectedDeleteData({
          ids: [],
          selectedAll: false
        });
      } else {
        console.log('error');
        toast({
          title: 'Error',
          description: 'Error while deleting items',
          variant: 'destructive'
        });
      }

      // doing one by one delete with Promise.all
      let promises2 = selectedFileDeleteData.ids.map((id: any) => {
        return fetchWithLoading(`/api/generic-model/file/${id}`, {
          method: 'DELETE'
        });
      });

      let response2 = await Promise.all(promises2);

      if (response2) {
        toast({
          title: 'Success',
          description: 'Items deleted successfully'
        });
        fetchNullFile();
        setSelectedFileDeleteData({
          ids: [],
          selectedAll: false
        });
      } else {
        console.log('error');
        toast({
          title: 'Error',
          description: 'Error while deleting items',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Error while deleting items',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className=" flex flex-col gap-5">
        <div className=" pl-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>File Manager</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Folders</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className=" w-full rounded-md border border-gray-100 bg-white px-7 py-7 shadow-sm">
          <div className=" flex items-center justify-between gap-1">
            <div className=" flex flex-col gap-2">
              <div className=" pl-3 text-xl font-semibold">File Manager</div>
              <div className=" flex">
                <span className=" border-r-2 border-gray-400 px-3 py-0 text-[14px] font-medium leading-4 text-blue-600">
                  File manager
                </span>
                <span className=" border-r-2 border-gray-400 px-3 py-0 text-[14px] font-medium leading-4 text-gray-400">
                  2.6 GB
                </span>
                <span className=" px-3 py-0 text-[14px] font-medium leading-4 text-gray-400">
                  {(filteredFolderCodes?.length ?? 0) +
                    (filteredFolderCodes?.length === 1 ? ' item' : ' items')}
                </span>
              </div>
            </div>
            <div className="">
              <Select
                value={currentProjectId.toString()}
                onValueChange={handleProjectChange}
              >
                <SelectTrigger className="line-clamp-1  min-w-[200px]">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className=" w-full rounded-md border border-gray-100 bg-white px-7 py-5 shadow-sm">
          <div className=" flex items-center justify-between">
            <div className=" relative">
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Search"
                className=" h-11 w-full rounded-lg border border-gray-50 bg-gray-100 pl-10 pr-5 text-sm focus:border-gray-200 focus:outline-none"
              />
              <div className=" absolute top-0 h-5 w-5 scale-[.6]">
                <svg
                  width="64px"
                  height="64px"
                  viewBox="-5.75 -5.75 36.50 36.50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#8c8c8c"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {' '}
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M5.5 10.7655C5.50003 8.01511 7.44296 5.64777 10.1405 5.1113C12.8381 4.57483 15.539 6.01866 16.5913 8.55977C17.6437 11.1009 16.7544 14.0315 14.4674 15.5593C12.1804 17.0871 9.13257 16.7866 7.188 14.8415C6.10716 13.7604 5.49998 12.2942 5.5 10.7655Z"
                      stroke="#696969"
                      stroke-width="1.65"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{' '}
                    <path
                      d="M17.029 16.5295L19.5 19.0005"
                      stroke="#696969"
                      stroke-width="1.65"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{' '}
                  </g>
                </svg>{' '}
              </div>
            </div>
            <div className=" flex w-fit gap-3">
              {(selectedDeleteData.ids.length > 0 ||
                selectedFileDeleteData.ids.length > 0) && (
                <button
                  className=" flex h-fit items-center gap-2 rounded-md bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 hover:opacity-90"
                  onClick={handleMultipleDelete}
                  disabled={
                    selectedDeleteData.ids.length === 0 &&
                    selectedFileDeleteData.ids.length === 0
                  }
                >
                  <Trash2 className=" h-5 w-5" />
                  Delete Selected
                </button>
              )}

              <button
                className=" flex h-fit items-center gap-2 rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:opacity-90"
                onClick={() => setCreateFolder(true)}
                disabled={!currentProjectId}
              >
                <img src={folder_plus.src} alt="" className=" h-6 w-6" />
                New Folder
              </button>

              <Dialog
                open={fileDialogOpen}
                onOpenChange={(isOpen) => setFileDialogOpen(isOpen)}
              >
                <DialogTrigger asChild>
                  <button className=" flex h-fit  items-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                    <img src={folder_upload.src} alt="" className=" h-6 w-6" />
                    Upload Files
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                    <DialogDescription>
                      <div className=" my-5">
                        <FilePond
                          className="multiple-filepond"
                          acceptedFileTypes={[
                            'application/pdf',
                            'image/png',
                            'image/jpeg',
                            'image/gif'
                          ]}
                          allowImagePreview={true}
                          server={{
                            process: {
                              url: `https://backend-api-topaz.vercel.app/api/upload`,
                              method: 'POST',
                              headers: {
                                Authorization: `Bearer ${session?.user.apiUserToken}`
                              },
                              onload(response: any) {
                                console.log(response);
                                // setFileRes(response[0]);
                                let responseObj = JSON.parse(response);
                                console.log(responseObj[0]);
                                setFileRes(responseObj[0]);
                                return response;
                              }
                            }
                          }}
                          allowReorder={true}
                          allowMultiple={true}
                          maxFiles={1}
                          name="files"
                          labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
                        />
                      </div>

                      <button
                        className=" mx-auto w-fit cursor-pointer rounded-md bg-emerald-200 px-4 py-2 text-emerald-700 "
                        onClick={() => handleFileUpload(fileRes)}
                        disabled={fileUploadLoading}
                      >
                        Submit
                      </button>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className=" mt-5 w-full overflow-x-auto">
            <table className=" w-full min-w-max">
              <thead>
                <tr className=" w-full border-separate border-b border-gray-200">
                  <th className="flex items-center justify-center py-6 text-center">
                    <input
                      type="checkbox"
                      className=" size-[15px] h-[18px] w-[18px] cursor-pointer appearance-none rounded-sm bg-gray-200 accent-blue-600 checked:appearance-auto "
                      checked={selectedDeleteData.selectedAll}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDeleteData({
                            ids: filteredFolderCodes?.map((item) => item.id),
                            selectedAll: true
                          });
                          setSelectedFileDeleteData({
                            ids: files?.map((item) => item.id),
                            selectedAll: false
                          });
                        } else {
                          setSelectedDeleteData({
                            ids: [],
                            selectedAll: false
                          });
                          setSelectedFileDeleteData({
                            ids: [],
                            selectedAll: false
                          });
                        }
                      }}
                    />
                  </th>
                  <th className="mr-auto min-w-max px-4 text-left text-xs text-gray-400">
                    NAME
                  </th>
                  <th className="min-w-max px-4 text-left text-xs text-gray-400">
                    SIZE
                  </th>
                  <th className="mr-auto min-w-max px-4 text-left text-xs text-gray-400">
                    LAST MODIFIED
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {createFolder && (
                  <tr className="w-full border-separate border-b border-gray-200">
                    <td className=" flex items-center justify-center py-6 text-center"></td>
                    <td
                      className="mr-auto min-w-max py-4 text-left text-sm text-gray-600 "
                      colSpan={4}
                    >
                      <div className="flex items-center gap-2">
                        <img src={folder.src} alt="" className=" h-8 w-8" />
                        <input
                          type="text"
                          placeholder="Enter the folder name"
                          className=" h-11 w-full max-w-[300px] rounded-md border px-2 text-sm focus:border-gray-200 focus:outline-none"
                          value={folderCreateName}
                          onChange={(e) => setFolderCreateName(e.target.value)}
                        />

                        <button
                          className=" flex h-10 w-10 items-center justify-center gap-2 rounded-md bg-blue-100 text-sm font-medium text-blue-700 hover:opacity-90"
                          onClick={createFolderAPI}
                        >
                          <img src={tick.src} alt="" className=" h-6 w-6" />
                        </button>
                        <button
                          className=" flex  h-10 w-10 items-center justify-center gap-2 rounded-md bg-rose-50 text-sm font-medium hover:opacity-90"
                          onClick={() => setCreateFolder(false)}
                        >
                          <img src={cross.src} alt="" className=" h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                {(filteredFolderCodes?.length ?? 0) > 0 &&
                  filteredFolderCodes?.map((item, index) => (
                    <tr
                      className="w-full border-separate border-b border-gray-200"
                      key={index}
                    >
                      <td className=" flex items-center justify-center py-6 text-center">
                        <input
                          type="checkbox"
                          className=" size-[15px] h-[18px] w-[18px] appearance-none rounded-sm bg-gray-200 accent-blue-600 checked:appearance-auto"
                          checked={selectedDeleteData.ids.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDeleteData({
                                ids: [...selectedDeleteData.ids, item.id],
                                selectedAll: false
                              });
                              setSelectedFileDeleteData({
                                ...selectedFileDeleteData,
                                selectedAll: false
                              });
                            } else {
                              setSelectedDeleteData({
                                ids: selectedDeleteData.ids.filter(
                                  (id: any) => id !== item.id
                                ),
                                selectedAll: false
                              });
                              setSelectedFileDeleteData({
                                ...selectedFileDeleteData,
                                selectedAll: false
                              });
                            }
                          }}
                        />
                      </td>
                      <td className="mr-auto min-w-max px-4 text-left text-sm text-gray-600 ">
                        {!editFolderData ||
                        (editFolderData && editFolderData.id !== item.id) ? (
                          <div
                            className="flex cursor-pointer items-center gap-2 hover:text-blue-700"
                            onClick={() => {
                              router.push(
                                `/file-manager/folders/${item.id}/files`
                              );
                            }}
                          >
                            <img src={folder.src} alt="" className=" h-8 w-8" />
                            {item?.folder_display_name}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <img src={folder.src} alt="" className=" h-8 w-8" />
                            <input
                              type="text"
                              placeholder="Enter the folder name"
                              className=" h-11 w-full max-w-[300px] rounded-md border px-2 text-sm focus:border-gray-200 focus:outline-none"
                              value={folderNewName}
                              onChange={(e) => setFolderNewName(e.target.value)}
                            />
                            <button
                              className=" flex h-10 w-10 items-center justify-center gap-2 rounded-md bg-blue-100 text-sm font-medium text-blue-700 hover:opacity-90"
                              onClick={() => updateFolderAPI()}
                            >
                              <img src={tick.src} alt="" className=" h-6 w-6" />
                            </button>
                            <button
                              className=" flex  h-10 w-10 items-center justify-center gap-2 rounded-md bg-rose-50 text-sm font-medium hover:opacity-90"
                              onClick={() => {
                                setEditFolderData(undefined);
                                setFolderNewName('');
                              }}
                            >
                              <img
                                src={cross.src}
                                alt=""
                                className=" h-5 w-5"
                              />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="w-fit min-w-max px-4 text-left text-sm text-gray-600">
                        250kb
                      </td>
                      <td className="mr-auto min-w-max px-4 text-left text-sm text-gray-600">
                        12/12/2021
                      </td>
                      <td className=" w-[100px] items-center px-4">
                        <div className=" flex w-fit gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className=" flex h-8 w-8 items-center justify-center rounded-md bg-gray-100  ">
                                <img
                                  src={linkIcon.src}
                                  alt=""
                                  className=" h-4 w-4"
                                />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Share link generated</DialogTitle>
                                <DialogDescription>
                                  Anyone who has this link will be able to view
                                  this.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex items-center space-x-2">
                                <div className="grid flex-1 gap-2">
                                  <Label htmlFor="link" className="sr-only">
                                    Link
                                  </Label>
                                  <Input
                                    id="link"
                                    defaultValue={`${window.location.origin}/file-manager/folders/${item.id}/files`}
                                    readOnly
                                  />
                                </div>
                                <Button
                                  type="submit"
                                  size="sm"
                                  className="!bg-black px-3"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      `${window.location.origin}/file-manager/folders/${item.id}/files`
                                    );
                                    toast({
                                      title: 'Copied',
                                      description: 'Link copied to clipboard'
                                    });
                                  }}
                                >
                                  <span className="sr-only">Copy</span>
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                  <Button type="button" variant="secondary">
                                    Close
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Popover>
                            <PopoverTrigger asChild>
                              <button className=" flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 ">
                                <img
                                  src={morevert_hori.src}
                                  alt=""
                                  className=" h-5 w-5"
                                />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-fit p-2">
                              <div className="flex min-w-32 flex-col gap-1">
                                <button
                                  className=" rounded-sm px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-700"
                                  onClick={() => {
                                    router.push(
                                      `/file-manager/folders/${item.id}/files`
                                    );
                                  }}
                                >
                                  View
                                </button>
                                <button
                                  className=" rounded-sm px-4 py-2 text-left text-sm  text-gray-600 hover:bg-gray-100 hover:text-blue-700"
                                  onClick={() => {
                                    setEditFolderData(item);
                                    setFolderNewName(item?.folder_display_name);
                                  }}
                                >
                                  Rename
                                </button>
                                <button
                                  className=" rounded-sm px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-700"
                                  onClick={() => {
                                    downloadFolderFun(item.id);
                                  }}
                                >
                                  Download
                                </button>
                                <button
                                  className=" rounded-sm  px-4 py-2 text-left text-sm !text-rose-600 hover:bg-gray-100 hover:!text-rose-800"
                                  onClick={() => {
                                    setDeleteConfirmation({
                                      isOpen: true,
                                      folderCodes: item
                                    });
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </td>
                    </tr>
                  ))}

                {(files?.length ?? 0) > 0 &&
                  files?.map((item, index) => (
                    <tr
                      key={index}
                      className="w-full border-separate border-b border-gray-200"
                    >
                      <td className=" flex items-center justify-center py-6 text-center">
                        <input
                          type="checkbox"
                          className=" size-[15px] h-[18px] w-[18px] appearance-none rounded-sm bg-gray-200 accent-blue-600 checked:appearance-auto"
                          checked={selectedFileDeleteData.ids.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFileDeleteData({
                                ids: [...selectedFileDeleteData.ids, item.id],
                                selectedAll: false
                              });
                              setSelectedDeleteData({
                                ...selectedDeleteData,
                                selectedAll: false
                              });
                            } else {
                              setSelectedFileDeleteData({
                                ids: selectedFileDeleteData.ids.filter(
                                  (id: any) => id !== item.id
                                ),
                                selectedAll: false
                              });
                              setSelectedDeleteData({
                                ...selectedDeleteData,
                                selectedAll: false
                              });
                            }
                          }}
                        />
                      </td>
                      <td className="mr-auto min-w-max px-4 text-left text-sm text-gray-600 ">
                        {!editFileData ||
                        (editFileData && editFileData.id !== item.id) ? (
                          <div className="flex items-center gap-2">
                            <img src={file.src} alt="" className=" h-8 w-8" />
                            {item?.attributes?.original_name?.length > 30 ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-2">
                                      <div className="line-clamp-1">
                                        {item?.attributes?.original_name?.slice(
                                          0,
                                          30
                                        )}
                                        ...
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{item?.attributes?.original_name}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <div className="line-clamp-1">
                                {item?.attributes?.original_name}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <img src={file?.src} alt="" className=" h-8 w-8" />
                            <input
                              type="text"
                              placeholder="Enter the folder name"
                              className=" h-11 w-full max-w-[300px] rounded-md border px-2 text-sm focus:border-gray-200 focus:outline-none"
                              value={fileNewName}
                              onChange={(e) => setFileNewName(e.target.value)}
                            />
                            <button
                              className=" flex h-10 w-10 items-center justify-center gap-2 rounded-md bg-blue-100 text-sm font-medium text-blue-700 hover:opacity-90"
                              onClick={() => updateFileData()}
                            >
                              <img src={tick.src} alt="" className=" h-6 w-6" />
                            </button>
                            <button
                              className=" flex  h-10 w-10 items-center justify-center gap-2 rounded-md bg-rose-50 text-sm font-medium hover:opacity-90"
                              onClick={() => {
                                setEditFileData(undefined);
                                setFileNewName('');
                              }}
                            >
                              <img
                                src={cross.src}
                                alt=""
                                className=" h-5 w-5"
                              />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="w-fit min-w-max px-4 text-left text-sm text-gray-600">
                        {item?.attributes?.file_size}
                      </td>
                      <td className="mr-auto min-w-max px-4 text-left text-sm text-gray-600">
                        {item?.attributes?.uploaded_at
                          .split('T')[0]
                          .split('-')
                          .reverse()
                          .join('/')}
                      </td>
                      <td className=" w-[100px] items-center px-4">
                        <div className=" flex w-fit gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                className=" flex h-8 w-8 items-center justify-center rounded-md bg-gray-100  "
                                onClick={() => {
                                  setGenerateShareLink({
                                    link: '',
                                    loading: false,
                                    copied: false
                                  });
                                  generateShareLinkAPI(item);
                                }}
                              >
                                <img
                                  src={linkIcon.src}
                                  alt=""
                                  className=" h-4 w-4"
                                />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Share link generated</DialogTitle>
                                <DialogDescription>
                                  Anyone who has this link will be able to view
                                  this.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex items-center space-x-2">
                                <div className="grid flex-1 gap-2">
                                  <Label htmlFor="link" className="sr-only">
                                    Link
                                  </Label>
                                  <Input
                                    id="link"
                                    defaultValue={generateShareLink?.link}
                                    readOnly
                                  />
                                </div>
                                <Button
                                  type="submit"
                                  size="sm"
                                  className={`!bg-black px-3 ${
                                    generateShareLink?.copied
                                      ? 'opacity-50'
                                      : 'opacity-100'
                                  } text-white`}
                                  disabled={
                                    generateShareLink?.loading ||
                                    generateShareLink?.copied ||
                                    !generateShareLink?.link
                                  }
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      generateShareLink?.link
                                    );
                                    toast({
                                      title: 'Copied',
                                      description: 'Link copied to clipboard'
                                    });
                                    setGenerateShareLink({
                                      ...generateShareLink,
                                      copied: true
                                    });
                                  }}
                                >
                                  <span className="sr-only">Copy</span>
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <DialogFooter className="sm:justify-start">
                                <DialogClose asChild>
                                  <Button type="button" variant="secondary">
                                    Close
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Popover>
                            <PopoverTrigger asChild>
                              <button className=" flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 ">
                                <img
                                  src={morevert_hori.src}
                                  alt=""
                                  className=" h-5 w-5"
                                />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-fit p-2">
                              <div className="flex min-w-32 flex-col gap-1">
                                {item?.relationships?.permissions?.data?.find(
                                  (permission: any) => permission.id === 'read'
                                ) && (
                                  <button
                                    className=" rounded-sm px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-700"
                                    onClick={() => {
                                      if (!session?.user.apiUserToken) {
                                        toast({
                                          title: 'Error',
                                          description: 'User token is required',
                                          variant: 'destructive'
                                        });

                                        return;
                                      }

                                      if (!item?.attributes?.file_id) {
                                        toast({
                                          title: 'Error',
                                          description: 'File id is required',
                                          variant: 'destructive'
                                        });

                                        return;
                                      }

                                      fetch(
                                        `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/download/${item?.attributes?.file_id}`,
                                        {
                                          method: 'GET',
                                          headers: {
                                            'Content-Type': 'application/json',
                                            Authorization: `Bearer ${session?.user.apiUserToken}`
                                          }
                                        }
                                      )
                                        .then((response) => {
                                          if (!response.ok) {
                                            throw new Error(
                                              'Network response was not ok'
                                            );
                                          }
                                          return response.blob();
                                        })
                                        .then((blob) => {
                                          const url =
                                            window.URL.createObjectURL(blob);
                                          const link =
                                            document.createElement('a');

                                          link.href = url;
                                          link.setAttribute(
                                            'download',
                                            item?.attributes?.original_name
                                          );
                                          document.body.appendChild(link);
                                          link.click();

                                          link.remove();
                                          window.URL.revokeObjectURL(url);
                                        })
                                        .catch((err) => {
                                          console.log(
                                            'Error during fetch:',
                                            err
                                          );
                                        });
                                    }}
                                  >
                                    Download file
                                  </button>
                                )}

                                <button
                                  className=" rounded-sm px-4 py-2 text-left  text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-700"
                                  onClick={() => {
                                    setEditFileData(item);
                                    setFileNewName(
                                      item?.attributes?.original_name
                                    );
                                  }}
                                >
                                  Rename
                                </button>
                                {item?.relationships?.permissions?.data?.find(
                                  (permission: any) =>
                                    permission.id === 'manage_permissions'
                                ) && (
                                  <Dialog
                                    open={dialogOpen2}
                                    onOpenChange={(isOpen) =>
                                      setDialogOpen2(isOpen)
                                    }
                                  >
                                    <DialogTrigger asChild>
                                      <button
                                        className={`rounded-sm px-4 py-2 text-left text-sm  text-gray-600 hover:bg-gray-100 hover:text-blue-700
                                      ${
                                        item?.attributes?.uploaded_user_id ==
                                        session?.user.id
                                          ? ''
                                          : ' cursor-not-allowed opacity-50'
                                      }
                                    `}
                                        onClick={() => {
                                          if (
                                            item?.attributes
                                              ?.uploaded_user_id !=
                                            session?.user.id
                                          ) {
                                            return;
                                          }

                                          setPermissionData({
                                            selectedUser: null,
                                            read: false,
                                            delete: false,
                                            file_id: item.id
                                          });
                                        }}
                                        disabled={
                                          item?.attributes?.uploaded_user_id !=
                                          session?.user.id
                                        }
                                      >
                                        Permissions
                                      </button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>
                                          File access permission
                                        </DialogTitle>
                                        <DialogDescription>
                                          <div className=" grid w-full grid-cols-2 place-items-center gap-5 pt-5">
                                            <div className="col-span-2 block w-full max-w-[400px] px-4 text-start">
                                              <AsyncSelect
                                                // isMulti
                                                cacheOptions
                                                defaultOptions
                                                loadOptions={
                                                  loadUsers as (
                                                    inputValue: string,
                                                    callback: (
                                                      options: OptionsOrGroups<
                                                        string,
                                                        GroupBase<string>
                                                      >
                                                    ) => void
                                                  ) => void
                                                }
                                                onChange={(data) => {
                                                  setPermissionData({
                                                    ...permissionData,
                                                    selectedUser: data
                                                  });
                                                  // call the api to get the permission data of selected user

                                                  if (
                                                    data &&
                                                    data?.value &&
                                                    item?.id
                                                  ) {
                                                    getPermissionDataByUserAndFile(
                                                      item?.id,
                                                      data?.value
                                                    ).then((result) => {
                                                      if (result) {
                                                        console.log(result);
                                                        if (result.length > 0) {
                                                          // setPermissionData({
                                                          //   read: result[0]?.permission_type?.includes(
                                                          //     'read'
                                                          //   ),
                                                          //   delete:
                                                          //     result[0]?.permission_type?.includes(
                                                          //       'delete'
                                                          //     )
                                                          // });
                                                          setPermissionData(
                                                            (prev: any) => {
                                                              return {
                                                                ...prev,
                                                                read: result[0]?.permission_type?.includes(
                                                                  'read'
                                                                ),
                                                                delete:
                                                                  result[0]?.permission_type?.includes(
                                                                    'delete'
                                                                  )
                                                              };
                                                            }
                                                          );
                                                        } else {
                                                          setPermissionData(
                                                            (prev: any) => {
                                                              return {
                                                                ...prev,
                                                                read: false,
                                                                delete: false
                                                              };
                                                            }
                                                          );
                                                        }
                                                      }
                                                    });
                                                  }
                                                }}
                                                value={
                                                  permissionData?.selectedUser
                                                }
                                                placeholder="Search user"
                                                noOptionsMessage={() =>
                                                  'Enter name to search user'
                                                }
                                                styles={{
                                                  control: (styles) => ({
                                                    ...styles,
                                                    width: '100%'
                                                  })
                                                }}
                                              />
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <Switch
                                                id="read"
                                                checked={permissionData?.read}
                                                onCheckedChange={(value) => {
                                                  setPermissionData({
                                                    ...permissionData,
                                                    read: value
                                                  });
                                                }}
                                              />
                                              <Label
                                                htmlFor="read"
                                                className="line-clamp-1"
                                              >
                                                Read
                                              </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <Switch
                                                id="delete"
                                                checked={permissionData?.delete}
                                                onCheckedChange={(value) => {
                                                  setPermissionData({
                                                    ...permissionData,
                                                    delete: value
                                                  });
                                                }}
                                              />
                                              <Label
                                                htmlFor="delete"
                                                className="line-clamp-1"
                                              >
                                                Delete
                                              </Label>
                                            </div>
                                            <Button
                                              className="col-span-2"
                                              onClick={handlePermissionSubmit}
                                            >
                                              Submit
                                            </Button>
                                          </div>
                                        </DialogDescription>
                                      </DialogHeader>
                                    </DialogContent>
                                  </Dialog>
                                )}

                                <Dialog
                                  open={dialogOpen3}
                                  onOpenChange={(isOpen) =>
                                    setDialogOpen3(isOpen)
                                  }
                                >
                                  <DialogTrigger asChild>
                                    <button
                                      className=" rounded-sm px-4 py-2 text-left  text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-700"
                                      onClick={() => {
                                        setSelectedFolder('');
                                        setEditFileDataMove(item);
                                        if (!currentProjectId) {
                                          toast({
                                            title: 'Error',
                                            description: 'Select a project',
                                            variant: 'destructive'
                                          });
                                          return;
                                        }

                                        // if (
                                        //   !folderCodes ||
                                        //   folderCodes?.length === 0
                                        // ) {
                                        //   fetchFolderData();
                                        // }
                                      }}
                                    >
                                      Move to folder
                                    </button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Move file to other folder
                                      </DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                      <div className="grid grid-cols-1 gap-2">
                                        <Label
                                          htmlFor="folder"
                                          className="sr-only"
                                        >
                                          Folder
                                        </Label>
                                        <Select
                                          // className="w-full"
                                          value={selectedFolder.toString()}
                                          onValueChange={(value) =>
                                            setSelectedFolder(value)
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select a project" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {folderCodes?.map((folder) => (
                                              <SelectItem
                                                key={folder.id}
                                                value={folder.id.toString()}
                                              >
                                                {folder.folder_display_name}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>

                                        <Button
                                          type="submit"
                                          className="mx-auto w-fit px-5"
                                          onClick={() => moveToOtherFile()}
                                        >
                                          Move
                                        </Button>
                                      </div>
                                    </DialogDescription>
                                    {/* <DialogFooter className="sm:justify-start">
                                      <DialogClose asChild>
                                        <Button type="button" variant="secondary">
                                          Close
                                        </Button>
                                      </DialogClose>
                                    </DialogFooter> */}
                                  </DialogContent>
                                </Dialog>

                                {item?.relationships?.permissions?.data?.find(
                                  (permission: any) =>
                                    permission.id === 'delete'
                                ) && (
                                  <button
                                    className=" rounded-sm  px-4 py-2 text-left text-sm text-rose-600 hover:bg-gray-100 hover:text-rose-700"
                                    onClick={() => {
                                      setDeleteConfirmation2({
                                        isOpen: true,
                                        file: item
                                      });
                                      console.log(item);
                                    }}
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </td>
                    </tr>
                  ))}

                {!(
                  (filteredFolderCodes?.length ?? 0) > 0 ||
                  (files?.length ?? 0) > 0
                ) && (
                  <tr className="w-full border-separate border-b border-gray-200">
                    <td className=" flex items-center justify-center py-6 text-center"></td>
                    <td
                      className="mr-auto min-w-max py-4 text-left text-sm text-gray-600 "
                      colSpan={4}
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-gray-400">No folders found</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <DeleteConfirmation
        isOpen={deleteConfirmation.isOpen}
        onClose={closeDeleteFolder}
        itemName={deleteConfirmation.folderCodes?.folder_display_name || ''}
        itemType="folder"
        confirmText={deleteConfirmation.folderCodes?.folder_display_name || ''}
        apiEndpoint={`/api/generic-model/folder_Codes/${deleteConfirmation.folderCodes?.id}`}
        redirectPath={`/file-manager/folders`}
      />
      <DeleteConfirmation
        isOpen={deleteConfirmation2.isOpen}
        onClose={closeDeleteFile}
        itemName={deleteConfirmation2.file?.attributes?.original_name || ''}
        itemType="file"
        confirmText={deleteConfirmation2.file?.attributes?.original_name || ''}
        apiEndpoint={`/api/generic-model/file/${deleteConfirmation2.file?.id}`}
        redirectPath={`/file-manager/folders`}
      />
    </div>
  );
};

export default FolderTable;
