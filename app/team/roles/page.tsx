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
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// const roles = [
//   {
//     role: 'Administrator',
//     userCount: 5,
//     permissions: [
//       'All Admin Controls',
//       'View and Edit Financial Summaries',
//       'Enabled Bulk Reports',
//       'View and Edit Payouts',
//       'View and Edit Disputes'
//     ],
//     extraPermissions: 7
//   },
//   {
//     role: 'Developer',
//     userCount: 14,
//     permissions: [
//       'Some Admin Controls',
//       'View Financial Summaries only',
//       'View and Edit API Controls',
//       'View Payouts only',
//       'View and Edit Disputes'
//     ],
//     extraPermissions: 3
//   },
//   {
//     role: 'Analyst',
//     userCount: 4,
//     permissions: [
//       'No Admin Controls',
//       'View and Edit Financial Summaries',
//       'Enabled Bulk Reports',
//       'View Payouts only',
//       'View Disputes only'
//     ],
//     extraPermissions: 2
//   },
//   {
//     role: 'Support',
//     userCount: 23,
//     permissions: [],
//     extraPermissions: 0
//   },
//   {
//     role: 'Trial',
//     userCount: 546,
//     permissions: [],
//     extraPermissions: 0
//   },
//   {
//     role: 'Developer',
//     userCount: 14,
//     permissions: [
//       'Some Admin Controls',
//       'View Financial Summaries only',
//       'View and Edit API Controls',
//       'View Payouts only',
//       'View and Edit Disputes'
//     ],
//     extraPermissions: 3
//   }
// ];

