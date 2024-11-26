// file: app/(dashboard)/dashboard/project_details/ProjectForm.tsx

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  MultiStepForm,
  Step
} from '@/components/forms/MultiStep/MultiStepForm';
import {
  TooltipProvider,
  TooltipContent
} from '@/components/forms/TooltipContext';
import { Tooltip } from '@/components/forms/ToolTip';
import { useSession } from 'next-auth/react';
import * as z from 'zod';
import GenericFormSubmitHandler from '@/components/forms/MultiStep/FormSubmitHandler';
import { ProcessedFileInfo } from '@/server/utils/filehandler';
import {
  multiFileSchema,
  validateAddress
} from '@/components/forms/MultiStep/formUtils';
import { auth } from '@/auth';
import { FilePond } from 'react-filepond';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function BidForm({ bidId = null }) {
  const { data: session, status, update } = useSession();
  const isEditMode = !!bidId;

  const [files, setFiles] = useState<any[]>([]);

  const [formData, setFormData] = useState<any>({
    task_trade_name: '',
    bid_amount: '',
    description: '',
    builder_notes: '',
    bid_payment_terms: '',
    status: '',
    bid_inscope: [''],
    bid_outscope: [''],
    scope_of_work: ''
  });

  const handleSubmitFun = async () => {
    //  server={{
    // process: {
    //   url: `https://backend-api-topaz.vercel.app/api/upload`,
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${session?.user.apiUserToken}`
    //   },

    // first upload all files
    const uploadPromises = files.map((file) => {
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

    // "data": {
    //   "type": "<string>",
    //   "attributes": {
    //     "project_id": "<integer>",
    //     "task_id": "<integer>",
    //     "builder_notes": [
    //       "<string>",
    //       "<string>"
    //     ],
    //     "scope_of_work": "<string>",
    //     "bid_status": "<string>",
    //     "bid_request_id": "<integer>",
    //     "creator_id": "<integer>",
    //     "updater_id": "<integer>",
    //     "created_at": "<dateTime>",
    //     "updated_at": "<dateTime>",
    //     "active": "<boolean>",
    //     "requester_id": "<integer>",
    //     "requestor_business_id": "<integer>",
    //     "creator_business_id": "<integer>",
    //     "reviewer_id": "<integer>",
    //     "approver_id": "<integer>",
    //     "budget_amount": "<number>",
    //     "bid_amount_from_sub": "<number>",
    //     "bid_details_from_sub": {
    //       "nullable": true
    //     },
    //     "inscope": "<string>",
    //     "outscope": "<string>",
    //     "payment_terms": "<string>",
    //     "builder_markup": "<number>",
    //     "builder_markup_percentage": "<number>",
    //     "bid_amount_builder": "<number>",
    //     "bid_expiration_date": "<dateTime>",
    //     "bid_recieved_date": "<dateTime>",
    //     "status": "<string>",
    //     "file_info": {
    //       "nullable": true
    //     },
    //     "labor_cost": "<number>",
    //     "material_cost": "<number>",
    //     "contingencies": "<string>",
    //     "estimated_completion_time": "<string>",
    //     "special_requirements": "<string>",
    //     "trade_type": "<string>",
    //     "total_cost": "<number>",
    //     "margin_percentage": "<number>",
    //     "margin_amount": "<number>",
    //     "qb_estimate_id": "<string>"
    //   },

    const formDataSample = {
      task_trade_name: formData.task_trade_name,
      bid_amount: formData.bid_amount,
      description: formData.description,
      builder_notes: formData.builder_notes,
      bid_payment_terms: formData.bid_payment_terms,
      status: formData.status,
      bid_inscope: formData.bid_inscope.filter(
        (bidInscope: string) => bidInscope.trim() !== ''
      ),
      bid_outscope: formData.bid_outscope.filter(
        (bidOutscope: string) => bidOutscope.trim() !== ''
      ),
      file_info: uploadResponsesJson.map((response) => response[0]),
      scope_of_work: '',
      bid_status: formData.status,
      bid_request: '',
      project: 1,
      task: 1
    };

    // then create the bid

    const response = await fetch(
      `https://backend-api-topaz.vercel.app/api/zen/bid`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.user.apiUserToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            type: 'bid',
            attributes: {
              ...formDataSample
            }
          }
        })
      }
    );

    if (response.ok) {
      console.log('Bid created successfully');

      toast({
        title: 'Bid created successfully'
      });
    } else {
      console.error('Failed to create bid');
      toast({
        title: 'Failed to create bid',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className=" h-full w-full rounded-md bg-white  p-5">
      <Toaster />
      <div className=" w-full">
        <h1 className="text-center text-2xl font-bold text-black">
          Create Bid
        </h1>
      </div>
      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Select Task/Trade Name
          </label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            name="task_trade_name"
            id="task_trade_name"
            value={formData.task_trade_name}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                task_trade_name: e.target.value
              }))
            }
          >
            <option value="">Select Task/Trade Name</option>
            <option value="task 1">Task 1</option>
            <option value="task 2">Task 2</option>
            <option value="task 3">Task 3</option>
          </select>
        </div>
      </div>
      <div className="mt-5 grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Bid Amount
          </label>
          <input
            type="number"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={formData.bid_amount}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                bid_amount: e.target.value
              }))
            }
          />
        </div>
      </div>

      <div className="mt-5 grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Description
          </label>
          <textarea
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                description: e.target.value
              }))
            }
          />
        </div>
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Builder Notes
          </label>
          <textarea
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={formData.builder_notes}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                builder_notes: e.target.value
              }))
            }
          />
        </div>
      </div>

      <div className="mt-5 grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Bid Payment Terms
          </label>
          <textarea
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={formData.bid_payment_terms}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                bid_payment_terms: e.target.value
              }))
            }
          />
        </div>
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Status
          </label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            name="task_trade_name"
            id="task_trade_name"
            value={formData.status}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                status: e.target.value
              }))
            }
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="mt-5 grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Bid inscope
          </label>
          {/* <div className=" flex gap-2">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              
            />
            <button className=" flex aspect-square h-full items-center justify-center rounded-md bg-rose-200 text-rose-700 ">
              -
            </button>
          </div>
          <div className=" flex gap-2">
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <button className=" flex aspect-square h-full items-center justify-center rounded-md bg-blue-200 text-blue-700 ">
              +
            </button>
            <button className=" flex aspect-square h-full items-center justify-center rounded-md bg-rose-200 text-rose-700 ">
              -
            </button>
          </div> */}
          {formData.bid_inscope.map((bidInscope: string, index: number) => (
            <div key={index} className=" flex gap-2">
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={bidInscope}
                onChange={(e) => {
                  const newBidInscope = [...formData.bid_inscope];
                  newBidInscope[index] = e.target.value;
                  setFormData((prev: any) => ({
                    ...prev,
                    bid_inscope: newBidInscope
                  }));
                }}
              />
              {index === formData.bid_inscope.length - 1 && (
                <button
                  className=" flex aspect-square h-full items-center justify-center rounded-md bg-blue-200 text-blue-700 "
                  onClick={() => {
                    setFormData((prev: any) => ({
                      ...prev,
                      bid_inscope: [...prev.bid_inscope, '']
                    }));
                  }}
                >
                  +
                </button>
              )}
              {formData.bid_inscope.length > 1 && (
                <button
                  className=" flex aspect-square h-full items-center justify-center rounded-md bg-rose-200 text-rose-700 "
                  onClick={() => {
                    if (formData.bid_inscope.length === 1) {
                      return;
                    }

                    const newBidInscope = [...formData.bid_inscope];
                    newBidInscope.splice(index, 1);
                    setFormData((prev: any) => ({
                      ...prev,
                      bid_inscope: newBidInscope
                    }));
                  }}
                >
                  -
                </button>
              )}
            </div>
          ))}
        </div>
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Bid outscope
          </label>
          {formData.bid_outscope.map((bidOutscope: string, index: number) => (
            <div key={index} className=" flex gap-2">
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={bidOutscope}
                onChange={(e) => {
                  const newBidOutscope = [...formData.bid_outscope];
                  newBidOutscope[index] = e.target.value;
                  setFormData((prev: any) => ({
                    ...prev,
                    bid_outscope: newBidOutscope
                  }));
                }}
              />
              {index === formData.bid_outscope.length - 1 && (
                <button
                  className=" flex aspect-square h-full items-center justify-center rounded-md bg-blue-200 text-blue-700 "
                  onClick={() => {
                    setFormData((prev: any) => ({
                      ...prev,
                      bid_outscope: [...prev.bid_outscope, '']
                    }));
                  }}
                >
                  +
                </button>
              )}
              {formData.bid_outscope.length > 1 && (
                <button
                  className=" flex aspect-square h-full items-center justify-center rounded-md bg-rose-200 text-rose-700 "
                  onClick={() => {
                    if (formData.bid_outscope.length === 1) {
                      return;
                    }

                    const newBidOutscope = [...formData.bid_outscope];
                    newBidOutscope.splice(index, 1);
                    setFormData((prev: any) => ({
                      ...prev,
                      bid_outscope: newBidOutscope
                    }));
                  }}
                >
                  -
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 grid w-full grid-cols-1 gap-5">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Bid image
          </label>
          <input
            type="file"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            multiple
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                const filesArray = Array.from(files);
                const filesInfo = filesArray.map((file) => {
                  return {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: URL.createObjectURL(file),
                    file: file
                  };
                });
                setFiles(filesInfo);
              }
            }}
          />
          {files.length > 0 && (
            <div className="flex gap-2">
              {files.map((file, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <img
                    src={file?.url as any}
                    alt={file?.name}
                    className="h-20 w-20"
                  />
                  <button
                    className="rounded-md bg-red-500 p-1 text-white"
                    onClick={() => {
                      setFiles((prev) =>
                        prev.filter(
                          (prevFile) =>
                            prevFile.name !== file.name &&
                            prevFile.size !== file.size
                        )
                      );
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-5 grid w-full grid-cols-1 gap-5">
        <div className=" flex w-full flex-col gap-2 ">
          <button
            className="rounded-md bg-blue-500 p-2 text-white"
            onClick={handleSubmitFun}
          >
            Add Bid
          </button>
        </div>
      </div>
    </div>
  );
}
