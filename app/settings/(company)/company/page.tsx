'use client';

import React from 'react';
import { use, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import morevert_hori from '@/public/assets/morevert_horizontal.svg';
import { Eye, EyeIcon, PenIcon, Plus, Trash2 } from 'lucide-react';
import { User } from 'lucide-react';
import usePagination from '@/hooks/usePagination';

import PaginationComp from '@/components/layout/pagination';

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
import { Label } from '@/components/ui/label';

const Page = () => {
  const { data: session, status, update } = useSession();

  const { toast } = useToast();

  const { fetchWithLoading } = useLoadingAPI();

  const [businessOnboardData, setBusinessOnboardData] = useState<any>(null);

  const [businessEditModalOpen, setBusinessEditModalOpen] = useState(false);

  const [businessEditData, setBusinessEditData] = useState<any>(null);

  const getUserOnboarding = async () => {
    if (!session?.user.apiUserToken) {
      return;
    }

    try {
      let response = await fetchWithLoading(
        `/api/generic-model/business/${session?.user?.business_info?.business_id}`
      );

      if (response.ok) {
        setBusinessOnboardData(response?.model);
      } else {
        toast({
          title: 'Error',
          description: 'Error while fetching data',
          variant: 'destructive'
        });
        setBusinessOnboardData(null);
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

  const onFileChange = async (e: any, keyName: any) => {
    const files = e.target.files;

    const uploadPromises = files.map((file: any) => {
      const formData = new FormData();
      formData.append('files', file.file);
      return fetch(`https://backend-api-topaz.vercel.app/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.user.apiUserToken}`
        },
        body: formData
      });
    });

    const uploadResponses = await Promise.all(uploadPromises);

    console.log('uploadResponses', uploadResponses);

    const uploadResponsesJson = await Promise.all(
      uploadResponses.map((response) => response.json())
    );

    console.log('uploadResponsesJson', uploadResponsesJson);

    setBusinessEditData({
      ...businessEditData,
      [keyName]: uploadResponsesJson
    });
  };

  const handleEditBusiness = async () => {
    let formData = new FormData();

    let payload = {
      ...businessEditData
    };

    if (!payload.id) {
      toast({
        title: 'Error',
        description: 'Error while updating Business',
        variant: 'destructive'
      });
      return;
    }

    let objId = payload.id;

    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value) || typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    formData.append('file_change_scenario', '4_no_changes_to_files');

    // remove the id from the payload
    formData.delete('id');

    try {
      let response = await fetchWithLoading(
        `/api/generic-model/business/${payload.id}`,
        {
          method: 'PUT',
          body: formData
        }
      );

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Business updated successfully'
        });

        getUserOnboarding();
        setBusinessEditModalOpen(false);
      } else {
        toast({
          title: 'Error',
          description: 'Error while updating Business',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Error while updating Business',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    if (session?.user?.apiUserToken) {
      getUserOnboarding();
      console.log('session?.user?.apiUserToken', session?.user?.apiUserToken);
    }
  }, [session?.user?.apiUserToken]);

  return (
    // <div className=" flex flex-col gap-5">
    //   <div className=" flex flex-col gap-1 pl-1">
    //     <h3 className=" text-lg font-semibold">Business onboarding</h3>
    //     <div className=" text-gray-600">
    //       <Breadcrumb>
    //         <BreadcrumbList>
    //           <BreadcrumbItem>
    //             <BreadcrumbPage className="!text-xs !font-medium !text-gray-500">
    //               settings
    //             </BreadcrumbPage>
    //           </BreadcrumbItem>
    //           <BreadcrumbSeparator />
    //           <BreadcrumbItem>
    //             <BreadcrumbPage className=" !text-xs !font-medium !text-gray-500">
    //               Business onboarding
    //             </BreadcrumbPage>
    //           </BreadcrumbItem>
    //         </BreadcrumbList>
    //       </Breadcrumb>
    //     </div>
    //   </div>
    // </div>
    <div className="w-full rounded-md border border-gray-100 bg-white px-7 py-5 shadow-sm">
      <div className=" ml-auto flex w-fit gap-2">
        {/* button */}
        <Dialog
          open={businessEditModalOpen}
          onOpenChange={(isOpen) => setBusinessEditModalOpen(isOpen)}
        >
          <DialogTrigger asChild>
            <button
              className=" flex h-fit  items-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              onClick={() => {
                setBusinessEditData(businessOnboardData);
                setBusinessEditModalOpen(true);
              }}
            >
              <PenIcon size={16} />
              Edit Business
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Business</DialogTitle>
              <DialogDescription>
                <div className=" max-h-[80vh] overflow-auto scrollbar-thin">
                  <div className=" mt-5 flex flex-wrap gap-4">
                    <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                      <Label htmlFor="btype">Business type</Label>
                      <select
                        name="btype"
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
                      <Label htmlFor="">Business structure</Label>
                      <select
                        value={businessEditData?.structure}
                        onChange={(e) =>
                          setBusinessEditData({
                            ...businessEditData,
                            structure: e.target.value
                          })
                        }
                        className="w-full grow rounded border bg-transparent p-2 text-sm focus:border focus:outline-primary active:border active:outline-primary "
                      >
                        <option value="Sole Proprietorship">
                          Sole Proprietorship
                        </option>
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
                      <Label htmlFor="">Legal Name</Label>
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
                      <Label htmlFor="">Years in business</Label>
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
                      <Label htmlFor="">Website</Label>
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
                      <Label htmlFor="">Address</Label>
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
                      <Label htmlFor="">Email</Label>
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
                      <Label htmlFor="">Phone</Label>
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
                      <Label htmlFor="">Specializations</Label>
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
                      <Label htmlFor="">License number</Label>
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
                      <Label htmlFor="">Insurance number</Label>
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
                      <Label htmlFor="">Workers comp info</Label>
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
                      <Label htmlFor="">Tax ID</Label>
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
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className=" columns-1 gap-2 space-y-2 md:columns-2 ">
        <div className="  p-2">
          <div className="">
            <span className=" font-semibold text-gray-700">Legal Name : </span>
            <span className=" font-normal text-gray-500">
              {businessOnboardData?.name || 'N/A'}
            </span>
          </div>
        </div>

        <div className="  p-2">
          <div className="">
            <span className=" font-semibold text-gray-700">
              Business type :{' '}
            </span>
            <span className=" font-normal text-gray-500">
              {businessOnboardData?.type || 'N/A'}
            </span>
          </div>
        </div>
        <div className="  p-2">
          <div className="">
            <span className=" font-semibold text-gray-700">
              Business structure :{' '}
            </span>
            <span className=" font-normal text-gray-500">
              {businessOnboardData?.structure || 'N/A'}
            </span>
          </div>
        </div>
        <div className="  p-2">
          <div className="">
            <span className=" font-semibold text-gray-700">
              Year in business :{' '}
            </span>
            <span className=" font-normal text-gray-500">
              {businessOnboardData?.years_in_business || 'N/A'}
            </span>
          </div>
        </div>
        <div className="  p-2">
          <div className="">
            <span className=" font-semibold text-gray-700">
              Year in business :{' '}
            </span>
            <span className=" font-normal text-gray-500">
              {businessOnboardData?.years_in_business || 'N/A'}
            </span>
          </div>
        </div>

        <div className="  p-2">
          <div className="">
            <span className=" font-semibold text-gray-700">Website : </span>
            <span className=" font-normal text-gray-500">
              {businessOnboardData?.website || 'N/A'}
            </span>
          </div>
        </div>

        <div className="  p-2">
          <div className="">
            <span className=" font-semibold text-gray-700">Address : </span>
            <span className=" font-normal text-gray-500">
              {businessOnboardData?.address || 'N/A'}
            </span>
          </div>
        </div>

        <div className="  p-2">
          <div className="">
            <span className=" font-semibold text-gray-700">Email : </span>
            <span className=" font-normal text-gray-500">
              {businessOnboardData?.email || 'N/A'}
            </span>
          </div>
        </div>

        <div className="  p-2">
          <div className="">
            <span className=" font-semibold text-gray-700">Phone : </span>
            <span className=" font-normal text-gray-500">
              {businessOnboardData?.phone || 'N/A'}
            </span>
          </div>
        </div>

        <div className="  p-2">
          <div className="">
            <span className=" font-semibold text-gray-700">
              Specializations :{' '}
            </span>
            <span className=" font-normal text-gray-500">
              {businessOnboardData?.specializations?.join(', ') || 'N/A'}
            </span>
          </div>
        </div>

        <div className="  p-2">
          <div className="">
            <span className=" font-semibold text-gray-700">
              Specializations :{' '}
            </span>
            <span className=" font-normal text-gray-500">
              {businessOnboardData?.specializations?.join(', ') || 'N/A'}
            </span>
          </div>
        </div>

        <div className="  p-2">
          <div className="">
            <span className=" font-semibold text-gray-700">
              License number :{' '}
            </span>
            <span className=" font-normal text-gray-500">
              {businessOnboardData?.license_info || 'N/A'}
            </span>
          </div>
        </div>

        <div className="  p-2">
          <div className="">
            <span className=" font-semibold text-gray-700">
              Insurance number :{' '}
            </span>
            <span className=" font-normal text-gray-500">
              {businessOnboardData?.insurance_info || 'N/A'}
            </span>
          </div>
        </div>

        <div className="  p-2">
          <div className="">
            <span className=" font-semibold text-gray-700">
              Workers comp info :{' '}
            </span>
            <span className=" font-normal text-gray-500">
              {businessOnboardData?.workers_comp_info || 'N/A'}
            </span>
          </div>
        </div>

        <div className="  p-2">
          <div className="">
            <span className=" font-semibold text-gray-700">Tax ID : </span>
            <span className=" font-normal text-gray-500">
              {businessOnboardData?.tax_id || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
