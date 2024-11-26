// File: app/(dashboard)/dashboard/project_details/[id]/inspiration/InspirationCards.tsx

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, MessageSquare, Heart, MoreHorizontal } from 'lucide-react';
import { InspirationShape } from '@/server/types/project';
import ImageCarousel from '@/components/ImageCarousel';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// Define color mapping for categories
const categoryColors: { [key: string]: string } = {
  Kitchen: 'bg-red-200 text-red-800',
  Bathroom: 'bg-blue-200 text-blue-800',
  'Living Room': 'bg-green-200 text-green-800',
  Bedroom: 'bg-purple-200 text-purple-800',
  Exterior: 'bg-yellow-200 text-yellow-800'
  // Add more predefined categories here
};

// Default color for user-defined categories
const defaultCategoryColor = 'bg-gray-200 text-gray-800';

interface InspirationCardProps {
  inspiration: InspirationShape;
  projectId: string;
  onDelete: (inspiration: InspirationShape) => void;
}

function CategoryBadge({ category }: { category: string }) {
  const colorClass = categoryColors[category] || defaultCategoryColor;
  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-semibold ${colorClass}`}
    >
      {category}
    </span>
  );
}

export function InspirationGridCard({
  inspiration,
  projectId,
  onDelete
}: InspirationCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <Link
        href={`/dashboard/project_details/${projectId}/inspiration/${inspiration.id}`}
        className="flex h-full flex-col"
      >
        <div className="h-48 w-full p-2">
          <div className="relative h-full w-full">
            <ImageCarousel
              file_info={inspiration.inspiration_images || []}
              objectFit="cover"
            />
          </div>
        </div>
        <div className="flex flex-grow flex-col p-4">
          <CardHeader className="p-0 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{inspiration.title}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/project_details/${projectId}/inspiration/${inspiration.id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      onDelete(inspiration);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mb-2 mt-1">
              <CategoryBadge category={inspiration.category} />
            </div>
            <p className="line-clamp-2 text-sm text-gray-600">
              {inspiration.description}
            </p>
          </CardHeader>
          <CardContent className="flex flex-grow flex-col p-0 pt-2">
            <div className="mb-2 flex flex-wrap">
              {inspiration.tags?.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="mb-1 mr-1 rounded-full bg-gray-200 px-2 py-1 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-auto flex space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Eye size={16} className="mr-1" /> {inspiration.view_count || 0}
              </span>
              <span className="flex items-center">
                <MessageSquare size={16} className="mr-1" />{' '}
                {inspiration.comments?.length || 0}
              </span>
              <span className="flex items-center">
                <Heart size={16} className="mr-1" />{' '}
                {inspiration.likes?.length || 0}
              </span>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}

export function InspirationListCard({
  inspiration,
  projectId,
  onDelete
}: InspirationCardProps) {
  return (
    <Card className="flex h-32 overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <Link
        href={`/dashboard/project_details/${projectId}/inspiration/${inspiration.id}`}
        className="flex w-full"
      >
        <div className="w-1/5 p-2">
          <div className="relative h-full w-full">
            <ImageCarousel
              file_info={inspiration.inspiration_images || []}
              objectFit="cover"
            />
          </div>
        </div>
        <div className="flex w-4/5 flex-col justify-between p-4">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <CardTitle className="text-lg">{inspiration.title}</CardTitle>
                <CategoryBadge category={inspiration.category} />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/project_details/${projectId}/inspiration/${inspiration.id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      onDelete(inspiration);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="mb-2 line-clamp-1 text-sm text-gray-600">
              {inspiration.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap">
              {inspiration.tags
                ?.slice(0, 2)
                .map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="mr-1 rounded-full bg-gray-200 px-2 py-1 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              {inspiration.tags && inspiration.tags.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{inspiration.tags.length - 2} more
                </span>
              )}
            </div>
            <div className="flex space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Eye size={16} className="mr-1" /> {inspiration.view_count || 0}
              </span>
              <span className="flex items-center">
                <MessageSquare size={16} className="mr-1" />{' '}
                {inspiration.comments?.length || 0}
              </span>
              <span className="flex items-center">
                <Heart size={16} className="mr-1" />{' '}
                {inspiration.likes?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
