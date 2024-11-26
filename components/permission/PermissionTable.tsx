//file : components/user-management/UserTable.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import morevert_hori from '@/public/assets/morevert_horizontal.svg';
import { Plus } from 'lucide-react';
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

let sampleData = [
  {
    name: 'User Management',
    assignedTo: ['Administrator'],
    createdDate: '05 May 2024, 9:23 pm'
  },
  {
    name: 'Content Management',
    assignedTo: ['Administrator', 'Developer', 'Analyst', 'Support', 'Trial'],
    createdDate: '22 Sep 2024, 6:05 pm'
  },
  {
    name: 'Financial Management',
    assignedTo: ['Administrator', 'Analyst'],
    createdDate: '24 Jun 2024, 10:30 am'
  },
  {
    name: 'Reporting',
    assignedTo: ['Administrator', 'Analyst'],
    createdDate: '15 Apr 2024, 11:30 am'
  },
  {
    name: 'Payroll',
    assignedTo: ['Administrator', 'Analyst'],
    createdDate: '10 Nov 2024, 11:30 am'
  },
  {
    name: 'Disputes Management',
    assignedTo: ['Administrator', 'Developer', 'Support'],
    createdDate: '05 May 2024, 2:40 pm'
  },
  {
    name: 'API Controls',
    assignedTo: ['Administrator', 'Developer'],
    createdDate: '24 Jun 2024, 5:20 pm'
  }
];

const colorCode: { [key: string]: string } = {
  Administrator: 'text-blue-700 bg-blue-100',
  Developer: 'text-rose-700 bg-rose-100',
  Analyst: 'text-green-700 bg-green-100',
  Support: 'text-purple-700 bg-purple-100',
  Trial: 'text-yellow-700 bg-yellow-100'
};

const PermissionTable = () => {
  const [permissionList, setPermissionList] = useState<any[]>(sampleData);

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
  } = usePagination(permissionList, itemsPerPage);

  return (
    <div className="mx-auto max-w-7xl">
      <div className=" flex flex-col gap-5">
        <div className=" flex flex-col gap-1 pl-1">
          <h3 className=" text-lg font-semibold">Permission List</h3>
          <div className=" text-gray-600">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="!text-xs !font-medium !text-gray-500">
                    Home
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className=" !text-xs !font-medium !text-gray-500">
                    Permission List
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
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
              <button className=" flex h-fit items-center gap-2 rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:opacity-90">
                <Plus size={20} />
                Add Permission
              </button>
            </div>
          </div>

          <div className=" mt-5 w-full overflow-x-auto">
            <table className=" w-full min-w-max">
              <thead>
                <tr className=" w-full border-separate border-b border-gray-200">
                  <th className="mr-auto min-w-max px-4 py-6 text-left text-xs text-gray-400">
                    NAME
                  </th>
                  <th className="min-w-max px-4 text-left text-xs text-gray-400">
                    ASSIGNED TO
                  </th>

                  <th className="mr-auto min-w-max px-4 text-left text-xs text-gray-400">
                    CREATED DATE
                  </th>
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
                      <td className="mr-auto min-w-max px-4 py-6 text-left text-sm text-gray-600">
                        <div
                          className="flex cursor-pointer items-center gap-2 hover:text-blue-700"
                          onClick={() => {}}
                        >
                          {item?.name}
                        </div>
                      </td>
                      <td className="w-fit min-w-max px-4 text-left text-sm text-gray-600">
                        {item?.assignedTo.map(
                          (assignedTo: string, index: number) => (
                            <span
                              key={index}
                              className={`mx-1 rounded-sm px-2 py-1 text-xs font-medium ${
                                colorCode[assignedTo as keyof typeof colorCode]
                              }`}
                            >
                              {assignedTo}
                            </span>
                          )
                        )}
                      </td>
                      <td className="mr-auto min-w-max px-4 text-left text-sm text-gray-600">
                        {item?.createdDate}
                      </td>
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
                                  onClick={() => {}}
                                >
                                  View
                                </button>
                                <button
                                  className=" rounded-sm px-4 py-2 text-left text-sm  text-gray-600 hover:bg-gray-100 hover:text-blue-700"
                                  onClick={() => {}}
                                >
                                  Edit
                                </button>
                                <button className=" rounded-sm  px-4 py-2 text-left text-sm !text-rose-600 hover:bg-gray-100 hover:!text-rose-800">
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
      </div>
    </div>
  );
};

export default PermissionTable;
