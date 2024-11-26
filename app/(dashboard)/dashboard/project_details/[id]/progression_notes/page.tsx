// app/(dashboard)/dashboard/project_details/[id]/change_orders/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, MessageCircle, Plus, Trash2, User2Icon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useLoadingAPI } from '@/app/hooks/useLoadingAPI';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const ProgressionNotes = () => {
  const [progressionNotes, setProgressionNotes] = useState([]);

  const { data: session } = useSession();

  const params = useParams();
  const { toast } = useToast();

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    progression: any;
  }>({
    isOpen: false,
    progression: null
  });

  const closeDeleteProgression = () => {
    setDeleteConfirmation({ isOpen: false, progression: null });
  };

  const [commentToShow, setCommentToShow] = useState<any[]>([]);
  const [progressionToAddComment, setProgressionToAddComment] = useState<{
    id: number;
    comments: any[];
  } | null>(null);
  const [commentModal, setCommentModal] = useState<boolean>(false);
  const [editComment, setEditComment] = useState<any>(null);
  const [commentFormData, setCommentFormData] = useState<any>({
    comment: ''
  });

  const { fetchWithLoading } = useLoadingAPI();

  const fetchProgressionNotes = async () => {
    try {
      let res = await fetchWithLoading('/api/generic-model/progressionNotes');

      if (res) {
        setProgressionNotes(res?.models);
      } else {
        setProgressionNotes([]);
      }
    } catch (error) {
      console.error('Error fetching change orders:', error);
    }
  };

  const handleEditComment = async () => {
    // try {
    //   let oldComments = editComment.item?.attributes?.comments || [];

    //   oldComments[editComment.index] = {
    //     user_id: Number(userid),
    //     comment: commentFormData.comment,
    //   };

    //   let payload = {
    //     data: {
    //       type: "progression_Notes",
    //       attributes: {
    //         comments: oldComments,
    //       },
    //     },
    //   };

    //   let data = await axios.patch(
    //     `${network.onlineUrl}api/progression_Notes/${editComment.item.id}`,
    //     payload,
    //     {
    //       headers: {
    //         "content-type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );

    //   if (data.status === 200) {
    //     toast.success("Comment updated successfully");
    //     getProgressionOnClient();
    //     setEditComment(null);
    //     setCommentFormData({ comment: "" });
    //     clickRef2.current.click();
    //   } else {
    //     toast.error("Error updating comment");
    //   }
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Error updating comment");
    // }

    try {
      let oldComments = editComment.item.comments || [];

      oldComments[editComment.index] = {
        user_id: Number(session?.user.id),
        comment: commentFormData.comment
      };

      let payload = {
        comments: oldComments
      };

      let formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value) || typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      formData.append('file_change_scenario', '4_no_changes_to_files');

      let data = await fetchWithLoading(
        `/api/generic-model/progressionNotes/${editComment.item.id}`,
        {
          method: 'PUT',
          body: formData
        }
      );

      if (data.ok) {
        toast({
          title: 'Success',
          description: 'Comment updated successfully'
        });
        fetchProgressionNotes();
        setEditComment(null);
        setCommentFormData({ comment: '' });
        setCommentModal(false);
      } else {
        toast({
          title: 'Error',
          description: 'Error updating comment',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Error updating comment',
        variant: 'destructive'
      });
    }
  };

  const handleSubmitComment = async () => {
    console.log('ssdsd');
    try {
      if (!session?.user.id) {
        toast({
          title: 'Error',
          description: 'User not found',
          variant: 'destructive'
        });
        return;
      }

      if (!commentFormData.comment) {
        toast({
          title: 'Error',
          description: 'Comment cannot be empty',
          variant: 'destructive'
        });
        return;
      }

      let oldComments = progressionToAddComment?.comments || [];

      let payload = {
        user_id: Number(session?.user.id),
        comments: [
          ...oldComments,
          {
            user_id: Number(session?.user.id),
            comment: commentFormData.comment
          }
        ]
      };

      let formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value) || typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      formData.append('file_change_scenario', '4_no_changes_to_files');

      let data = await fetchWithLoading(
        `/api/generic-model/progressionNotes/${progressionToAddComment?.id}`,
        {
          method: 'PUT',
          body: formData
        }
      );

      if (data.ok) {
        toast({
          title: 'Success',
          description: 'Comment added successfully'
        });
        fetchProgressionNotes();
        setCommentFormData({ comment: '' });
        setProgressionToAddComment(null);
        setCommentModal(false);
      } else {
        toast({
          title: 'Error',
          description: 'Error adding comment',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Error adding comment',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteComment = async (
    item: any,
    comment: any,
    index: number
  ) => {
    // try {
    // let oldComments = item?.attributes?.comments || [];

    // { comment , userid } so remove by index
    //   oldComments.splice(index, 1);

    //   let payload = {
    //     data: {
    //       type: "progression_Notes",
    //       attributes: {
    //         comments: oldComments,
    //       },
    //     },
    //   };

    //   let data = await axios.patch(
    //     `${network.onlineUrl}api/progression_Notes/${item.id}`,
    //     payload,
    //     {
    //       headers: {
    //         "content-type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );

    //   if (data.status === 200) {
    //     toast.success("Comment deleted successfully");
    //     getProgressionOnClient();
    //   } else {
    //     toast.error("Error deleting comment");
    //   }
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Error deleting comment");
    // }

    try {
      let oldComments = item.comments || [];

      oldComments.splice(index, 1);

      let payload = {
        comments: oldComments
      };

      let formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value) || typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      formData.append('file_change_scenario', '4_no_changes_to_files');

      let data = await fetchWithLoading(
        `/api/generic-model/progressionNotes/${item.id}`,
        {
          method: 'PUT',
          body: formData
        }
      );

      if (data.ok) {
        toast({
          title: 'Success',
          description: 'Comment deleted successfully'
        });
        fetchProgressionNotes();
      } else {
        toast({
          title: 'Error',
          description: 'Error deleting comment',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Error deleting comment',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchProgressionNotes();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold lg:text-xl">Progression notes</h2>
      </div>

      <div className="w-full">
        <div className=" flex w-full flex-col gap-4 pb-10 ">
          {progressionNotes?.length > 0 &&
            progressionNotes?.map((item: any, index) => (
              <div
                className=" flex h-auto w-full flex-col gap-3 rounded-md bg-white p-3 "
                key={index}
              >
                <div className=" flex w-full items-center gap-3">
                  <div className=" flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border bg-gray-100 ">
                    {/* <User2Icon size={28} /> */}
                  </div>
                  <div className="item-center flex grow gap-4">
                    <span className=" text-base font-semibold">
                      {item?.user_id ?? 'Anonymous'}
                    </span>
                    <span className="flex items-center text-xs text-gray-700">
                      {format(new Date(Date.now()), 'dd MMM yyyy HH:mm')}
                    </span>
                  </div>
                  <div className=" h-6 w-6 ">
                    <div className="hs-dropdown ti-dropdown">
                      <div
                        className=" !m-0 cursor-pointer !gap-0 !text-sm !font-medium !text-gray-800"
                        aria-expanded="false"
                      >
                        <i className="ri-more-2-fill text-lg font-semibold "></i>
                      </div>
                      <div
                        className="hs-dropdown-menu ti-dropdown-menu !-mt-2 hidden "
                        role="menu"
                      >
                        <button
                          className="ti-dropdown-item block w-full !px-[0.9375rem] !py-2 text-start !text-[0.8125rem] !font-medium "
                          data-hs-overlay="#add-progression"
                          onClick={() => {
                            // setEditProgression(item);
                            // setFormData({
                            //   description: item?.attributes?.description,
                            //   notes_type: item?.attributes?.notes_type,
                            //   file_info: item?.attributes?.file_info,
                            // });
                            // loadFiles(item?.attributes?.file_info);
                          }}
                        >
                          Edit Note
                        </button>
                        <button
                          className="ti-dropdown-item block w-full !px-[0.9375rem] !py-2 text-start !text-[0.8125rem] !font-medium "
                          onClick={() => {
                            setDeleteConfirmation({
                              isOpen: true,
                              progression: item
                            });
                          }}
                        >
                          Delete Note
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" pl-3">{item?.description}</div>
                <div className=" w-full  pl-3 ">
                  <div className=" flex w-full flex-row gap-5 overflow-x-hidden">
                    {/* {item?.attributes?.file_info?.length > 0 &&
                      item?.attributes?.file_info?.map((obj, index) => {
                        return (
                        
                          <div
                            className="w-[calc(20%-20px)] flex items-center justify-center aspect-square bg-slate-100 rounded-md shrink-0 cursor-pointer"
                            key={index}
                            onClick={() => {
                              if (
                                cachePreviews[obj.file_url] &&
                                cachePreviews[obj.file_url].type !== "pdf"
                              ) {
                                setOpenImagePreview(
                                  cachePreviews[obj.file_url].src
                                );
                              }
                            }}
                          >
                            {cachePreviews[obj.file_url] ? (
                              cachePreviews[obj.file_url].type === "pdf" ? (
                                <>
                                  <img
                                    src={imageIcon.src}
                                    alt="image"
                                    className="max-w-full max-h-full h-auto w-auto object-fit"
                                  />
                                  <div>
                                    {cachePreviews[obj.file_url].src}
                                  </div>
                                </>
                              ) : (
                                <img
                                  src={cachePreviews[obj.file_url].src}
                                  alt="image"
                                  className="max-w-full max-h-full h-auto w-auto object-fit"
                                />
                              )
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <i className="ri-loader-4-line animate-spin"></i>
                              </div>
                            )}
                          </div>
                        );
                      })} */}
                  </div>
                </div>
                <div className=" flex w-fit items-center justify-center gap-1 pl-3">
                  <div
                    className=" flex  w-fit cursor-pointer items-center gap-1 rounded-xl border border-transparent bg-gray-300 px-3 py-1 hover:bg-gray-400 "
                    onClick={() => {
                      setCommentToShow((prev: any) => {
                        if (prev.includes(item.id)) {
                          return prev.filter((id: any) => id !== item.id);
                        } else {
                          return [...prev, item.id];
                        }
                      });
                    }}
                  >
                    <MessageCircle size={16} />
                    <span>
                      {item?.comments?.length > 0 ? item?.comments?.length : 0}
                    </span>
                  </div>
                  {commentToShow.includes(item.id) && (
                    <Dialog
                      open={commentModal}
                      onOpenChange={(open) => setCommentModal(open)}
                    >
                      <DialogTrigger asChild>
                        <div
                          className=" flex  w-fit cursor-pointer gap-1 rounded-xl border border-gray-500 px-3 py-1 hover:border-transparent hover:bg-gray-300 "
                          onClick={() => {
                            setProgressionToAddComment(item);
                          }}
                        >
                          <i className="ri-add-line font-medium"></i>
                          <span>Add Comment</span>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            {!!editComment ? 'Edit Comment' : 'Add Comment'}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="!overflow-visible px-4">
                          <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-12 xl:col-span-12">
                              <label htmlFor="comment" className="form-label">
                                Comment
                              </label>
                              <textarea
                                className="form-control mt-2 w-full !rounded-md p-4"
                                id="comment"
                                rows={2}
                                placeholder="Type your comment here..."
                                onChange={(event) => {
                                  setCommentFormData({
                                    comment: event.target.value
                                  });
                                }}
                                value={commentFormData?.comment}
                              ></textarea>
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="ml-auto sm:justify-start">
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              Close
                            </Button>
                          </DialogClose>

                          <Button
                            onClick={() => {
                              if (editComment) {
                                handleEditComment();
                              } else {
                                console.log('sd');
                                handleSubmitComment();
                              }
                            }}
                            className=" ml-auto bg-primary !font-medium text-white"
                          >
                            {(!!editComment as any) ? 'Update' : 'Create'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                {item?.comments?.length > 0 &&
                  commentToShow.includes(item.id) && (
                    <>
                      <div className=" mx-4 h-[1px] w-[calc(100%-32px)] bg-gray-200 "></div>
                      <div className=" flex w-full flex-col gap-4 pl-6">
                        {item?.comments.map((comment: any, index: number) => (
                          <div
                            className=" flex flex-col gap-[2px] pl-2"
                            key={index}
                          >
                            <div className=" flex items-center gap-3">
                              <div className=" h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                                {/* <img
                                  src={userIcon?.src}
                                  alt="userIcon"
                                  className="w-full h-auto"
                                /> */}
                              </div>
                              <div className=" grow text-[15px] font-semibold ">
                                name {comment.user_id}
                              </div>
                              <div className="">
                                {session?.user.id == comment.user_id && (
                                  <div className=" flex items-center gap-2">
                                    <div
                                      className=" h-6 w-6"
                                      onClick={() => {
                                        setEditComment({
                                          item: item,
                                          comment: comment,
                                          index: index
                                        });
                                        setCommentFormData({
                                          comment: comment.comment
                                        });
                                        setCommentModal(true);
                                      }}
                                    >
                                      {/* <i className="ri-pencil-line text-base"></i> */}
                                      <Edit2 size={16} />
                                    </div>
                                    <div
                                      className=" h-6 w-6 cursor-pointer"
                                      onClick={() => {
                                        handleDeleteComment(
                                          item,
                                          comment,
                                          index
                                        );
                                      }}
                                    >
                                      {/* <i className="ri-delete-bin-line text-base"></i> */}
                                      <Trash2 size={16} />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className=" pl-11 text-sm font-light">
                              {comment.comment}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
              </div>
            ))}
        </div>
      </div>

      <DeleteConfirmation
        isOpen={deleteConfirmation.isOpen}
        onClose={closeDeleteProgression}
        itemName={deleteConfirmation.progression?.id || ''}
        itemType="purchase order"
        confirmText={deleteConfirmation.progression?.id?.toString() || ''}
        apiEndpoint={`/api/generic-model/progressionNotes/${deleteConfirmation.progression?.id}`}
        redirectPath={`/dashboard/project_details/${params.folderId}/progression_notes`}
      />
    </div>
  );
};

export default ProgressionNotes;
