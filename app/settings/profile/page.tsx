import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import UserDatails from '@/components/user-management/UserDetails';

const page = () => {
  return (
    // <div className=" flex flex-col gap-5">
    //   <div className=" flex flex-col gap-1 pl-1">
    //     <h3 className=" text-lg font-semibold">User Profile</h3>
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
    //               User Profile
    //             </BreadcrumbPage>
    //           </BreadcrumbItem>
    //         </BreadcrumbList>
    //       </Breadcrumb>
    //     </div>
    //   </div>
    <UserDatails owner={true} />
    // </div>
  );
};

export default page;
