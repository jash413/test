//file : components/user-management/UserTable.tsx

'use client';

import { use, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import morevert_hori from '@/public/assets/morevert_horizontal.svg';
import { Eye, EyeIcon, MessageSquare, Plus, Trash2 } from 'lucide-react';
import { User } from 'lucide-react';
import usePagination from '@/hooks/usePagination';
import PaginationComp from '../layout/pagination';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { useSession } from 'next-auth/react';

import { useToast } from '@/hooks/use-toast';
import { useLoadingAPI } from '@/app/hooks/useLoadingAPI';
import Link from 'next/link';
import { getBusinessUserRoles } from '@/server/auth/user';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '../ui/switch';
import { initiateOneToOneConversation } from '@/helpers/chat-helpers/initiateOneToOneConversation';

const UserTable = ({ tabFlag = false }: { tabFlag?: boolean }) => {
  const { data: session, status, update } = useSession();

  const { toast } = useToast();

  const router = useRouter();

  const dialogRef = useRef(null);

  const { fetchWithLoading } = useLoadingAPI();

  const [userList, setUserList] = useState<any[]>([]);

  const [currentModalItem, setCurrentModalItem] = useState<any | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);

  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [selectedBusinessUserRole, setSelectedBusinessUserRole] = useState<
    any | null
  >('');

  const [invitationData, setInvitationData] = useState({
    email: '',
    name: '',
    phone_number: '',
    role: '',
    business_name: ''
  });

  const pathname = usePathname();

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
  } = usePagination(userList, itemsPerPage);

  const getBusinessUserRole = async () => {
    if (!session?.user.apiUserToken) {
      return;
    }

    try {
      let response = await fetchWithLoading(
        // `/api/business_User_Roles`
        `/api/business_User_Roles?filter[business_id]=${session?.user.business_info?.business_id}`
      );

      if (response) {
        setUserList(response?.body?.data);
        console.log(response);
      } else {
        toast({
          title: 'Error',
          description: 'Error while fetching data',
          variant: 'destructive'
        });
        setUserList([]);
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

  const deleteUser = async (id: string) => {
    try {
      let url = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/zen/user/${id}`;

      const response = await fetchWithLoading(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.apiUserToken}`
        }
      });

      if (response.status === 204) {
        getBusinessUserRole();
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

  const deleteUserRole = async (userItem: any, userRole: string) => {
    let userRoles = userItem?.attributes?.role_codes.filter(
      (item: any) => item !== userRole
    );

    try {
      let response = await fetchWithLoading(
        `/api/business_User_Roles/${userItem.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              type: 'business_User_Roles',
              attributes: {
                role_codes: userRoles
              }
            }
          })
        }
      );

      if (response.status === 200) {
        currentModalItem.attributes.role_codes = userRoles;
        // change the user list
        let updatedUserList = userList.map((item: any) => {
          if (item.id === userItem.id) {
            return currentModalItem;
          }
          return item;
        });
        toast({
          title: 'Success',
          description: 'Role deleted successfully'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Error while deleting role',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error while deleting role',
        variant: 'destructive'
      });
      console.log(error);
    }
  };

  const addUserRole = async (userItem: any, userRole: string) => {
    // append the new role to the existing roles

    if (userRole === '') {
      toast({
        title: 'Error',
        description: 'Please select a role',
        variant: 'destructive'
      });
      return;
    }

    let userRoles = userItem?.attributes?.role_codes;

    let checkAlreadyExist = userRoles.find((item: any) => item === userRole);

    if (checkAlreadyExist) {
      toast({
        title: 'Error',
        description: 'Role already exists',
        variant: 'destructive'
      });
      return;
    }

    userRoles.push(userRole);

    try {
      let response = await fetchWithLoading(
        `/api/business_User_Roles/${userItem.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              type: 'business_User_Roles',
              attributes: {
                role_codes: userRoles
              }
            }
          })
        }
      );

      if (response.status === 200) {
        currentModalItem.attributes.role_codes = userRoles;
        // change the user list
        let updatedUserList = userList.map((item: any) => {
          if (item.id === userItem.id) {
            return currentModalItem;
          }
          return item;
        });

        setUserList(updatedUserList);

        setDialogOpen(false);

        toast({
          title: 'Success',
          description: 'Role deleted successfully'
        });

        setSelectedBusinessUserRole('');
      } else {
        toast({
          title: 'Error',
          description: 'Error while deleting role',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error while deleting role',
        variant: 'destructive'
      });
      console.log(error);
    }
  };

  const fetchBusinessRolePermissions = async () => {
    if (!session?.user.apiUserToken) {
      return;
    }

    try {
      let response = await fetchWithLoading(
        // `/api/generic-model/business_Roles_Permissions`
        `/api/generic-model/business_Roles_Permissions?filter[business_id]=${session?.user.business_info?.business_id}`
      );

      if (response) {
        setAvailableRoles(response?.models);
      } else {
        toast({
          title: 'Error',
          description: 'Error while fetching data',
          variant: 'destructive'
        });

        setAvailableRoles([]);
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

  useEffect(() => {
    if (session?.user?.apiUserToken) {
      getBusinessUserRole();
    }
  }, [session?.user?.apiUserToken]);

  return (
    <>
      {!tabFlag && (
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
      <div className=" w-full rounded-md border border-gray-100 bg-white px-7 py-5 shadow-sm">
        <div className=" flex items-center justify-between">
          <div className=" relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value, 'name')}
              placeholder="Search by name"
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
            <Dialog
              open={userDialogOpen}
              onOpenChange={(prev) => setUserDialogOpen(prev)}
            >
              <DialogTrigger asChild>
                <button
                  className=" flex h-fit items-center gap-2 rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:opacity-90"
                  onClick={() => {
                    fetchBusinessRolePermissions();
                    setUserDialogOpen(true);
                  }}
                >
                  <Plus size={20} />
                  Add User
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite User</DialogTitle>
                  <DialogDescription>
                    <div className=" mt-3 flex flex-col gap-3">
                      <Input
                        placeholder="Name"
                        value={invitationData.name}
                        onChange={(e: any) =>
                          setInvitationData({
                            ...invitationData,
                            name: e.target.value
                          })
                        }
                        className=" w-full"
                      />
                      <Input
                        placeholder="Email"
                        value={invitationData.email}
                        onChange={(e: any) =>
                          setInvitationData({
                            ...invitationData,
                            email: e.target.value
                          })
                        }
                      />
                      <Input
                        placeholder="Phone Number"
                        value={invitationData.phone_number}
                        onChange={(e: any) =>
                          setInvitationData({
                            ...invitationData,
                            phone_number: e.target.value
                          })
                        }
                      />
                      <select
                        className="grow rounded border bg-transparent p-2 text-sm focus:border focus:outline-primary active:border active:outline-primary "
                        value={selectedBusinessUserRole}
                        onChange={(e) =>
                          setSelectedBusinessUserRole(e.target.value)
                        }
                        placeholder="Select role"
                      >
                        <option value="">Select role</option>
                        {availableRoles.map((option) => (
                          <option
                            key={option.role_code}
                            value={option.role_code}
                          >
                            {option.role_code}
                          </option>
                        ))}
                      </select>
                      <Input
                        placeholder="Business Name"
                        value={invitationData.business_name}
                        onChange={(e: any) =>
                          setInvitationData({
                            ...invitationData,
                            business_name: e.target.value
                          })
                        }
                      />
                      <Button
                        onClick={() => {
                          setUserDialogOpen(false);
                          console.log(session?.user.apiUserToken);
                          console.log(invitationData);
                        }}
                      >
                        Invite
                      </Button>
                    </div>
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
                    className=" size-[15px] h-[18px] w-[18px] appearance-none rounded-sm bg-gray-200 accent-blue-600 checked:appearance-auto "
                  />
                </th>
                <th className="mr-auto min-w-max px-4 text-left text-xs text-gray-400">
                  NAME
                </th>
                <th className="mr-auto min-w-max px-4 text-left text-xs text-gray-400">
                  INITIATE CHAT
                </th>
                <th className="mr-auto min-w-max px-4 text-left text-xs text-gray-400">
                  EMAIL
                </th>
                <th className="mr-auto min-w-max px-4 text-left text-xs text-gray-400">
                  ROLES
                </th>
                {/* <th className="mr-auto min-w-max px-4 text-left text-xs text-gray-400">
                  status
                </th>
                <th className="mr-auto min-w-max px-4 text-left text-xs text-gray-400">
                  ADMIN
                </th>
                <th className="mr-auto min-w-max px-4 text-left text-xs text-gray-400">
                  ONBOARDED
                </th> */}
                <th className="mr-auto min-w-max px-4 text-left text-xs text-gray-400">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {(currentData?.length ?? 0) > 0 ? (
                currentData?.map((item, index) => (
                  <tr
                    className="w-full border-separate border-b border-gray-200"
                    key={index}
                  >
                    <td className=" flex items-center justify-center py-6 text-center">
                      <input
                        type="checkbox"
                        className=" size-[15px] h-[18px] w-[18px] appearance-none rounded-sm bg-gray-200 accent-blue-600 checked:appearance-auto"
                      />
                    </td>
                    <td className="mr-auto min-w-max px-4 text-left text-sm text-gray-600 ">
                      <div
                        className="flex cursor-pointer items-center gap-2 hover:text-blue-700"
                        onClick={() => {
                          router.push(`/team/members/${item.id}`);
                        }}
                      >
                        {/* <img src={} alt="" className=" h-8 w-8" /> */}
                        <div className=" flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                          {item?.included?.user?.image ? (
                            <img
                              src={item?.included?.user?.image}
                              alt=""
                              className=" h-8 w-8 rounded-full"
                            />
                          ) : (
                            <User size={20} />
                          )}
                        </div>
                        {item?.included?.user?.name}
                      </div>
                    </td>
                    <td className="mr-auto min-w-max px-4 text-left text-sm text-gray-600">
                      <MessageSquare
                        size={20}
                        className=" cursor-pointer"
                        onClick={() => {
                          initiateOneToOneConversation(item?.id, () => {
                            router.push(`/communication/messages`);
                          });
                        }}
                      />
                    </td>
                    {/* <td className="w-fit min-w-max px-4 text-left text-sm text-gray-600">
                      {item?.phone_number_mobile}
                    </td> */}
                    <td className="mr-auto min-w-max px-4 text-left text-sm text-gray-600">
                      {item?.included?.user?.email}
                    </td>
                    <td className="mr-auto min-w-max px-4 text-left text-sm text-gray-600">
                      <Dialog>
                        <DialogTrigger asChild>
                          <EyeIcon
                            size={20}
                            className=" cursor-pointer"
                            onClick={() => {
                              setCurrentModalItem(item);
                            }}
                          />
                        </DialogTrigger>
                        <DialogContent className=" max-h-[90vh] overflow-y-auto scrollbar-none">
                          <DialogHeader>
                            <DialogTitle></DialogTitle>
                            <DialogDescription>
                              <div className=" mt-5 w-full overflow-x-auto">
                                <div className=" flex items-center justify-between px-4 py-4">
                                  <div className=" text-base font-semibold text-black">
                                    {currentModalItem?.included?.user?.name}
                                  </div>
                                  <div className="">
                                    <Dialog
                                      open={dialogOpen}
                                      onOpenChange={(prev) =>
                                        setDialogOpen(prev)
                                      }
                                    >
                                      <DialogTrigger asChild>
                                        <button
                                          className="rounded-md bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-700 hover:opacity-90"
                                          onClick={() => {
                                            setDialogOpen(true);
                                            fetchBusinessRolePermissions();
                                          }}
                                        >
                                          Add Role
                                        </button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Add Role</DialogTitle>
                                          <DialogDescription>
                                            <div className=" flex gap-3">
                                              <select
                                                className="grow rounded border p-1 text-sm"
                                                value={selectedBusinessUserRole}
                                                onChange={(e) =>
                                                  setSelectedBusinessUserRole(
                                                    e.target.value
                                                  )
                                                }
                                                placeholder="Select role"
                                              >
                                                <option value="">
                                                  Select role
                                                </option>
                                                {availableRoles.map(
                                                  (option) => (
                                                    <option
                                                      key={option.role_code}
                                                      value={option.role_code}
                                                    >
                                                      {option.role_code}
                                                    </option>
                                                  )
                                                )}
                                              </select>

                                              <button
                                                className=" flex h-fit items-center gap-2 rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:opacity-90"
                                                onClick={() => {
                                                  addUserRole(
                                                    currentModalItem,
                                                    selectedBusinessUserRole
                                                  );
                                                }}
                                              >
                                                Add
                                              </button>
                                            </div>
                                          </DialogDescription>
                                        </DialogHeader>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                </div>
                                <table className=" w-full min-w-max">
                                  <thead>
                                    <tr className=" w-full border-separate border-b border-gray-200">
                                      <th className=" min-w-60 grow p-2 px-4 text-left  text-xs text-gray-400">
                                        FEATURE
                                      </th>
                                      <th className=" p-2 px-4 text-left  text-xs text-gray-400">
                                        DELETE
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {/* {Object.keys(roleItem?.feature_permissions || {}).map((item: any, index: number) => ( */}
                                    {currentModalItem?.attributes?.role_codes.map(
                                      (item: any, index: number) => (
                                        <tr
                                          className="w-full border-separate border-b border-gray-200"
                                          key={index}
                                        >
                                          <td className="min-w-max p-2 px-4 text-left text-sm text-gray-600">
                                            {item}
                                          </td>
                                          <td className="min-w-max p-2 px-4 text-left text-sm text-gray-600">
                                            <button
                                              className="rounded-sm px-4 py-2 text-left text-sm  text-gray-600 hover:bg-gray-100 hover:text-blue-700"
                                              onClick={() => {
                                                deleteUserRole(
                                                  currentModalItem,
                                                  item
                                                );
                                              }}
                                            >
                                              <Trash2 size={20} />
                                            </button>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </td>
                    {/* <td className="mr-auto min-w-max px-4 text-left text-sm text-gray-600">
                      {item?.status ? item?.status : '-'}
                    </td>
                    <td className="mr-auto min-w-max px-4 text-left text-sm text-gray-600">
                      {item?.admin ? 'Yes' : 'No'}
                    </td>
                    <td className="mr-auto min-w-max px-4 text-left text-sm text-gray-600">
                      {item?.user_fully_onboarded ? 'Yes' : 'No'}
                    </td> */}
                    <td className=" w-[100px] items-center px-4">
                      <div className=" mx-auto flex w-fit gap-2">
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
                                  router.push(`/team/members/${item.id}`);
                                }}
                              >
                                View
                              </button>
                              <button
                                className=" rounded-sm px-4 py-2 text-left text-sm  text-gray-600 hover:bg-gray-100 hover:text-blue-700"
                                onClick={() => {
                                  // setEditFolderData(item);
                                  // setFolderNewName(
                                  //     item?.folder_display_name
                                  // );
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className=" rounded-sm  px-4 py-2 text-left text-sm !text-rose-600 hover:bg-gray-100 hover:!text-rose-800"
                                onClick={() => deleteUser(item.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="w-full border-separate border-b border-gray-200">
                  <td className=" w-full py-6 text-center " colSpan={5}>
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className=" my-3 ml-auto block w-fit">
          <PaginationComp
            totalPages={totalPages}
            currentPage={currentPage}
            goToNextPage={goToNextPage}
            goToPreviousPage={goToPreviousPage}
            goToPage={goToPage}
          />
        </div>
      </div>
    </>
  );
};

export default UserTable;
