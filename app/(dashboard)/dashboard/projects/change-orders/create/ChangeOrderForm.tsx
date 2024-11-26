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

export default function ChangeOrderForm({ orderId = null }) {
  const { data: session, status, update } = useSession();
  const isEditMode = !!orderId;

  const [changeOrder, setChangeOrder] = useState<any>(null);

  const { fetchWithLoading } = useLoadingAPI();
  const [files, setFiles] = useState<any>([]);
  const { currentProjectId, setCurrentProjectId, projects } = useProjectState();
  const [users, setUsers] = useState<any[]>([]);

  const [formData, setFormData] = useState<any>({
    notes: [],
    file_info: [],
    active: false,
    description: '',
    amount: '',
    status: '',
    increaase_budget: false,
    payment_terms: '',
    reviewed_by: '',
    approved_by: ''
  });

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

    getUsers();
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
          `https://backend-api-topaz.vercel.app/api/zen/change_Order/${orderId}`,

          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${session?.user.apiUserToken}`
            },
            body: JSON.stringify({
              data: {
                type: 'change_order',
                attributes: {
                  project_id: Number(currentProjectId),
                  creator_id: Number(session?.user.id),
                  notes: [formData.notes],
                  file_info: uploadResponsesJson.map(
                    (response: any) => response[0]
                  ),
                  active: formData.active,
                  description: formData.description,
                  amount: Number(formData.amount),
                  status: formData.status,
                  increaase_budget: formData.increaase_budget,
                  payment_terms: formData.payment_terms,
                  reviewed_by: parseInt(formData.reviewed_by),
                  approved_by: parseInt(formData.approved_by)
                  // notes is an array
                }
              }
            })
          }
        );
        if (res.status === 200) {
          setFormData({});
          toast({
            title: 'change order updated successfully'
          });
        } else {
          toast({
            title: 'Error updating change order',
            variant: 'destructive'
          });
        }
      } else {
        let res = await fetchWithLoading(
          `https://backend-api-topaz.vercel.app/api/zen/change_Order`,
          {
            method: 'POST',
            body: JSON.stringify({
              data: {
                type: 'change_order',
                attributes: {
                  project_id: Number(currentProjectId),
                  creator_id: Number(session?.user.id),
                  file_info: uploadResponsesJson.map(
                    (response: any) => response[0]
                  ),
                  notes: [formData.notes],
                  active: formData.active,
                  description: formData.description,
                  amount: Number(formData.amount),
                  status: formData.status,
                  increaase_budget: formData.increaase_budget,
                  payment_terms: formData.payment_terms,
                  reviewed_by: parseInt(formData.reviewed_by),
                  approved_by: parseInt(formData.approved_by)
                }
              }
            }),
            headers: {
              Authorization: `Bearer ${session?.user.apiUserToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (res.ok) {
          setFormData({});
          toast({
            title: 'change order created successfully'
          });
        } else {
          toast({
            title: 'Error creating change order',
            variant: 'destructive'
          });
        }
      }
    } catch (error) {
      console.log(error);
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
          description: 'Error fetching user',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      console.error('Error fetching users:', error.message);
      toast({
        title: 'Error',
        description: 'Error fetching user',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className=" h-full w-full rounded-md bg-white  p-5">
      <Toaster />
      <div className=" mb-7 flex w-full justify-between">
        <h1 className="text-center text-2xl font-bold text-black">
          Create Change Order
        </h1>
        <div className="">
          <Select value={currentProjectId.toString()} disabled={true}>
            <SelectTrigger className="line-clamp-1 min-w-[200px]">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* notes & description */}
      <div className="mt-5 grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
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
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
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

      {/* amount & status */}

      <div className="mt-5 grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
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

      {/* reviewed by & approved by , select field  */}

      <div className="mt-5 grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Reviewed By
          </label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            name="task_trade_name"
            id="task_trade_name"
            value={formData.reviewed_by}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                reviewed_by: e.target.value
              }))
            }
          >
            <option value="">Select User</option>
            {users.map((user: any) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Approved By
          </label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            name="task_trade_name"
            id="task_trade_name"
            value={formData.approved_by}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                approved_by: e.target.value
              }))
            }
          >
            <option value="">Select User</option>
            {users.map((user: any) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/*  increase Budget & active , swithc shadcn */}

      <div className="mt-5 grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Increase Budget
          </label>
          <Switch
            checked={formData.increaase_budget}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                increaase_budget: (e.target as HTMLInputElement).checked
              }))
            }
          />
        </div>
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Active
          </label>
          <Switch
            checked={formData.active}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                active: (e.target as HTMLInputElement).checked
              }))
            }
          />
        </div>
      </div>

      {/* payment terms */}

      <div className="mt-5 grid w-full grid-cols-1 gap-5">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Payment Terms
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            value={formData.payment_terms}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                payment_terms: e.target.value
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
            Add Change Order
          </button>
        </div>
      </div>
    </div>
  );
}
