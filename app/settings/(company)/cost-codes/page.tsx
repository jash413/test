'use client';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import morevert_hori from '@/public/assets/morevert_horizontal.svg';

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

import usePagination from '@/hooks/usePagination';
import { Plus } from 'lucide-react';
import PaginationComp from '@/components/layout/pagination';

const RolePage = () => {
  const { data: session, status, update } = useSession();

  const { fetchWithLoading } = useLoadingAPI();

  const pathname = usePathname();

  const [costCodes, setCostCodes] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpen2, setDialogOpen2] = useState(false);

  const [filterText, setFilterText] = useState<string>('');

  const [costCodeFormData, setCostCodeFormData] = useState({
    cost_code: '',
    task_code: '',
    description: '',
    unit: '',
    unit_cost: 0,
    cost_type: '',
    builder_cost: 0,
    markup: 0,
    owner_price: 0,
    margin_percent: 0
  });

  const fetchCostCodes = async () => {
    try {
      let response = await fetchWithLoading(
        `/api/cost_Codes`
        // `/api/cost_Codes?filter[business_id]=${session?.user.business_info?.business_id}`
      );

      if (response.status === 200) {
        setCostCodes(response?.body?.data);
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

  const handleSubmitDefaultCostCode = async () => {
    if (!session?.user.apiUserToken) {
      return;
    }

    try {
      let response = await fetchWithLoading(`/api/default_Cost_Codes/`, {
        method: 'POST',
        body: JSON.stringify({
          data: {
            type: 'default_Cost_Codes',
            attributes: {
              ...costCodeFormData
            }
          }
        })
      });

      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'Cost code added successfully'
        });
        setDialogOpen(false);
      } else {
        toast({
          title: 'Error',
          description: 'Error while adding cost code',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error while adding cost code',
        variant: 'destructive'
      });
      console.log(error);
    }
  };

  const [costCodeItem, setCostCodeItem] = useState<any>();

  const handleEditDefaultCostCode = async () => {
    if (!session?.user.apiUserToken) {
      return;
    }

    if (!costCodeItem?.id) {
      toast({
        title: 'Error',
        description: 'Cost code id not found',
        variant: 'destructive'
      });
      return;
    }

    try {
      let response = await fetchWithLoading(
        `/api/default_Cost_Codes/${costCodeItem?.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            data: {
              type: costCodeItem?.type,
              attributes: {
                ...costCodeItem?.attributes
              }
            }
          })
        }
      );

      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'Cost code updated successfully'
        });
        setDialogOpen(false);
      } else {
        toast({
          title: 'Error',
          description: 'Error while updating cost code',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error while updating cost code',
        variant: 'destructive'
      });
      console.log(error);
    }
  };

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
  } = usePagination(costCodes, itemsPerPage);

  useEffect(() => {
    fetchCostCodes();
  }, []);

  return (
    <>
      <div className=" w-full rounded-md border border-gray-100 bg-white px-7 py-5 shadow-sm">
        <div className=" flex items-center justify-between">
          <div className=" relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                handleSearch(e.target.value, 'attributes.cost_code')
              }
              placeholder="Search by cost code"
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
              open={dialogOpen}
              onOpenChange={(isOpen) => {
                setDialogOpen(isOpen);
              }}
            >
              <DialogTrigger asChild>
                <button className="flex h-fit items-center gap-2 rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:opacity-90">
                  <Plus size={20} />
                  View / Edit Cost Code
                </button>
              </DialogTrigger>
              <DialogContent className=" max-h-[90vh] overflow-y-auto scrollbar-none">
                <DialogHeader>
                  <DialogTitle>Add new cost code</DialogTitle>
                  <DialogDescription>
                    <div className=" mt-5 flex flex-wrap gap-4">
                      <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                        <Label htmlFor="email">Cost code</Label>
                        <Input
                          type="text"
                          value={costCodeFormData?.cost_code}
                          onChange={(e) =>
                            setCostCodeFormData({
                              ...costCodeFormData,
                              cost_code: e.target.value
                            })
                          }
                          placeholder="Cost Code"
                          className=" text-[13px] font-normal text-gray-500"
                        />
                      </div>
                      <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                        <Label htmlFor="email">Task code</Label>
                        <Input
                          type="text"
                          value={costCodeFormData?.task_code}
                          onChange={(e) => {
                            setCostCodeFormData({
                              ...costCodeFormData,
                              task_code: e.target.value
                            });
                          }}
                          placeholder="Task Code"
                          className=" text-[13px] font-normal text-gray-500"
                        />
                      </div>
                      <div className="flex w-full flex-col items-start gap-1.5">
                        <Label htmlFor="email">Description</Label>
                        <Input
                          type="text"
                          value={costCodeFormData?.description}
                          onChange={(e) =>
                            setCostCodeFormData({
                              ...costCodeFormData,
                              description: e.target.value
                            })
                          }
                          placeholder="Description"
                          className=" text-[13px] font-normal text-gray-500"
                        />
                      </div>

                      <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                        <Label htmlFor="unit">Unit</Label>
                        <Input
                          type="text"
                          value={costCodeFormData?.unit}
                          onChange={(e) =>
                            setCostCodeFormData({
                              ...costCodeFormData,
                              unit: e.target.value
                            })
                          }
                          placeholder="Unit"
                          name="unit"
                          className=" text-[13px] font-normal text-gray-500"
                        />
                      </div>

                      <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                        <Label htmlFor="cost_cost">Unit Cost</Label>
                        <Input
                          type="number"
                          value={costCodeFormData?.unit_cost}
                          onChange={(e) =>
                            setCostCodeFormData({
                              ...costCodeFormData,
                              unit_cost: parseFloat(e.target.value)
                            })
                          }
                          name="unit_cost"
                          placeholder="Unit Cost"
                          className=" text-[13px] font-normal text-gray-500"
                        />
                      </div>

                      <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                        <Label htmlFor="cost_type">Cost Type</Label>
                        <Input
                          type="text"
                          value={costCodeFormData?.cost_type}
                          onChange={(e) =>
                            setCostCodeFormData({
                              ...costCodeFormData,
                              cost_type: e.target.value
                            })
                          }
                          name="cost_type"
                          placeholder="Cost Type"
                          className=" text-[13px] font-normal text-gray-500"
                        />
                      </div>

                      <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                        <Label htmlFor="builder_cost">Builder Cost</Label>
                        <Input
                          type="number"
                          value={costCodeFormData?.builder_cost}
                          onChange={(e) =>
                            setCostCodeFormData({
                              ...costCodeFormData,
                              builder_cost: parseFloat(e.target.value)
                            })
                          }
                          placeholder="Builder Cost"
                          className=" text-[13px] font-normal text-gray-500"
                          name="builder_cost"
                        />
                      </div>

                      <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                        <Label htmlFor="markup">Markup</Label>
                        <Input
                          type="number"
                          value={costCodeFormData?.markup}
                          onChange={(e) =>
                            setCostCodeFormData({
                              ...costCodeFormData,
                              markup: parseFloat(e.target.value)
                            })
                          }
                          placeholder="Markup"
                          name="markup"
                          className=" text-[13px] font-normal text-gray-500"
                        />
                      </div>

                      <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                        <Label htmlFor="owner_price">Owner Price</Label>
                        <Input
                          type="number"
                          name="owner_price"
                          value={costCodeFormData?.owner_price}
                          onChange={(e) =>
                            setCostCodeFormData({
                              ...costCodeFormData,
                              owner_price: parseFloat(e.target.value)
                            })
                          }
                          placeholder="Owner Price"
                          className=" text-[13px] font-normal text-gray-500"
                        />
                      </div>

                      <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                        <Label htmlFor="margin">Margin Percent</Label>
                        <Input
                          type="number"
                          name="margin"
                          value={costCodeFormData?.margin_percent}
                          onChange={(e) =>
                            setCostCodeFormData({
                              ...costCodeFormData,
                              margin_percent: parseFloat(e.target.value)
                            })
                          }
                          placeholder="Margin Percent"
                          className=" text-[13px] font-normal text-gray-500"
                        />
                      </div>

                      <div className="flex w-full justify-end gap-5">
                        <Button
                          onClick={() => {
                            setDialogOpen(false);
                          }}
                          variant="outline"
                          className="!text-xs !font-medium !text-gray-500"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            handleSubmitDefaultCostCode();
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
                <th className="mr-auto min-w-max px-4 text-left text-xs text-gray-700">
                  COST CODE
                </th>
                <th className="min-w-max px-4 text-left text-xs text-gray-700">
                  TASK CODE
                </th>
                <th className="min-w-max px-4 text-left text-xs text-gray-700">
                  COST TYPE
                </th>
                <th className="mr-auto min-w-max px-4 text-left text-xs text-gray-700">
                  UNIT
                </th>
                <th className="min-w-max px-4 text-left text-xs text-gray-700">
                  UNIT COST
                </th>
                <th className="min-w-max px-4 text-left text-xs text-gray-800">
                  BUILDER COST
                </th>
                <th className="mr-auto min-w-max px-4 text-left text-xs text-gray-700">
                  MARKUP
                </th>
                <th className="min-w-max px-4 text-left text-xs text-gray-700">
                  OWNER PRICE
                </th>
                <th className="min-w-max px-4 text-left text-xs text-gray-700">
                  MARGIN PERCENT
                </th>
                <th className="min-w-max px-4 text-left text-xs text-gray-700">
                  DESCRIPTION
                </th>
                <th></th>
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
                      {item?.attributes?.cost_code}
                    </td>
                    <td className="min-w-max px-4 text-left text-sm text-gray-600">
                      {item?.attributes?.task_code}
                    </td>
                    <td className="w-fit min-w-max px-4 text-left text-sm text-gray-600">
                      {item?.attributes?.cost_type}
                    </td>
                    <td className="mr-auto min-w-max px-4 text-left text-sm text-gray-600">
                      {item?.attributes?.unit}
                    </td>
                    <td className="min-w-max px-4 text-left text-sm text-gray-600">
                      {item?.attributes?.unit_cost}
                    </td>
                    <td className="min-w-max px-4 text-left text-sm text-gray-600">
                      {item?.attributes?.builder_cost}
                    </td>
                    <td className="mr-auto min-w-max px-4 text-left text-sm text-gray-600">
                      {item?.attributes?.markup}
                    </td>
                    <td className="min-w-max px-4 text-left text-sm text-gray-600">
                      {item?.attributes?.owner_price}
                    </td>
                    <td className="min-w-max px-4 text-left text-sm text-gray-600">
                      {item?.attributes?.margin_percent}
                    </td>
                    <td className="line-clamp-1 w-[200px] items-center px-4 text-left text-sm text-gray-600">
                      {item?.attributes?.description}
                    </td>
                    <td className=" w-[100px] items-center px-4">
                      <div className=" flex w-fit gap-2">
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
                            <button
                              className=" min-w-24 rounded-sm px-4 py-2 text-left  text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-700"
                              onClick={() => {
                                setCostCodeItem(item);
                                setDialogOpen2(true);
                              }}
                            >
                              edit
                            </button>
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
        <Dialog
          open={dialogOpen2}
          onOpenChange={(isOpen) => {
            setDialogOpen2(isOpen);
            if (!isOpen) {
              setCostCodeItem(null);
            }
          }}
        >
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent className=" max-h-[90vh] overflow-y-auto scrollbar-none">
            <DialogHeader>
              <DialogTitle>{costCodeItem?.attributes?.cost_code}</DialogTitle>
              <DialogDescription>
                <div className=" mt-5 flex flex-wrap gap-4">
                  <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                    <Label htmlFor="email">Cost code</Label>
                    <Input
                      value={costCodeItem?.attributes?.cost_code}
                      onChange={(e) =>
                        setCostCodeItem({
                          ...costCodeItem,
                          attributes: {
                            ...costCodeItem.attributes,
                            cost_code: e.target.value
                          }
                        })
                      }
                      placeholder="Cost Code"
                      className=" text-[13px] font-normal text-gray-500"
                    />
                  </div>
                  <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                    <Label htmlFor="email">Task code</Label>
                    <Input
                      value={costCodeItem?.attributes?.task_code}
                      onChange={(e) =>
                        setCostCodeItem({
                          ...costCodeItem,
                          attributes: {
                            ...costCodeItem.attributes,
                            task_code: e.target.value
                          }
                        })
                      }
                      placeholder="Task Code"
                      className=" text-[13px] font-normal text-gray-500"
                    />
                  </div>
                  <div className="flex w-full flex-col items-start gap-1.5">
                    <Label htmlFor="email">Description</Label>
                    <Input
                      value={costCodeItem?.attributes?.description}
                      onChange={(e) =>
                        setCostCodeItem({
                          ...costCodeItem,
                          attributes: {
                            ...costCodeItem.attributes,
                            description: e.target.value
                          }
                        })
                      }
                      placeholder="Description"
                      className=" text-[13px] font-normal text-gray-500"
                    />
                  </div>

                  <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                    <Label htmlFor="email">Unit</Label>
                    <Input
                      value={costCodeItem?.attributes?.unit}
                      onChange={(e) =>
                        setCostCodeItem({
                          ...costCodeItem,
                          attributes: {
                            ...costCodeItem.attributes,
                            unit: e.target.value
                          }
                        })
                      }
                      placeholder="Unit"
                      className=" text-[13px] font-normal text-gray-500"
                    />
                  </div>

                  <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                    <Label htmlFor="email">Unit Cost</Label>
                    <Input
                      value={costCodeItem?.attributes?.unit_cost}
                      onChange={(e) =>
                        setCostCodeItem({
                          ...costCodeItem,
                          attributes: {
                            ...costCodeItem.attributes,
                            unit_cost: parseFloat(e.target.value)
                          }
                        })
                      }
                      placeholder="Unit Cost"
                      className=" text-[13px] font-normal text-gray-500"
                    />
                  </div>

                  <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                    <Label htmlFor="email">Cost Type</Label>
                    <Input
                      value={costCodeItem?.attributes?.cost_type}
                      onChange={(e) =>
                        setCostCodeItem({
                          ...costCodeItem,
                          attributes: {
                            ...costCodeItem.attributes,
                            cost_type: e.target.value
                          }
                        })
                      }
                      placeholder="Cost Type"
                      className=" text-[13px] font-normal text-gray-500"
                    />
                  </div>

                  <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                    <Label htmlFor="email">Builder Cost</Label>
                    <Input
                      value={costCodeItem?.attributes?.builder_cost}
                      onChange={(e) =>
                        setCostCodeItem({
                          ...costCodeItem,
                          attributes: {
                            ...costCodeItem.attributes,
                            builder_cost: parseFloat(e.target.value)
                          }
                        })
                      }
                      placeholder="Builder Cost"
                      className=" text-[13px] font-normal text-gray-500"
                    />
                  </div>

                  <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                    <Label htmlFor="email">Markup</Label>
                    <Input
                      value={costCodeItem?.attributes?.markup}
                      onChange={(e) =>
                        setCostCodeItem({
                          ...costCodeItem,
                          attributes: {
                            ...costCodeItem.attributes,
                            markup: parseFloat(e.target.value)
                          }
                        })
                      }
                      placeholder="Markup"
                      className=" text-[13px] font-normal text-gray-500"
                    />
                  </div>

                  <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                    <Label htmlFor="email">Owner Price</Label>
                    <Input
                      value={costCodeItem?.attributes?.owner_price}
                      onChange={(e) =>
                        setCostCodeItem({
                          ...costCodeItem,
                          attributes: {
                            ...costCodeItem.attributes,
                            owner_price: parseFloat(e.target.value)
                          }
                        })
                      }
                      placeholder="Owner Price"
                      className=" text-[13px] font-normal text-gray-500"
                    />
                  </div>

                  <div className="flex w-[calc(50%-10px)] flex-col items-start gap-1.5">
                    <Label htmlFor="email">Margin Percent</Label>
                    <Input
                      value={costCodeItem?.attributes?.margin_percent}
                      onChange={(e) =>
                        setCostCodeItem({
                          ...costCodeItem,
                          attributes: {
                            ...costCodeItem.attributes,
                            margin_percent: parseFloat(e.target.value)
                          }
                        })
                      }
                      placeholder="Margin Percent"
                      className=" text-[13px] font-normal text-gray-500"
                    />
                  </div>

                  <div className="flex w-full justify-end gap-5">
                    <Button
                      onClick={() => {
                        setDialogOpen(false);
                        setCostCodeItem(null);
                      }}
                      variant="outline"
                      className="!text-xs !font-medium !text-gray-500"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        handleEditDefaultCostCode();
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
    </>
  );
};

export default RolePage;
