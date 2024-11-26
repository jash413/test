'use client';

import { useLoadingAPI } from '@/app/hooks/useLoadingAPI';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import { Separator } from '../ui/separator';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brush,
  Edit,
  EyeIcon,
  EyeOffIcon,
  LogOutIcon,
  Pen,
  PencilIcon,
  PenIcon,
  StickyNote
} from 'lucide-react';

import { Switch } from '@/components/ui/switch';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import 'filepond/dist/filepond.min.css';
import { FilePond } from 'react-filepond';
import { useLoading } from '../LoadingProvider';
import usePagination from '@/hooks/usePagination';
import PaginationComp from '../layout/pagination';

const UserDatails = ({ owner = false }: { owner?: boolean }) => {
  const { data: session, status, update } = useSession();

  const { toast } = useToast();

  console.log('session:', session);

  const router = useRouter();
  const params = useParams();

  const pathname = usePathname();

  const { fetchWithLoading } = useLoadingAPI();

  const [userDetail, setUserDetails] = useState<any>({});

  const [taskDetails, setTaskDetails] = useState<any>([]);

  const [userEditModal, setUserEditModal] = useState(false);
  const [editUserData, setEditUserData] = useState<any>({});

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [fileUploadLoading, setFileUploadLoading] = useState<boolean>(false);
  const [fileRes, setFileRes] = useState<any | undefined>(undefined);

  const [loginEvents, setLoginEvents] = useState<any>([]);
  const [previewUrl, setPreviewUrl] = useState<any>(undefined);

  const [punchListData, setPunchListData] = useState<any[]>([]);

  // password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [showPunchModal, setShowPunchModal] = useState(false);
  const [punchFormData, setPunchFormData] = useState<any>({
    task_id: '',
    punch_item_type: '',
    description: '',
    assignee_to_id: '',
    status: '',
    file_info: '',
    active: '',
    project_id: ''
  });

  const [projects, setProjects] = useState<any[]>([]);

  const [users, setUsers] = useState<any[]>([]);

  const { setIsLoading } = useLoading();

  const handleFileUpload = async (fileRes: any) => {
    setFileUploadLoading(true);

    if (!fileRes) {
      toast({
        title: 'Error',
        description: 'File is required',
        variant: 'destructive'
      });
      console.log('file res');

      return;
    }

    if (!editUserData.id) {
      toast({
        title: 'Error',
        description: 'Error while updating User',
        variant: 'destructive'
      });
      console.log('id');
      return;
    }

    try {
      let response = await fetchWithLoading(`/api/user/${editUserData.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          data: {
            type: 'user',
            attributes: {
              image: fileRes?.file_url
            }
          }
        })
      });

      if (response.status == 200) {
        toast({
          title: 'Success',
          description: 'File uploaded successfully'
        });
        setFileRes(undefined);
        setDialogOpen(false);
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

  const getUser = async () => {
    let id;

    if (owner) {
      id = session?.user?.id;
    } else {
      id = params.userId;
    }

    try {
      let response = await fetchWithLoading(`/api/generic-model/user`);

      if (response) {
        setUserDetails(response?.models[0]);
      } else {
        toast({
          title: 'Error',
          description: 'Error fetching user details',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      console.error('Error fetching users:', error.message);
      toast({
        title: 'Error',
        description: 'Error fetching user details',
        variant: 'destructive'
      });
    }
  };

  const getTasks = async () => {
    let id;

    if (owner) {
      id = session?.user?.id;
    } else {
      id = params.userId;
    }

    try {
      let response = await fetchWithLoading(
        // `/api/generic-model/task`
        `/api/generic-model/task?filter[task_owner]=${id}`
      );

      if (response) {
        setTaskDetails(response?.models);
      } else {
        toast({
          title: 'Error',
          description: 'Error fetching user tasks',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      console.error('Error fetching tasks:', error.message);
      toast({
        title: 'Error',
        description: 'Error fetching user tasks',
        variant: 'destructive'
      });
    }
  };

  const deleteUser = async (id: string) => {
    try {
      let url = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/user/${id}`;

      const response = await fetchWithLoading(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.apiUserToken}`
        }
      });

      if (response.status === 204) {
        getUsers();
        toast({
          title: 'Success',
          description: 'User deleted successfully'
        });
      } else {
        console.error('Error deleting user:', response.statusText);
        toast({
          title: `Error ${response.status}`,
          description: 'Error deleting user',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Error deleting user',
        variant: 'destructive'
      });
    }
  };

  const EditUserDetails = async () => {
    let formData = new FormData();

    let payload = {
      data: {
        type: 'user',
        attributes: {
          first_name: editUserData.first_name,
          middle_name: editUserData.middle_name,
          last_name: editUserData.last_name,
          date_of_birth: editUserData.date_of_birth,
          phone_number_mobile: editUserData.phone_number_mobile,
          phone_number_home: editUserData.phone_number_home,
          email: editUserData.email,
          status: editUserData.status,
          language: editUserData.language
            ? editUserData?.language?.split(',')
            : [],
          admin: editUserData.admin
        }
      }
    };

    if (!editUserData.id) {
      toast({
        title: 'Error',
        description: 'Error while updating User',
        variant: 'destructive'
      });
      return;
    }

    // let objId = payload.id;

    // Object.entries(payload).forEach(([key, value]) => {
    //   if (Array.isArray(value) || typeof value === 'object') {
    //     formData.append(key, JSON.stringify(value));
    //   } else if (value !== undefined && value !== null) {
    //     formData.append(key, value.toString());
    //   }
    // });

    // if (!formData.get('file_info')) {
    //   // replace with empty obj
    //   formData.append('file_info', '{}');
    // }

    // formData.append('file_change_scenario', '4_no_changes_to_files');

    try {
      let response = await fetchWithLoading(`/api/user/${editUserData.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });

      if (response.status == 200) {
        toast({
          title: 'Success',
          description: 'User updated successfully'
        });

        getUsers();
        setUserEditModal(false);
      } else {
        toast({
          title: 'Error',
          description: 'Error while updating User',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Error while updating User',
        variant: 'destructive'
      });
    }
  };

  // /initiate-password-change
  // {
  //   "currentPassword": "string", // User's current password
  //   "newPassword": "string" // New password the user wants to set
  //   }

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: 'Error',
        description: 'All fields are required',
        variant: 'destructive'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive'
      });
      return;
    }

    try {
      let response = await fetchWithLoading(`/api/initiate-password-change`, {
        method: 'POST',
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (response?.token) {
        toast({
          title: 'Success',
          description: 'Password changed successfully'
        });

        // {
        //   "token": "string", // Token received from initiate-password-change
        //   "verificationCode": "string" // Verification code received from initiate-password-change
        //   }

        let resp2 = await fetchWithLoading(`/api/complete-password-change`, {
          method: 'POST',
          body: JSON.stringify({
            token: response?.token,
            verificationCode: response?.verificationCode
          })
        });

        if (resp2?.message) {
          toast({
            title: 'Success',
            description: 'Password changed successfully'
          });

          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else if (resp2?.error) {
          toast({
            title: 'Error',
            description: resp2?.error,
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Error',
            description: 'Error while changing password',
            variant: 'destructive'
          });
        }
      } else if (response?.error) {
        toast({
          title: 'Error',
          description: response?.error,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Error while changing password',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Error while changing password',
        variant: 'destructive'
      });
    }
  };

  const loginEventGet = async () => {
    let id;

    if (owner) {
      id = session?.user?.id;
    } else {
      id = params.userId;
    }

    try {
      let response = await fetchWithLoading(
        `/api/api_Log?filter[endpoint]=/login`
      );

      if (response.status == 200) {
        console.log('login event:', response);
        setLoginEvents(response?.body?.data);
      } else {
        toast({
          title: 'Error',
          description: 'Error fetching login event',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      console.error('Error fetching login event:', error.message);
      toast({
        title: 'Error',
        description: 'Error fetching user tasks',
        variant: 'destructive'
      });
    }
  };

  const loadImagePreview = async (fileUrl: any) => {
    if (!fileUrl) {
      return;
    }

    setIsLoading(true);

    try {
      let response = await fetch(`/api/download/${fileUrl}`);

      if (response) {
        console.log('file:', response);
        // response is text so we need to convert it to previewable image
        let blob = await response.blob();

        // Create a File object from the Blob
        const file = new File([blob], 'previewImg', { type: blob.type });

        let previewUrl = URL.createObjectURL(file);

        console.log('url:', previewUrl);
        setPreviewUrl(previewUrl);
      } else {
        toast({
          title: 'Error',
          description: 'Error fetching file',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      console.error('Error fetching file:', error.message);
      toast({
        title: 'Error',
        description: 'Error fetching file',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPunchData = async () => {
    if (!session?.user.apiUserToken) {
      return;
    }

    try {
      let response = await fetchWithLoading(`/api/generic-model/punchList`);

      if (response) {
        console.log(response);
        setPunchListData(response?.models);
      } else {
        toast({
          title: 'Error',
          description: 'Error while fetching data',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error while fetching data',
        variant: 'destructive'
      });
      console.log(error);
    }
  };

  const getProjects = async () => {
    try {
      let response = await fetchWithLoading(`/api/generic-model/project`);

      if (response) {
        setProjects(response?.models);
      } else {
        toast({
          title: 'Error',
          description: 'Error fetching projects',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      console.error('Error fetching projects:', error.message);
      toast({
        title: 'Error',
        description: 'Error fetching projects',
        variant: 'destructive'
      });
    }
  };

  const getUsers = async () => {
    try {
      let response = await fetchWithLoading(`/api/generic-model/user`);

      if (response) {
        setUsers(response?.models);
      } else {
        toast({
          title: 'Error',
          description: 'Error fetching user details',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      console.error('Error fetching users:', error.message);
      toast({
        title: 'Error',
        description: 'Error fetching user details',
        variant: 'destructive'
      });
    }
  };

  const postPunchData = async () => {
    // {
    //   data: {
    //     type: "punch_List",
    //     attributes: {
    //        task_id: Number(taskId),
    //        punch_item_type: formData.punch_item_type,
    //        description: formData.description,
    //        assignee_to_id: formData.user_id,
    //       status: formData.status,
    //       file_info: formData.file_info,
    //       active: formData.active,
    //        project_id: selectedProject.id,
    //     },
    //   },
    // },
  };

  useEffect(() => {
    loadImagePreview(userDetail?.image);
  }, [userDetail?.image]);

  const itemsPerPage = 10;
  const {
    currentPage,
    totalPages,
    currentData,
    searchQuery,
    handleSearch,
    goToNextPage,
    goToPreviousPage,
    goToPage
  } = usePagination(loginEvents, itemsPerPage);

  useEffect(() => {
    if (session) {
      getUsers();
      getTasks();
      loginEventGet();
      fetchPunchData();
    }
  }, [session]);

  return (
    <>
      {!owner && (
        <nav
          className="flex space-x-4 rounded-t-lg bg-[hsl(var(--secondary))] p-2"
          role="tablist"
        >
          <Link
            href="/team/members/"
            key={'members'}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out ${
              pathname.includes('/team/members')
                ? 'bg-[hsl(var(--sidebar-active))] text-white'
                : 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-white'
            }`}
          >
            Users
          </Link>

          <Link
            href="/team/roles/"
            key={'roles'}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ease-in-out ${
              pathname.includes('/team/roles')
                ? 'bg-[hsl(var(--sidebar-active))] text-white'
                : 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-white'
            }`}
          >
            Roles
          </Link>
        </nav>
      )}
      <div className=" flex !flex-col flex-nowrap gap-10 lg:!flex-row">
        <div className=" mt-3 w-[30%] shrink grow rounded-md border border-gray-200 p-6 shadow-sm">
          <div className=" mt-5">
            <div className=" relative mx-auto h-24 w-24 rounded-full bg-gray-100">
              {userDetail?.image && previewUrl && (
                <img
                  src={previewUrl}
                  alt="user image"
                  className=" h-24 w-24 rounded-full object-cover"
                />
              )}

              <Dialog
                open={dialogOpen}
                onOpenChange={(isOpen) => setDialogOpen(isOpen)}
              >
                <DialogTrigger asChild>
                  <div
                    className=" absolute right-0 top-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-gray-200"
                    onClick={() => {
                      setDialogOpen(true);
                      setEditUserData(userDetail);
                    }}
                  >
                    <Edit size={12} />
                  </div>
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
                        // disabled={fileUploadLoading}
                      >
                        Submit
                      </button>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className=" mt-4 flex flex-col items-center gap-[6px]">
            <h2 className=" text-center text-lg font-medium">
              {userDetail?.name}
            </h2>
            <div className=" rounded-md bg-primary/10 px-4 py-1 text-primary ">
              <p className=" text-xs font-semibold">
                {userDetail?.admin ? 'Admin' : 'User'}
              </p>
            </div>
          </div>
          <div className="">
            <div className=" flex items-center justify-between">
              <h3 className=" font-medium text-black">Details</h3>
              <Dialog
                open={userEditModal}
                onOpenChange={(isOpen) => setUserEditModal(isOpen)}
              >
                <DialogTrigger asChild>
                  <button
                    className=" flex h-fit  items-center gap-2 rounded-md bg-blue-700 px-3 py-2 text-xs font-medium text-white hover:opacity-90"
                    onClick={() => {
                      setUserEditModal(true);
                      setEditUserData(userDetail);
                    }}
                  >
                    <PenIcon size={12} />
                    Edit User
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                      {/* <div className=" max-h-[80vh] overflow-auto scrollbar-thin">
                        <div className=" mt-5 flex flex-wrap gap-4">
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor="btype">
                              Business type
                            </Label>
                            <select
                              name='btype'
                              value={businessEditData?.type}
                              onChange={(e) =>
                                setBusinessEditData({
                                  ...businessEditData,
                                  type: e.target.value
                                })
                              }
                              className="w-full grow rounded border bg-transparent p-2 text-sm focus:border focus:outline-primary active:border active:outline-primary "
                            >
                              <option value="Contractor">Contractor</option>
                              <option value="Supplier">Supplier</option>
                              <option value="Subcontractor">Subcontractor</option>
                            </select>
                          </div>
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor=''>
                              Business structure
                            </Label>
                            <select
                              value={businessEditData?.structure}
                              onChange={(e) =>
                                setBusinessEditData({
                                  ...businessEditData,
                                  structure: e.target.value
                                })
                              }
                              className="grow w-full rounded border bg-transparent p-2 text-sm focus:border focus:outline-primary active:border active:outline-primary "
                            >
                              <option value="Sole Proprietorship">Sole Proprietorship</option>
                              <option value="Partnership">Partnership</option>
                              <option value="Corporation">Corporation</option>
                              <option value="LLC">LLC</option>
                              <option value="Nonprofit">Nonprofit</option>
                              <option value="Cooperative">Cooperative</option>
                            </select>
                          </div>
                        </div>
                        <div className=" mt-5 flex flex-wrap gap-4">
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor=''>
                              Legal Name
                            </Label>
                            <Input
                              type="text"
                              value={businessEditData?.name}
                              onChange={(e) =>
                                setBusinessEditData({
                                  ...businessEditData,
                                  name: e.target.value
                                })
                              }
                              placeholder="Legal Name"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor=''>
                              Years in business
                            </Label>
                            <Input
                              type="text"
                              value={businessEditData?.years_in_business}
                              onChange={(e) =>
                                setBusinessEditData({
                                  ...businessEditData,
                                  years_in_business: e.target.value
                                })
                              }
                              placeholder="Years in business"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                        </div>
                        <div className=" mt-5 flex flex-wrap gap-4">
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor=''>
                              Website
                            </Label>
                            <Input
                              type="text"
                              value={businessEditData?.website}
                              onChange={(e) =>
                                setBusinessEditData({
                                  ...businessEditData,
                                  website: e.target.value
                                })
                              }
                              placeholder="Website"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor=''>
                              Address
                            </Label>
                            <Input
                              type="text"
                              value={businessEditData?.address}
                              onChange={(e) =>
                                setBusinessEditData({
                                  ...businessEditData,
                                  address: e.target.value
                                })
                              }
                              placeholder="Address"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                        </div>
                        <div className=" mt-5 flex flex-wrap gap-4">
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor=''>
                              Email
                            </Label>
                            <Input
                              type="text"
                              value={businessEditData?.email}
                              onChange={(e) =>
                                setBusinessEditData({
                                  ...businessEditData,
                                  email: e.target.value
                                })
                              }
                              placeholder="Email"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor=''>
                              Phone
                            </Label>
                            <Input
                              type="text"
                              value={businessEditData?.phone}
                              onChange={(e) =>
                                setBusinessEditData({
                                  ...businessEditData,
                                  phone: e.target.value
                                })
                              }
                              placeholder="Phone"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                        </div>
                        <div className=" mt-5 flex flex-wrap gap-4">
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor=''>
                              Specializations
                            </Label>
                            <Input
                              type="text"
                              value={businessEditData?.specializations}
                              onChange={(e) =>
                                setBusinessEditData({
                                  ...businessEditData,
                                  specializations: e.target.value
                                })
                              }
                              placeholder="Specializations"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor=''>
                              License number
                            </Label>
                            <Input
                              type="text"
                              value={businessEditData?.license_info}
                              onChange={(e) =>
                                setBusinessEditData({
                                  ...businessEditData,
                                  license_info: e.target.value
                                })
                              }
                              placeholder="License number"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                        </div>
                        <div className=" mt-5 flex flex-wrap gap-4">
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor=''>
                              Insurance number
                            </Label>
                            <Input
                              type="text"
                              value={businessEditData?.insurance_info}
                              onChange={(e) =>
                                setBusinessEditData({
                                  ...businessEditData,
                                  insurance_info: e.target.value
                                })
                              }
                              placeholder="Insurance number"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor=''>
                              Workers comp info
                            </Label>
                            <Input
                              type="text"
                              value={businessEditData?.workers_comp_info}
                              onChange={(e) =>
                                setBusinessEditData({
                                  ...businessEditData,
                                  workers_comp_info: e.target.value
                                })
                              }
                              placeholder="Workers comp info"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                        </div>
                        <div className=" mt-5 flex flex-wrap gap-4">
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor=''>
                              Tax ID
                            </Label>
                            <Input
                              type="text"
                              value={businessEditData?.tax_id}
                              onChange={(e) =>
                                setBusinessEditData({
                                  ...businessEditData,
                                  tax_id: e.target.value
                                })
                              }
                              placeholder="Tax ID"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                          <div className="flex w-full justify-end gap-5">

                            <Button
                              onClick={() => {
                                setBusinessEditModalOpen(false);
                              }}
                              variant="outline"
                              className="!text-xs !font-medium !text-gray-500"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => {
                                handleEditBusiness();
                              }}
                              className="!text-xs !font-medium"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </div> */}
                      <div className=" max-h-[80vh] overflow-auto scrollbar-none">
                        <div className=" mt-5 flex flex-wrap gap-4">
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor="">First Name</Label>
                            <Input
                              type="text"
                              value={editUserData?.first_name}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  first_name: e.target.value
                                })
                              }
                              placeholder="First Name"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor="">Middle Name</Label>
                            <Input
                              type="text"
                              value={editUserData?.middle_name}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  middle_name: e.target.value
                                })
                              }
                              placeholder="Middle Name"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                        </div>
                        <div className=" mt-5 flex flex-wrap gap-4">
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor="">Last Name</Label>
                            <Input
                              type="text"
                              value={editUserData?.last_name}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  last_name: e.target.value
                                })
                              }
                              placeholder="Last Name"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor="">Date of Birth</Label>
                            {/* <Input
                              type="text"
                              value={editUserData?.date_of_birth}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  date_of_birth: e.target.value
                                })
                              }
                              placeholder="Date of Birth"
                              className=" text-[13px] font-normal text-gray-500"
                            /> */}
                            <Input
                              type="date"
                              value={editUserData?.date_of_birth}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  date_of_birth: e.target.value
                                })
                              }
                              placeholder="Date of Birth"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                        </div>
                        <div className=" mt-5 flex flex-wrap gap-4">
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor="">Phone Number Mobile</Label>
                            <Input
                              type="text"
                              value={editUserData?.phone_number_mobile}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  phone_number_mobile: e.target.value
                                })
                              }
                              placeholder="Phone Number Mobile"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor="">Phone Number Home</Label>
                            <Input
                              type="text"
                              value={editUserData?.phone_number_home}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  phone_number_home: e.target.value
                                })
                              }
                              placeholder="Phone Number Home"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                        </div>

                        <div className=" mt-5 flex flex-wrap gap-4">
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor="">Email</Label>
                            <Input
                              type="text"
                              value={editUserData?.email}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  email: e.target.value
                                })
                              }
                              placeholder="Email"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor="">Status</Label>
                            <Input
                              type="text"
                              value={editUserData?.status}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  status: e.target.value
                                })
                              }
                              placeholder="Status"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                        </div>

                        <div className=" mt-5 flex flex-wrap gap-4">
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor="">Language</Label>
                            <Input
                              type="text"
                              value={editUserData?.language}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  language: e.target.value
                                })
                              }
                              placeholder="Language"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                          {/* <div className='flex w-[calc(50%-10px)] flex-col items-start gap-1.5'>
                            <Label htmlFor=''>
                              User Type
                            </Label>
                            <Input
                              type="text"
                              value={editUserData?.user_type}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  user_type: e.target.value
                                })
                              }
                              placeholder="User Type"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div> */}
                        </div>
                        <div className=" mt-5 flex flex-wrap gap-4">
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor="">Address 1</Label>
                            <Input
                              type="text"
                              value={editUserData?.address1}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  address1: e.target.value
                                })
                              }
                              placeholder="Address 1"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor="">Address 2</Label>
                            <Input
                              type="text"
                              value={editUserData?.address2}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  address2: e.target.value
                                })
                              }
                              placeholder="Address 2"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                        </div>

                        <div className=" mt-5 flex flex-wrap gap-4">
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor="">State</Label>
                            <Input
                              type="text"
                              value={editUserData?.state}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  state: e.target.value
                                })
                              }
                              placeholder="State"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                          <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                            <Label htmlFor="">Zipcode</Label>
                            <Input
                              type="text"
                              value={editUserData?.zipcode}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  zipcode: e.target.value
                                })
                              }
                              placeholder="Zipcode"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                        </div>

                        {/* <div className=' mt-5 flex flex-wrap gap-4'>
                          <div className='flex w-[calc(50%-10px)] flex-col items-start gap-1.5'>
                            <Label htmlFor=''>
                              Phone Verified
                            </Label>
                            <Input
                              type="text"
                              value={editUserData?.phone_verified}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  phone_verified: e.target.value
                                })
                              }
                              placeholder="Phone Verified"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                          <div className='flex w-[calc(50%-10px)] flex-col items-start gap-1.5'>
                            <Label htmlFor=''>
                              Email Verified
                            </Label>
                            <Input
                              type="text"
                              value={editUserData?.email_verified}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  email_verified: e.target.value
                                })
                              }
                              placeholder="Email Verified"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                          </div> */}

                        {/* <div className=' mt-5 flex flex-wrap gap-4'>
                          <div className='flex w-[calc(50%-10px)] flex-col items-start gap-1.5'>
                            <Label htmlFor=''>
                              Profile Created
                            </Label>
                            <Input
                              type="text"
                              value={editUserData?.profile_created}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  profile_created: e.target.value
                                })
                              }
                              placeholder="Profile Created"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                          <div className='flex w-[calc(50%-10px)] flex-col items-start gap-1.5'>
                            <Label htmlFor=''>
                              User Fully Onboarded
                            </Label>
                            <Input
                              type="text"
                              value={editUserData?.user_fully_onboarded}
                              onChange={(e) =>
                                setEditUserData({
                                  ...editUserData,
                                  user_fully_onboarded: e.target.value
                                })
                              }
                              placeholder="User Fully Onboarded"
                              className=" text-[13px] font-normal text-gray-500"
                            />
                          </div>
                          </div> */}

                        <div className=" mt-5 flex flex-wrap gap-4">
                          <div className="flex w-full justify-end gap-5">
                            <Button
                              onClick={() => {
                                setUserEditModal(false);
                              }}
                              variant="outline"
                              className="!text-xs !font-medium !text-gray-500"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => {
                                EditUserDetails();
                              }}
                              className="!text-xs !font-medium"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <Separator className=" mt-2" />
            <div className=" mt-4 flex flex-col gap-4">
              <div className=" flex flex-col">
                <p className=" text-sm font-medium">Email</p>
                <p className=" text-sm text-gray-500">
                  {userDetail?.email ?? '-'}
                </p>
              </div>
              <div className=" flex flex-col">
                <p className=" text-sm font-medium">Phone number</p>
                <p className=" text-sm text-gray-500">
                  {userDetail?.phone_number_mobile ?? '-'}
                </p>
              </div>
              <div className=" flex flex-col">
                <p className=" text-sm font-medium">Phone number ( Home )</p>
                <p className=" text-sm text-gray-500">
                  {userDetail?.phone_number_home ?? '-'}
                </p>
              </div>
              <div className=" flex flex-col">
                <p className=" text-sm font-medium">
                  First name - Middle name - Last name
                </p>
                <p className=" text-sm text-gray-500">
                  {userDetail?.first_name ||
                  userDetail?.middle_name ||
                  userDetail?.last_name
                    ? `${userDetail?.first_name} - ${userDetail?.middle_name} - ${userDetail?.last_name}`
                    : 'Not provided'}
                </p>
              </div>
              <div className=" flex flex-col">
                <p className=" text-sm font-medium">Date of birth</p>
                <p className=" text-sm text-gray-500">
                  {userDetail?.date_of_birth ?? '-'}
                </p>
              </div>
              <div className=" flex flex-col">
                <p className=" text-sm font-medium">Phone verified</p>
                <p className=" text-sm text-gray-500">
                  {userDetail?.phone_verified
                    ? userDetail.phone_verified?.split('T')?.[0]
                    : 'No'}
                </p>
              </div>
              <div className=" flex flex-col">
                <p className=" text-sm font-medium">Email verified</p>
                <p className=" text-sm text-gray-500">
                  {userDetail?.email_verified
                    ? userDetail.email_verified?.split('T')?.[0]
                    : 'No'}
                </p>
              </div>
              <div className=" flex flex-col">
                <p className=" text-sm font-medium">Status</p>
                <p className=" text-sm text-gray-500">
                  {userDetail?.status ?? '-'}
                </p>
              </div>
              <div className=" flex flex-col">
                <p className=" text-sm font-medium">Language</p>
                <p className=" text-sm text-gray-500">
                  {userDetail?.language?.join(', ')}
                </p>
              </div>
              <div className=" flex flex-col">
                <p className=" text-sm font-medium">Profile created</p>
                <p className=" text-sm text-gray-500">
                  {userDetail?.profile_created ? 'Yes' : 'No'}
                </p>
              </div>
              <div className=" flex flex-col">
                <p className=" text-sm font-medium">User fully onboarded</p>
                <p className=" text-sm text-gray-500">
                  {userDetail?.user_fully_onboarded ? 'Yes' : 'No'}
                </p>
              </div>
              <div className=" flex flex-col">
                <p className=" text-sm font-medium">User type</p>
                <p className=" text-sm text-gray-500">
                  {userDetail?.user_type ?? '-'}
                </p>
              </div>
              <div className=" flex flex-col">
                <p className=" text-sm font-medium">Address 1</p>
                <p className=" text-sm text-gray-500">
                  {userDetail?.address1 ?? '-'}
                </p>
              </div>
              <div className=" flex flex-col">
                <p className=" text-sm font-medium">Address 2</p>
                <p className=" text-sm text-gray-500">
                  {userDetail?.address2 ?? '-'}
                </p>
              </div>
              <div className=" flex flex-col">
                <p className=" text-sm font-medium">State</p>
                <p className=" text-sm text-gray-500">
                  {userDetail?.state ?? '-'}
                </p>
              </div>
              <div className=" flex flex-col">
                <p className=" text-sm font-medium">Zipcode</p>
                <p className=" text-sm text-gray-500">
                  {userDetail?.zipcode ?? '-'}
                </p>
              </div>
            </div>
          </div>
          <div className=""></div>
        </div>
        <div className=" w-[calc(70%-50px)] shrink grow">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="my-2 gap-2 bg-transparent">
              <TabsTrigger
                value="overview"
                className=" mx-2 rounded-none bg-transparent px-0 text-base data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="event-logs"
                className=" mx-2 rounded-none bg-transparent px-0 text-base data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
              >
                Events & Logs
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className=" flex w-full flex-col gap-6">
                <Card className=" rounded-md bg-white px-2 shadow-sm">
                  <div className=" flex w-full justify-between p-5">
                    <div className=" flex flex-col">
                      <h3 className=" text-lg font-semibold">
                        User&apos;s Schedule
                      </h3>
                      <p className=" text-sm font-medium text-gray-400">
                        {punchListData?.length} Upcoming meetings
                      </p>
                    </div>

                    <Dialog
                      open={showPunchModal}
                      onOpenChange={(isOpen) => setShowPunchModal(isOpen)}
                    >
                      <DialogTrigger asChild>
                        <div
                          onClick={() => {
                            setShowPunchModal(true);
                            getUsers();
                            getProjects();
                          }}
                          className=" flex h-fit cursor-pointer items-center gap-2 rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-primary hover:opacity-90"
                        >
                          <PencilIcon size={16} />
                          Add Schedule
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className=" pb-2">
                            Add Schedule
                          </DialogTitle>
                          <DialogDescription>
                            <div className=" flex max-h-[80vh] flex-col gap-2 overflow-auto scrollbar-none">
                              <div className=" flex flex-wrap gap-4">
                                <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                                  <Label htmlFor="">Task id</Label>
                                  <select
                                    value={punchFormData?.task_id}
                                    onChange={(e) =>
                                      setPunchFormData({
                                        ...punchFormData,
                                        task_id: e.target.value
                                      })
                                    }
                                    className="w-full grow rounded border bg-transparent p-2 text-sm focus:border focus:outline-primary active:border active:outline-primary"
                                  >
                                    {taskDetails?.map(
                                      (item: any, index: any) => (
                                        <option key={index} value={item.id}>
                                          {item.task_name}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </div>
                                <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                                  <Label htmlFor="">Project id</Label>
                                  <select
                                    value={punchFormData?.project_id}
                                    onChange={(e) =>
                                      setPunchFormData({
                                        ...punchFormData,
                                        project_id: e.target.value
                                      })
                                    }
                                    className="w-full grow rounded border bg-transparent p-2 text-sm focus:border focus:outline-primary active:border active:outline-primary"
                                  >
                                    {projects?.map((item: any, index: any) => (
                                      <option key={index} value={item.id}>
                                        {item.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              {/* assigni to & punch_item_type */}
                              <div className=" flex flex-wrap gap-4">
                                <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                                  <Label htmlFor="">Assign to</Label>
                                  <select
                                    value={punchFormData?.assignee_to_id}
                                    onChange={(e) =>
                                      setPunchFormData({
                                        ...punchFormData,
                                        assignee_to_id: e.target.value
                                      })
                                    }
                                    className="w-full grow rounded border bg-transparent p-2 text-sm focus:border focus:outline-primary active:border active:outline-primary"
                                  >
                                    {users?.map((item: any, index: any) => (
                                      <option key={index} value={item.id}>
                                        {item.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                                  <Label htmlFor="">Punch item type</Label>
                                  <Input
                                    type="text"
                                    value={punchFormData?.punch_item_type}
                                    onChange={(e) =>
                                      setPunchFormData({
                                        ...punchFormData,
                                        punch_item_type: e.target.value
                                      })
                                    }
                                    placeholder="Punch item type"
                                    className=" text-[13px] font-normal text-gray-500"
                                  />
                                </div>
                              </div>

                              {/* description full */}
                              <div className="flex w-full flex-col items-start gap-1.5">
                                <Label htmlFor="">Description</Label>
                                <Input
                                  type="text"
                                  value={punchFormData?.description}
                                  onChange={(e) =>
                                    setPunchFormData({
                                      ...punchFormData,
                                      description: e.target.value
                                    })
                                  }
                                  placeholder="Description"
                                  className=" text-[13px] font-normal text-gray-500"
                                />
                              </div>

                              {/* status & active */}
                              <div className=" flex flex-wrap gap-4">
                                <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                                  <Label htmlFor="">Status</Label>
                                  <select
                                    value={punchFormData?.status}
                                    onChange={(e) =>
                                      setPunchFormData({
                                        ...punchFormData,
                                        status: e.target.value
                                      })
                                    }
                                    className="w-full grow rounded border bg-transparent p-2 text-sm focus:border focus:outline-primary active:border active:outline-primary"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                  </select>
                                </div>
                                <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                                  <Label htmlFor="">Active</Label>
                                  <select
                                    value={punchFormData?.active}
                                    onChange={(e) =>
                                      setPunchFormData({
                                        ...punchFormData,
                                        active: e.target.value
                                      })
                                    }
                                    className="w-full grow rounded border bg-transparent p-2 text-sm focus:border focus:outline-primary active:border active:outline-primary"
                                  >
                                    {/* active & inactive */}
                                    <option value={'true'}>Active</option>
                                    <option value={'false'}>Inactive</option>
                                  </select>
                                </div>
                              </div>

                              {/* submit */}
                              <div className=" mt-3 flex w-full justify-end gap-5">
                                <Button
                                  onClick={() => {
                                    setShowPunchModal(false);
                                    setPunchFormData({});
                                  }}
                                  variant="outline"
                                  className="!text-xs !font-medium !text-gray-500"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => {
                                    postPunchData();
                                  }}
                                  className="!text-xs !font-medium"
                                >
                                  Save
                                </Button>
                              </div>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className=" flex w-full flex-col gap-5 py-5">
                    {punchListData
                      ?.slice(0, 4)
                      ?.map((item: any, index: any) => (
                        <div
                          key={index}
                          className=" relative my-1 flex h-fit items-center justify-between pl-8 pr-5"
                        >
                          <div className=" absolute left-3 top-0 h-full w-[4px] rounded-sm bg-gray-200"></div>
                          <div className=" flex grow flex-col">
                            <p className="mb-[3px] text-xs font-medium text-gray-800">
                              {/* 14:30 - 15:30 PM */}
                              {
                                item?.created_at?.split('T')?.[1]?.split('.')[0]
                              }{' '}
                              -{' '}
                              {item?.updated_at?.split('T')?.[1]?.split('.')[0]}
                            </p>
                            <h3 className=" mb-[1px] text-[15px] font-semibold">
                              {/* Meeting with John Doe */}
                              {item?.description}
                            </h3>
                            <p className=" text-xs font-medium text-gray-400">
                              Lead by{' '}
                              {/* <span className=" text-primary">Karina Clarke</span> */}
                              <span className=" text-primary">
                                {item?.assignee_to_id}
                              </span>
                            </p>
                          </div>
                          <div className=" flex h-fit cursor-pointer items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-xs hover:bg-gray-200 hover:opacity-90">
                            View
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
                <Card className=" rounded-md bg-white px-2 shadow-sm">
                  <div className=" flex w-full justify-between p-5">
                    <div className=" flex flex-col">
                      <h3 className=" text-lg font-semibold">
                        User&apos;s Task
                      </h3>
                      <p className=" text-sm font-medium text-gray-400">
                        Total {taskDetails?.length} tasks in backlog
                      </p>
                    </div>
                    <div className=" flex h-fit cursor-pointer items-center gap-2 rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-primary hover:opacity-90">
                      <PencilIcon size={16} />
                      Add Task
                    </div>
                  </div>
                  <div className=" flex w-full flex-col gap-5 py-3">
                    {taskDetails
                      ?.slice(0, 3)
                      ?.map((item: any, index: number) => (
                        <div
                          key={index}
                          className=" relative my-1 flex h-fit items-center justify-between pl-8 pr-5"
                        >
                          <div className=" absolute left-3 top-0 h-full w-[4px] rounded-sm bg-gray-200"></div>
                          <div className=" flex grow flex-col">
                            <h3 className=" mb-[1px] text-[15px] font-semibold">
                              {item?.task_name}
                            </h3>
                            <p className=" text-xs font-medium text-gray-400">
                              estimated {item?.days_estimated} days
                              <span className=" text-primary">
                                {' '}
                                Karina Clarke
                              </span>
                            </p>
                          </div>
                          <div className=" flex h-fit cursor-pointer items-center gap-2 rounded-md bg-gray-100 px-2 py-2 text-xs hover:bg-gray-200 hover:opacity-90">
                            <StickyNote size={12} />
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
                <Card className=" rounded-md bg-white px-2 shadow-sm">
                  <div className=" flex w-full justify-between p-5">
                    <div className=" flex flex-col">
                      <h3 className=" text-lg font-semibold">
                        User&apos;s Notifications
                      </h3>
                      {/* <p className=" text-sm font-medium text-gray-400">
                        Total 25 tasks in backlog
                      </p> */}
                    </div>
                    {/* <div className=" flex h-fit cursor-pointer items-center gap-2 rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-primary hover:opacity-90">
                      <PencilIcon size={16} />
                      Add Task
                    </div> */}
                  </div>
                  <div className=" flex w-full flex-col gap-5 p-5 py-3">
                    {/* 2 switch button of email & text */}

                    <div className=" flex items-center justify-between">
                      <div className=" flex flex-col">
                        <h3 className=" text-base font-semibold">
                          Email Notifications
                        </h3>
                        <p className=" text-xs font-medium text-gray-400">
                          Receive email notifications
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className=" flex items-center justify-between">
                      <div className=" flex flex-col">
                        <h3 className=" text-base font-semibold">
                          Text Notifications
                        </h3>
                        <p className=" text-xs font-medium text-gray-400">
                          Receive text notifications
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </Card>
                <Card className=" rounded-md bg-white px-2 shadow-sm">
                  <div className=" flex w-full justify-between p-5">
                    <div className=" flex flex-col">
                      <h3 className=" text-lg font-semibold">
                        Change Password
                      </h3>
                      <p className=" text-sm font-medium text-gray-400">
                        Enter current and new password to change password
                      </p>
                    </div>
                  </div>
                  <div className=" flex w-full flex-col gap-5 p-5 py-3">
                    <div className=" flex flex-col gap-4">
                      <div className=" flex flex-col">
                        <Label htmlFor="current-password">
                          Current Password
                        </Label>
                        <div className=" relative">
                          <Input
                            // type="password"
                            type={showPassword?.current ? 'text' : 'password'}
                            placeholder="Enter current password"
                            className=" text-[13px] font-normal text-gray-500"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                          <div
                            className=" absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer"
                            onClick={() => {
                              setShowPassword({
                                ...showPassword,
                                current: !showPassword?.current
                              });
                            }}
                          >
                            {!showPassword?.current ? (
                              <EyeOffIcon size={16} />
                            ) : (
                              <EyeIcon size={16} />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className=" flex flex-col">
                        <Label htmlFor="new-password">New Password</Label>
                        <div className=" relative">
                          <Input
                            // type="password"
                            type={showPassword?.new ? 'text' : 'password'}
                            placeholder="Enter new password"
                            className=" text-[13px] font-normal text-gray-500"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <div
                            className=" absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer"
                            onClick={() => {
                              setShowPassword({
                                ...showPassword,
                                new: !showPassword?.new
                              });
                            }}
                          >
                            {!showPassword?.new ? (
                              <EyeOffIcon size={16} />
                            ) : (
                              <EyeIcon size={16} />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className=" flex flex-col">
                        <Label htmlFor="confirm-password">
                          Confirm Password
                        </Label>
                        <div className=" relative">
                          <Input
                            // type="password"
                            type={showPassword?.confirm ? 'text' : 'password'}
                            placeholder="Enter confirm password"
                            className=" text-[13px] font-normal text-gray-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                          <div
                            className=" absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer"
                            onClick={() => {
                              setShowPassword({
                                ...showPassword,
                                confirm: !showPassword?.confirm
                              });
                            }}
                          >
                            {!showPassword?.confirm ? (
                              <EyeOffIcon size={16} />
                            ) : (
                              <EyeIcon size={16} />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className=" flex w-full gap-5">
                        <Button
                          variant="outline"
                          className="!text-xs !font-medium !text-gray-500"
                          onClick={() => {
                            setNewPassword('');
                            setCurrentPassword('');
                            setConfirmPassword('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="!text-xs !font-medium"
                          onClick={() => {
                            handlePasswordChange();
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="event-logs">
              <Card className=" rounded-md bg-white px-6 py-3 shadow-sm">
                <div className=" flex w-full justify-between py-2">
                  <div className=" flex flex-col">
                    <h3 className=" text-lg font-semibold">Login Sessions</h3>
                  </div>
                  {/*} <div className=" flex h-fit cursor-pointer items-center gap-2 rounded-md bg-blue-100 px-4 py-2 text-xs font-medium text-primary hover:opacity-90">
                    <LogOutIcon size={16} />
                    Signout all sessions
                  </div> */}
                </div>
                {/* table with bottom border */}
                <table className=" mt-4 w-full border-b border-gray-200">
                  <thead className=" bg-gray-50">
                    <tr className=" py-1 text-start">
                      <th className=" px-1 py-5 text-start text-xs font-medium text-gray-500">
                        Date
                      </th>
                      <th className=" py-5 text-start text-xs font-medium text-gray-500">
                        IP Address
                      </th>
                      <th className=" py-5 text-start text-xs font-medium text-gray-500">
                        Location
                      </th>
                      <th className=" py-5 text-start text-xs font-medium text-gray-500">
                        Device
                      </th>
                      <th className=" py-5 text-start text-xs font-medium text-gray-500">
                        Browser
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData?.map((item: any, index: any) => (
                      <tr
                        key={index}
                        className=" 2 border-b border-gray-200 text-start last:border-b-0"
                      >
                        <td className=" px-1 py-5 text-xs font-medium text-gray-800">
                          {item?.attributes?.created_at?.split('T')?.[0]}
                        </td>
                        <td className=" py-5 text-xs font-medium text-gray-800">
                          {item?.attributes?.request_headers?.['x-real-ip']}
                        </td>
                        <td className=" py-5 text-xs font-medium text-gray-800">
                          {
                            item?.attributes?.request_headers?.[
                              'x-vercel-ip-city'
                            ]
                          }
                          ,{' '}
                          {
                            item?.attributes?.request_headers?.[
                              'x-vercel-ip-country'
                            ]
                          }
                        </td>
                        <td className=" py-5 text-xs font-medium text-gray-800">
                          {item?.attributes?.request_headers?.['user-agent']}
                        </td>
                        <td className=" py-5 text-xs font-medium text-gray-800">
                          {item?.attributes?.request_headers?.['user-agent']}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className=" my-3 ml-auto block w-fit">
                  <PaginationComp
                    totalPages={totalPages}
                    currentPage={currentPage}
                    goToNextPage={goToNextPage}
                    goToPreviousPage={goToPreviousPage}
                    goToPage={goToPage}
                  />
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default UserDatails;
