'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useLoadingAPI } from '@/app/hooks/useLoadingAPI';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useProjectState } from '@/hooks/useProjectState';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export default function PurchaseOrderForm({ orderId = null }) {
  const { data: session, status, update } = useSession();
  const isEditMode = !!orderId;

  const [changeOrder, setChangeOrder] = useState<any>(null);

  const { fetchWithLoading } = useLoadingAPI();
  const [files, setFiles] = useState<any>([]);
  const { currentProjectId, setCurrentProjectId, projects } = useProjectState();

  const [formData, setFormData] = useState<any>({
    active: true,
    order_date: new Date(),
    delivery_date: new Date(),
    user_id: '',
    description: '',
    amount: '',
    business_id: '',
    notes: [],
    status: '',
    po_number: '',
    file_info: []
  });

  const [Users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // if (false) {
    //   axios
    //     .get(`${network.onlineUrl}api/task/${}`, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     })
    //     .then((response) => {
    //       const task = response.data.body.data.attributes;
    //       setFormData({
    //         taskCode: task.task_code,
    //         taskName: task.task_name,
    //         description: task.description,
    //         startDate: task.start_date,
    //         endDate: task.end_date,
    //         taskOwnerId: task.task_owner_id,
    //         businessId: task.business_id,
    //         status: task.status,
    //         notes: task.notes,
    //         estimatedBudget: task.budget_estimated,
    //         actualSpent: task.actual_spent,
    //         percentageComplete: task.percentage_complete,
    //         task_original_id: response.data.body.data.id,
    //         file_info: task.file_info,
    //       });
    //       const loadFiles = async () => {
    //         const loadedFiles = await Promise.all(
    //           task?.file_info.map(file => fileLoad(file, token))
    //         );
    //         console.log(loadedFiles);
    //         setFiles(loadedFiles.filter(file => file !== null).map(file => ({
    //           source: file,
    //           options: { type: 'local' }
    //         })));
    //       };
    //       loadFiles();
    //       setLoading(false);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // } else if (formType === "create") {
    //   setLoading(false);
    // }
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

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

    try {
      if (isEditMode) {
        let res = await fetchWithLoading(
          `https://backend-api-topaz.vercel.app/api/zen/purchase_Order/${orderId}`,

          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${session?.user.apiUserToken}`
            },
            body: JSON.stringify({
              data: {
                type: 'purchase_order',
                attributes: {
                  project_id: Number(currentProjectId),
                  Order_date: formData.order_date,
                  Delivery_date: formData.delivery_date,
                  user_id: formData.user_id,
                  description: formData.description,
                  amount: Number(formData.amount),
                  business_id: formData.business_id,
                  notes: formData.notes,
                  status: formData.status,
                  po_number: formData.po_number,
                  file_info: formData.file_info,
                  active: formData.active
                }
              }
            })
          }
        );
        if (res.status === 200) {
          setFormData({});
          toast({
            title: 'purchase order updated successfully'
          });
        } else {
          toast({
            title: 'Error updating purchase order',
            variant: 'destructive'
          });
        }
      } else {
        let res = await fetchWithLoading(
          `https://backend-api-topaz.vercel.app/api/zen/purchase_Order`,
          {
            method: 'POST',
            body: JSON.stringify({
              data: {
                type: 'purchase_order',
                attributes: {
                  project_id: Number(currentProjectId),
                  Order_date: formData.order_date,
                  Delivery_date: formData.delivery_date,
                  user_id: formData.user_id,
                  description: formData.description,
                  amount: Number(formData.amount),
                  business_id: formData.business_id,
                  notes: formData.notes,
                  status: formData.status,
                  po_number: formData.po_number,
                  file_info: formData.file_info,
                  active: formData.active
                }
              }
            }),
            headers: {
              Authorization: `Bearer ${session?.user.apiUserToken}`
            }
          }
        );

        if (res.status === 201) {
          setFormData({});
          toast({
            title: 'purchase order created successfully'
          });
        } else {
          toast({
            title: 'Error creating purchase order',
            variant: 'destructive'
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" h-full w-full rounded-md bg-white  p-5">
      <Toaster />
      <div className=" mb-7 flex w-full justify-between">
        <h1 className="text-center text-2xl font-bold text-black">
          Create Purchase Order
        </h1>
        <div className="">
          <Select value={currentProjectId.toString()} disabled={true}>
            <SelectTrigger className="line-clamp-1 min-w-[200px]">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects?.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* order date & delivery date */}

      <div className="mt-5 grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="order_date"
          >
            Order Date
          </label>
          <input
            type="date"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            value={formData.order_date}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                order_date: e.target.value
              }))
            }
          />
        </div>
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="delivery_date"
          >
            Delivery Date
          </label>
          <input
            type="date"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            value={formData.delivery_date}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                delivery_date: e.target.value
              }))
            }
          />
        </div>
      </div>

      {/* user & business , select */}

      <div className="mt-5 grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="user_id"
          >
            User
          </label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            name="user_id"
            id="user_id"
            value={formData.user_id}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                user_id: e.target.value
              }))
            }
          >
            <option value="">Select User</option>
            {Users &&
              Users?.map((user: any, index: number) => (
                <option key={index} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>
        </div>
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="business_id"
          >
            Business
          </label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            name="business_id"
            id="business_id"
            value={formData.business_id}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                business_id: e.target.value
              }))
            }
          >
            <option value="">Select Business</option>
            <option value="1">Business 1</option>
            <option value="2">Business 2</option>
            <option value="3">Business 3</option>
          </select>
        </div>

        {/*  amount & status */}

        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="amount"
          >
            Amount
          </label>
          <input
            type="number"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                amount: e.target.value
              }))
            }
          />
        </div>
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="status"
          >
            Status
          </label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            name="status"
            id="status"
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

        {/* description & notes */}

        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
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
          <label className=" pl-1 text-sm font-bold text-black" htmlFor="notes">
            Notes
          </label>
          <textarea
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                notes: e.target.value
              }))
            }
          />
        </div>
      </div>

      {/* PO number */}

      <div className="mt-5 grid w-full grid-cols-1 gap-5">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="po_number"
          >
            PO Number
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            value={formData.po_number}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                po_number: e.target.value
              }))
            }
          />
        </div>
      </div>

      {/* files */}

      <div className="mt-5 grid w-full grid-cols-1 gap-5">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Task image
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
              {files.map((file: any, index: number) => (
                <div key={index} className="flex flex-col gap-2">
                  <img
                    src={file?.url as any}
                    alt={file?.name}
                    className="h-20 w-20"
                  />
                  <button
                    className="rounded-md bg-red-500 p-1 text-white"
                    onClick={() => {
                      setFiles((prev: any) =>
                        prev.filter(
                          (prevFile: any) =>
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
            onClick={handleSubmit}
          >
            Add Purchase Order
          </button>
        </div>
      </div>
    </div>
  );
}
