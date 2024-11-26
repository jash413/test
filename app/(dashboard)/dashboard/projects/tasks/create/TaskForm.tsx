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

export default function TaskForm({ bidId = null }) {
  const { data: session, status, update } = useSession();
  const isEditMode = !!bidId;

  const [task, setTask] = useState<any>(null);

  const { fetchWithLoading } = useLoadingAPI();
  const [files, setFiles] = useState<any>([]);
  const { currentProjectId, setCurrentProjectId, projects } = useProjectState();

  const [formData, setFormData] = useState<any>({
    taskCode: null,
    taskName: null,
    description: null,
    startDate: null,
    endDate: null,
    taskOwnerId: null,
    businessId: null,
    status: null,
    notes: [],
    estimatedBudget: null,
    actualSpent: null,
    percentageComplete: null,
    file_info: [],
    task_original_id: null
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [gcBusiness, setGcBuisness] = useState([]);

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
          `https://backend-api-topaz.vercel.app/api/zen/task/${formData.task_original_id}`,

          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${session?.user.apiUserToken}`
            },
            body: JSON.stringify({
              data: {
                type: 'task',
                id: formData.task_original_id,
                attributes: {
                  task_code: formData.taskCode,
                  project_id: Number(currentProjectId),
                  task_name: formData.taskName,
                  description: formData.description,
                  start_date: formData.startDate
                    ? new Date(formData.startDate)
                    : null,
                  end_date: formData.endDate
                    ? new Date(formData.endDate)
                    : null,
                  task_owner_id: formData.taskOwnerId,
                  business_id: formData.businessId,
                  status: formData.status,
                  notes: formData.notes,
                  budget_estimated: formData.estimatedBudget,
                  actual_spent: formData.actualSpent,
                  percentage_complete: Number(formData.percentageComplete),
                  file_info: formData.file_info
                }
              }
            })
          }
        );
        if (res.status === 200) {
          setFormData({});
          toast({
            title: 'Task updated successfully'
          });
        } else {
          toast({
            title: 'Error updating task',
            variant: 'destructive'
          });
        }
      } else {
        let res = await fetchWithLoading(
          `https://backend-api-topaz.vercel.app/api/zen/task`,
          {
            method: 'POST',
            body: JSON.stringify({
              data: {
                type: 'task',
                attributes: {
                  project_id: Number(currentProjectId),
                  task_code: formData.taskCode,
                  task_name: formData.taskName,
                  description: formData.description,
                  start_date: formData.startDate
                    ? new Date(formData.startDate)
                    : null,
                  end_date: formData.endDate
                    ? new Date(formData.endDate)
                    : null,
                  task_owner_id: formData.taskOwnerId,
                  business_id: formData.businessId,
                  status: formData.status,
                  notes: formData.notes,
                  budget_estimated: Number(formData.estimatedBudget),
                  actual_spent: Number(formData.actualSpent),
                  percentage_complete: Number(formData.percentageComplete),
                  file_info: uploadResponsesJson.map(
                    (response: any) => response[0]
                  )
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
            title: 'Task created successfully'
          });
        } else {
          toast({
            title: 'Error creating task',
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
          Create Task
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

      <div className="mt-5 grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Task Code
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            value={formData.taskCode}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                taskCode: e.target.value
              }))
            }
          />
        </div>
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Task Name
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            value={formData.taskName}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                taskName: e.target.value
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
            Start Date
          </label>
          <input
            type="date"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            value={formData.startDate}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                startDate: e.target.value
              }))
            }
          />
        </div>
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            End Date
          </label>
          <input
            type="date"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            value={formData.endDate}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                endDate: e.target.value
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
            Task Owner ID
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            value={formData.taskOwnerId}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                taskOwnerId: e.target.value
              }))
            }
          />
        </div>

        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="business"
          >
            Business ID
          </label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            name="business"
            id="business"
            value={formData.businessId}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                businessId: e.target.value
              }))
            }
          >
            <option value="">Select Business</option>
            <option value="1">Business 1</option>
            <option value="2">Business 2</option>
            <option value="3">Business 3</option>
          </select>
        </div>
      </div>

      <div className="mt-5 grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
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
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Estimated Budget
          </label>
          <input
            type="number"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            value={formData.estimatedBudget}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                estimatedBudget: e.target.value
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

      <div className="mt-5 grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Actual Spent
          </label>
          <input
            type="number"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            value={formData.actualSpent}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                actualSpent: e.target.value
              }))
            }
          />
        </div>
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Percentage Complete
          </label>
          <input
            type="number"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            value={formData.percentageComplete}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                percentageComplete: e.target.value
              }))
            }
          />
        </div>
      </div>

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
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}