const RolePage = () => {
  const { data: session, status, update } = useSession();

  const { fetchWithLoading } = useLoadingAPI();

  const pathname = usePathname();

  // const [businessRoles, setBusinessRoles] = useState([]);

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

  const [addRoleFormData, setAddRoleFormData] = useState({
    role_code: '',
    role_name: '',
    business_id: session?.user.business_info?.business_id
  });

  // const [formatedBusinessRoles, setFormatedBusinessRoles] = useState<
  //   FormatedBusinessRole[]
  // >([]);

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
        // setBusinessRoles(response?.models);
        console.log(response);
      } else {
        toast({
          title: 'Error',
          description: 'Error while fetching data',
          variant: 'destructive'
        });

        // setBusinessRoles([]);
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

  //   {
  //     "id": 159201,
  //     "creator_id": 0,
  //     "role_code": "HO_Traditional",
  //     "role_name": "HO_Traditional",
  //     "feature": "Inspiration",
  //     "permission": "View/Edit",
  //     "business_id": 33,
  //     "address": "",
  //     "file_size": ""
  // }

  // need to group by role_code and role_name and then map to the roles array

  // useEffect(() => {
  //   if (businessRolePermissions.length > 0) {
  //     //  want to group like this
  //     //  {
  //     //   role_code: 'HO_Traditional',
  //     //   role_name: 'HO_Traditional',
  //     //   items: [
  //     //     {
  //     //       ....all the items
  //     //     }
  //     //   ]

  //     //  }

  //     let grouped = businessRolePermissions?.reduce((r, a) => {
  //       r[a.role_code] = r[a?.role_code] || [];
  //       r[a.role_code].push(a);
  //       return r;
  //     }, Object.create(null));

  //     let formated = Object.keys(grouped).map((key) => {
  //       return {
  //         role_code: key,
  //         role_name: grouped[key][0].role_name,
  //         items: grouped[key]
  //       };
  //     });

  //     setFormatedBusinessRoles(formated);
  //     console.log(formated);
  //   }
  // }, [businessRolePermissions]);

  const [roleEditModal, setRoleEditModal] = useState(false);
  const [editUserData, setEditUserData] = useState<any>({});

  const AddNewRole = async () => {
    let formData = new FormData();

    let payload = {
      data: {
        type: 'business_Roles_Permissions',
        attributes: {
          ...addRoleFormData,
          feature_permissions: {
            Project: 'View',
            Reports: 'View',
            Finances: 'View',
            Insights: 'View',
            Invoices: 'View',
            Schedule: 'View',
            Documents: 'View',
            'Create Bid': 'View',
            'Bid Reports': 'View',
            Inspiration: 'View',
            'Manage Team': 'View',
            'Sales/Leads': 'View',
            'Change Orders': 'View',
            'Purchase Order': 'View',
            Specifications: 'View',
            'Business Finance': 'View',
            'Photos and Videos': 'View',
            'Progression Notes': 'View',
            'Budget and Forecast': 'View',
            'Business Hub (BH) Summary': 'View'
          }
        }
      }
    };

    try {
      let response = await fetchWithLoading(`/api/business_Roles_Permissions`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (response.status == 201) {
        toast({
          title: 'Success',
          description: 'Role added successfully'
        });

        setRoleEditModal(false);
        fetBusinessRolePermissions();
      } else {
        toast({
          title: 'Error',
          description: 'Error while adding Role',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Error while adding Role',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetBusinessUserRole();
    fetBusinessRolePermissions();
  }, []);

  return (
    <>
      <div className=" flex gap-3 px-3 py-1">
        <nav
          className="flex w-full space-x-4 rounded-t-lg bg-[hsl(var(--secondary))] p-2"
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
      </div>
      <div className="mx-auto w-full">
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {businessRolePermissions?.map((role, index) => (
            <RoleCard key={index} role={role} />
          ))}

          <Dialog
            open={roleEditModal}
            onOpenChange={(isOpen) => setRoleEditModal(isOpen)}
          >
            <DialogTrigger asChild>
              <div className="flex  cursor-pointer items-center justify-center gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
                <img src={RoleImage.src} alt="Add role" className="h-10 w-10" />
                <span className=" text-lg font-medium text-gray-500">
                  {' '}
                  Add new role
                </span>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add new role</DialogTitle>
                <DialogDescription>
                  <div className=" mt-5 flex flex-wrap gap-4">
                    <div className="flex w-full flex-col items-start gap-1.5">
                      <Label htmlFor="">Role Code</Label>
                      <Input
                        type="text"
                        value={addRoleFormData?.role_code}
                        onChange={(e) =>
                          setAddRoleFormData({
                            ...addRoleFormData,
                            role_code: e.target.value
                          })
                        }
                        placeholder="Role Code"
                        className=" text-[13px] font-normal text-gray-500"
                      />
                    </div>
                  </div>
                  <div className=" mt-5 flex flex-wrap gap-4">
                    <div className="flex w-full flex-col items-start gap-1.5">
                      <Label htmlFor="">Role Name</Label>
                      <Input
                        type="text"
                        value={addRoleFormData?.role_name}
                        onChange={(e) =>
                          setAddRoleFormData({
                            ...addRoleFormData,
                            role_name: e.target.value
                          })
                        }
                        placeholder="Role Name"
                        className=" text-[13px] font-normal text-gray-500"
                      />
                    </div>
                  </div>

                  {/* submit button */}

                  <div className=" mt-5 flex flex-wrap gap-4">
                    <div className="flex w-full justify-end gap-5">
                      <Button
                        onClick={() => {
                          setRoleEditModal(false);
                        }}
                        variant="outline"
                        className="!text-xs !font-medium !text-gray-500"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          AddNewRole();
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
      </div>
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
        {/* <p className="mt-6 text-sm font-medium text-gray-500">
        Total users with this role: {userCount}
      </p> */}

        {/* <ul className="mb-4 mt-7 space-y-4">
          {Object.keys(roleItem?.feature_permissions || {})
            .slice(0, 6)
            .map((item: any, index: number) => (
              <li
                key={index}
                className="flex items-center pl-2 text-[13px] text-gray-500"
              >
                <span className="mr-3">•</span>
                {item}
              </li>
            ))}
       
          {
            Object.keys(roleItem?.feature_permissions || {}).length > 6 && (
              <li className="text-sm text-gray-500">
                and{' '}
                {Object.keys(roleItem?.feature_permissions || {}).length -
                  6}{' '}
                more...
              </li>
            )
          }
        </ul> */}

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
