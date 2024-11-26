'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import RoleImage from '@/public/add_role.png';
import { useSession } from 'next-auth/react';

import { useLoadingAPI } from '@/app/hooks/useLoadingAPI';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const RolePage = () => {
  const { data: session, status, update } = useSession();

  const { fetchWithLoading } = useLoadingAPI();

  const pathname = usePathname();

  interface BusinessRolePermission {
    role_code: string;
    role_name: string;
    [key: string]: any;
  }

  const [businessRolePermissions, setBusinessRolePermissions] = useState<
    BusinessRolePermission[]
  >([]);
  interface FormatedBusinessRole {
    role_code: string;
    role_name: string;
    items: BusinessRolePermission[];
  }

  const fetBusinessUserRole = async () => {
    if (!session?.user.apiUserToken) {
      return;
    }

    try {
      let response = await fetchWithLoading(
        // `/api/business_User_Roles`
        `/api/generic-model/business_User_Roles?filter[business_id]=${session?.user.business_info?.business_id}`
      );

      if (response) {
        console.log(response);
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

  const fetBusinessRolePermissions = async () => {
    if (!session?.user.apiUserToken) {
      return;
    }

    try {
      let response = await fetchWithLoading(
        // `/api/generic-model/business_Roles_Permissions`
        `/api/generic-model/business_Roles_Permissions?filter[business_id]=${session?.user.business_info?.business_id}`
      );

      if (response) {
        setBusinessRolePermissions(response?.models);
      } else {
        toast({
          title: 'Error',
          description: 'Error while fetching data',
          variant: 'destructive'
        });

        setBusinessRolePermissions([]);
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
    fetBusinessUserRole();
    fetBusinessRolePermissions();
  }, []);

  return (
    <>
      {/* <div className=" flex flex-col gap-5">
        <div className=" flex flex-col gap-1 pl-1">
          <h3 className=" text-lg font-semibold">Views</h3>
          <div className=" text-gray-600">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="!text-xs !font-medium !text-gray-500">
                    settings
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className=" !text-xs !font-medium !text-gray-500">
                    Views
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div> */}
      <div className="mx-auto w-full">
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {businessRolePermissions?.map((role, index) => (
            <RoleCard key={index} role={role} />
          ))}
          <div className="flex  cursor-pointer items-center justify-center gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <img src={RoleImage.src} alt="Add role" className="h-10 w-10" />
            <span className=" text-lg font-medium text-gray-500">
              {' '}
              Add new role
            </span>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default RolePage;

const RoleCard = ({ role }: { role: any }) => {
  const { data: session, status, update } = useSession();

  const { fetchWithLoading } = useLoadingAPI();

  const [roleItem, setRoleItem] = useState<any>(role);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePermissionChange = async (
    item: any,
    type: string,
    flag: boolean
  ) => {
    console.log(roleItem, item, type, flag);

    let initialPermission =
      roleItem?.feature_permissions[item].split('/') || [];

    if (type === 'View') {
      if (flag) {
        if (!initialPermission.includes('View')) {
          initialPermission.push('View');
        } else {
          toast({
            title: 'Error',
            description: 'Permission already exists',
            variant: 'destructive'
          });
          return;
        }
      } else {
        if (initialPermission.includes('View')) {
          initialPermission = initialPermission.filter(
            (permission: string) => permission !== 'View'
          );
        } else {
          toast({
            title: 'Error',
            description: 'Permission does not exists',
            variant: 'destructive'
          });
          return;
        }
      }
    } else if (type === 'Edit') {
      if (flag) {
        if (!initialPermission.includes('Edit')) {
          initialPermission.push('Edit');
        } else {
          toast({
            title: 'Error',
            description: 'Permission already exists',
            variant: 'destructive'
          });
          return;
        }
      } else {
        if (initialPermission.includes('Edit')) {
          initialPermission = initialPermission.filter(
            (permission: string) => permission !== 'Edit'
          );
        } else {
          toast({
            title: 'Error',
            description: 'Permission does not exists',
            variant: 'destructive'
          });
          return;
        }
      }
    } else if (type === 'Hidden') {
      if (flag) {
        if (!initialPermission.includes('Hidden')) {
          initialPermission.push('Hidden');
        } else {
          toast({
            title: 'Error',
            description: 'Permission already exists',
            variant: 'destructive'
          });
          return;
        }
      } else {
        if (initialPermission.includes('Hidden')) {
          initialPermission = initialPermission.filter(
            (permission: string) => permission !== 'Hidden'
          );
        } else {
          toast({
            title: 'Error',
            description: 'Permission does not exists',
            variant: 'destructive'
          });
          return;
        }
      }
    } else {
      toast({
        title: 'Error',
        description: 'Invalid permission type',
        variant: 'destructive'
      });
      return;
    }

    let newPermission = initialPermission.join('/');

    console.log(newPermission);

    if (!session?.user.apiUserToken) {
      return;
    }

    let formData = new FormData();

    let payload = {
      ...roleItem,
      feature_permissions: {
        ...roleItem.feature_permissions,
        [item]: newPermission
      }
    };

    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value) || typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    formData.append('file_change_scenario', '4_no_changes_to_files');

    try {
      let response = await fetchWithLoading(
        `/api/generic-model/business_Roles_Permissions/${roleItem.id}`,
        {
          method: 'PUT',
          body: formData
        }
      );

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Permission updated successfully'
        });

        // update the roleItem
        let updatedRoleItem = roleItem;

        updatedRoleItem.feature_permissions[item] = newPermission;

        setRoleItem(updatedRoleItem);
      } else {
        console.log('error');
        toast({
          title: 'Error',
          description: 'Error while updating Permission',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Error while updating Permission',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">{roleItem?.role_name}</h3>

        <div className="mt-8 flex space-x-4">
          <Dialog
            open={dialogOpen}
            onOpenChange={(isOpen) => setDialogOpen(isOpen)}
          >
            <DialogTrigger asChild>
              <button className="rounded-md bg-gray-100 px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-200">
                View / Edit Role
              </button>
            </DialogTrigger>
            <DialogContent className=" max-h-[90vh] overflow-y-auto scrollbar-none">
              <DialogHeader>
                <DialogTitle>{roleItem?.role_name}</DialogTitle>
                <DialogDescription>
                  <div className=" mt-5 w-full overflow-x-auto">
                    <table className=" w-full min-w-max">
                      <thead>
                        <tr className=" w-full border-separate border-b border-gray-200">
                          <th className=" min-w-60 p-2 px-4 text-left  text-xs text-gray-400">
                            FEATURE
                          </th>
                          <th className="min-w-max p-2 px-4 text-left text-xs  text-gray-400">
                            VIEW
                          </th>
                          <th className="min-w-max p-2 px-4 text-left text-xs  text-gray-400">
                            EDIT
                          </th>
                          <th className="mr-auto min-w-max p-2 px-4 text-left text-xs  text-gray-400">
                            HIDDEN
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {roleItem?.items?.map((item: any, index: number) => ( */}
                        {Object.keys(roleItem?.feature_permissions || {}).map(
                          (item: any, index: number) => (
                            <tr
                              className="w-full border-separate border-b border-gray-200"
                              key={index}
                            >
                              <td className="min-w-max p-2 px-4 text-left text-sm text-gray-600">
                                {item}
                              </td>
                              <td className="min-w-max p-2 px-4 text-left text-sm text-gray-600">
                                {/* {item?.permission?.split('/').includes('View') ? ( */}
                                {roleItem?.feature_permissions[item]
                                  ?.split('/')
                                  .includes('View') ? (
                                  <div>
                                    <Switch
                                      checked={true}
                                      onCheckedChange={() => {
                                        handlePermissionChange(
                                          item,
                                          'View',
                                          false
                                        );
                                      }}
                                      className=" "
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <Switch
                                      checked={false}
                                      onCheckedChange={() => {
                                        handlePermissionChange(
                                          item,
                                          'View',
                                          true
                                        );
                                      }}
                                      className=" "
                                    />
                                  </div>
                                )}
                              </td>
                              <td className="min-w-max p-2 px-4 text-left text-sm  text-gray-600">
                                {/* {item?.permission?.split('/').includes('Edit') ? ( */}
                                {roleItem?.feature_permissions[item]
                                  ?.split('/')
                                  .includes('Edit') ? (
                                  <div>
                                    <Switch
                                      checked={true}
                                      onCheckedChange={() => {
                                        handlePermissionChange(
                                          item,
                                          'Edit',
                                          false
                                        );
                                      }}
                                      className=" "
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <Switch
                                      checked={false}
                                      onCheckedChange={() => {
                                        handlePermissionChange(
                                          item,
                                          'Edit',
                                          true
                                        );
                                      }}
                                      className=" "
                                    />
                                  </div>
                                )}
                              </td>
                              <td className="min-w-max p-2 px-4 text-left text-sm  text-gray-600">
                                {/* {item?.permission
                                ?.split('/')
                                .includes('Hidden') ? ( */}
                                {roleItem?.feature_permissions[item]
                                  ?.split('/')
                                  .includes('Hidden') ? (
                                  <div>
                                    <Switch
                                      checked={true}
                                      onCheckedChange={() => {
                                        handlePermissionChange(
                                          item,
                                          'Hidden',
                                          false
                                        );
                                      }}
                                      className=" "
                                    />
                                  </div>
                                ) : (
                                  <div>
                                    <Switch
                                      checked={false}
                                      onCheckedChange={() => {
                                        handlePermissionChange(
                                          item,
                                          'Hidden',
                                          true
                                        );
                                      }}
                                      className=" "
                                    />
                                  </div>
                                )}
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
          {/* <button className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200">
          Edit Role
        </button> */}
        </div>
      </div>
    </>
  );
};
