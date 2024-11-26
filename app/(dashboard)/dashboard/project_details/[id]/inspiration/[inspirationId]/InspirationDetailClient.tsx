// File: app/(dashboard)/dashboard/project_details/[id]/inspiration/[inspirationId]/InspirationDetailClient.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { InspirationShape } from '@/server/types/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Edit,
  Trash,
  Send,
  Tag,
  Folder
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import ImageCarousel from '@/components/ImageCarousel';
import { Like, Comment } from '@/server/types/base_mapping';
import { formatTimestamp } from '@/lib/date_utils';

interface InspirationDetailClientProps {
  inspiration: InspirationShape & { id: string };
  currentUser: { id: number; name: string };
  projectId: string;
}

export default function InspirationDetailClient({
  inspiration,
  currentUser,
  projectId
}: InspirationDetailClientProps) {
  // console.log('inspiration:', inspiration);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(inspiration.comments || []);
  const [likes, setLikes] = useState(inspiration.likes || []);

  const handleDelete = () => setIsDeleteConfirmationOpen(true);

  const handleLike = async () => {
    const isLiked = likes.some((like: Like) => like.userId === currentUser.id);
    const action = isLiked ? 'remove' : 'add';
    const newLike = {
      userId: currentUser.id,
      userName: currentUser.name,
      timestamp: new Date().toISOString()
    };

    const formData = new FormData();
    formData.append('socialInteractionType', 'like');
    formData.append(
      'data',
      JSON.stringify({
        action,
        like: newLike
      })
    );

    try {
      const response = await fetch(
        `/api/generic-model/inspiration/${inspiration.id}`,
        {
          method: 'PUT',
          body: formData
        }
      );

      if (!response.ok) throw new Error('Failed to update like');

      const updatedLikes = isLiked
        ? likes.filter((like: Like) => like.userId !== currentUser.id)
        : [...likes, newLike];
      setLikes(updatedLikes);

      toast({
        title: 'Success',
        description: isLiked ? 'Like removed' : 'Inspiration liked'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update like',
        variant: 'destructive'
      });
    }
  };

  const handleShare = () => {
    toast({
      title: 'Share',
      description: 'Sharing functionality to be implemented'
    });
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: comments.length + 1,
      userName: currentUser.name,
      timestamp: new Date().toISOString(),
      text: newComment.trim()
    };

    const formData = new FormData();
    formData.append('socialInteractionType', 'comment');
    formData.append('data', JSON.stringify(newCommentObj));

    try {
      const response = await fetch(
        `/api/generic-model/inspiration/${inspiration.id}`,
        {
          method: 'PUT',
          body: formData
        }
      );

      if (!response.ok) throw new Error('Failed to add comment');

      const result = await response.json();
      setComments([...comments, newCommentObj]);
      setNewComment('');
      toast({
        title: 'Success',
        description: 'Comment added successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive'
      });
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    const formData = new FormData();
    formData.append('socialInteractionType', 'comment');
    formData.append(
      'data',
      JSON.stringify({
        action: 'remove',
        commentId
      })
    );

    try {
      const response = await fetch(
        `/api/generic-model/inspiration/${inspiration.id}`,
        {
          method: 'PUT',
          body: formData
        }
      );

      if (!response.ok) throw new Error('Failed to delete comment');

      const updatedComments = comments.filter(
        (comment: Comment) => comment.id !== commentId
      );
      setComments(updatedComments);
      toast({
        title: 'Success',
        description: 'Comment deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete comment',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-2 py-2">
      <div className="grid grid-cols-1 gap-8 overflow-hidden rounded-lg bg-white shadow-lg lg:grid-cols-2">
        {/* Left side - Inspiration View */}
        <div className="p-6">
          <div className="mb-6 h-96">
            <ImageCarousel
              file_info={inspiration.inspiration_images || []}
              objectFit="cover"
            />
          </div>
          <h1 className="mb-2 text-3xl font-bold">{inspiration.title}</h1>
          <div className="mb-4 flex items-center text-gray-600">
            <Folder size={20} className="mr-2" />
            <span>{inspiration.category}</span>
          </div>
          <p className="mb-6 text-gray-600">{inspiration.description}</p>
          {inspiration.tags && inspiration.tags.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-2 text-xl font-semibold">Tags</h2>
              <div className="flex flex-wrap">
                {inspiration.tags.map((tag: string, index: number) => (
                  <div
                    key={index}
                    className="mb-2 mr-2 flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
                  >
                    <Tag size={14} className="mr-1" />
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          )}
          {inspiration.links && inspiration.links.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-2 text-xl font-semibold">Related Links</h2>
              <ul className="list-disc pl-5">
                {inspiration.links.map((link: any, index: number) => (
                  <li key={index} className="mb-2">
                    <a
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {link.description}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right side - Interactions */}
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex space-x-4">
              <Button variant="ghost" onClick={handleLike}>
                <Heart
                  className={
                    likes.some((like: Like) => like.userId === currentUser.id)
                      ? 'fill-current text-red-500'
                      : ''
                  }
                />
                <span className="ml-2">{likes.length}</span>
              </Button>
              <Button variant="ghost">
                <MessageCircle />
                <span className="ml-2">{comments.length}</span>
              </Button>
              <Button variant="ghost" onClick={handleShare}>
                <Share2 />
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/project_details/${projectId}/inspiration/${inspiration.id}/edit`}
                  >
                    <Edit size={16} className="mr-2" /> Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>
                  <Trash size={16} className="mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mb-6">
            <h2 className="mb-4 text-xl font-semibold">Comments</h2>
            <div className="mb-4 max-h-96 space-y-4 overflow-y-auto">
              {comments.length > 0 ? (
                comments.map((comment: Comment) => (
                  <div key={comment.id} className="rounded bg-gray-100 p-3">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{comment.userName}</p>
                      <div className="flex items-center">
                        <p className="mr-2 text-sm text-gray-500">
                          {formatTimestamp(comment.timestamp)}
                        </p>
                        {comment.userName === currentUser.name && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0"
                            onClick={() => handleCommentDelete(comment.id)}
                          >
                            <Trash size={16} className="text-red-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="mt-1">{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No comments yet</p>
              )}
            </div>
            <form onSubmit={handleCommentSubmit} className="flex">
              <Input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" className="ml-2">
                <Send size={20} />
              </Button>
            </form>
          </div>
        </div>
      </div>

      <DeleteConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        itemName={inspiration.title}
        itemType="Inspiration"
        confirmText={inspiration.title}
        apiEndpoint={`/api/generic-model/inspiration/${inspiration.id}`}
        redirectPath={`/dashboard/project_details/${projectId}/inspiration`}
      />
    </div>
  );
}
