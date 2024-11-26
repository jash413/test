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

export default function NotesForm({ notesId = null }) {
  const { data: session, status, update } = useSession();
  const isEditMode = !!notesId;

  const [progressionNotes, setProgressionNotes] = useState<any>(null);

  const { fetchWithLoading } = useLoadingAPI();
  const [files, setFiles] = useState<any>([]);
  const { currentProjectId, setCurrentProjectId, projects } = useProjectState();

  const [formData, setFormData] = useState<any>({
    description: '',
    notes_type: '',
    file_info: []
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
          `https://backend-api-topaz.vercel.app/api/zen/progression_Notes/${notesId}`,

          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${session?.user.apiUserToken}`
            },
            body: JSON.stringify({
              data: {
                type: 'progression_Notes',
                attributes: {
                  description: formData.description,
                  project_id: Number(currentProjectId),
                  user_id: Number(session?.user.id),
                  notes_type: formData.notes_type,
                  file_info: uploadResponsesJson.map(
                    (response: any) => response[0]
                  )
                }
              }
            })
          }
        );
        if (res.status === 200) {
          setFormData({});
          toast({
            title: 'progression notes updated successfully'
          });
        } else {
          toast({
            title: 'Error updating progression notes',
            variant: 'destructive'
          });
        }
      } else {
        let res = await fetchWithLoading(
          `https://backend-api-topaz.vercel.app/api/zen/progression_Notes`,
          {
            method: 'POST',
            body: JSON.stringify({
              data: {
                type: 'progression_Notes',
                attributes: {
                  description: formData.description,
                  project_id: Number(currentProjectId),
                  user_id: Number(session?.user.id),
                  notes_type: formData.notes_type,
                  file_info: formData.file_info
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
            title: 'progression notes created successfully'
          });
        } else {
          toast({
            title: 'Error creating progression notes',
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
          Create Progression Notes
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

      <div className="mt-5 grid w-full grid-cols-1 gap-5">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Progression Message
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
      </div>

      {/* status */}

      <div className="mt-5 grid w-full grid-cols-1 gap-5">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="status"
          >
            Progression Status
          </label>
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={formData.notes_type}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                notes_type: e.target.value
              }))
            }
          >
            <option value="">Select Progression Status</option>
            <option value="issue">Issue</option>
            <option value="update">Update</option>
          </select>
        </div>
      </div>

      {/* files */}

      <div className="mt-5 grid w-full grid-cols-1 gap-5">
        <div className=" flex flex-col gap-2">
          <label
            className=" pl-1 text-sm font-bold text-black"
            htmlFor="task_trade_name"
          >
            Attach Files
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
            Add Progression Notes
          </button>
        </div>
      </div>
    </div>
  );
}
