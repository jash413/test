// File: app/(dashboard)/dashboard/project_details/[id]/inspiration/InspirationClient.tsx

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import Link from 'next/link';
import { Grid, List, Plus } from 'lucide-react';
import { InspirationShape } from '@/server/types/project';
import DeleteConfirmationDialog from '@/components/DeleteConfirmation';
import { InspirationGridCard, InspirationListCard } from './InspirationCards';

interface InspirationClientProps {
  inspirations: InspirationShape[];
  projectId: string;
  categories: string[];
  tags: string[];
}

export function InspirationClient({
  inspirations,
  projectId,
  categories,
  tags
}: InspirationClientProps) {
  const [filter, setFilter] = useState({ category: '', tag: '', search: '' });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [selectedInspiration, setSelectedInspiration] =
    useState<InspirationShape | null>(null);

  const filteredInspirations = inspirations.filter(
    (insp) =>
      (filter.category ? insp.category === filter.category : true) &&
      (filter.tag ? insp.tags?.includes(filter.tag) : true) &&
      (filter.search
        ? insp.title.toLowerCase().includes(filter.search.toLowerCase())
        : true)
  );

  const handleDelete = (inspiration: InspirationShape) => {
    setSelectedInspiration(inspiration);
    setIsDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setIsDeleteConfirmationOpen(false);
    setSelectedInspiration(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="flex flex-grow space-x-4">
          <Input
            className="w-1/3 bg-white"
            placeholder="Search inspirations"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
          <Select
            value={filter.category}
            onValueChange={(value) => setFilter({ ...filter, category: value })}
          >
            <SelectTrigger className="w-1/3 bg-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filter.tag}
            onValueChange={(value) => setFilter({ ...filter, tag: value })}
          >
            <SelectTrigger className="w-1/3 bg-white">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setViewMode('grid')}
            variant={viewMode === 'grid' ? 'default' : 'outline'}
          >
            <Grid size={20} />
          </Button>
          <Button
            onClick={() => setViewMode('list')}
            variant={viewMode === 'list' ? 'default' : 'outline'}
          >
            <List size={20} />
          </Button>
          <Link
            href={`/dashboard/project_details/${projectId}/inspiration/create`}
          >
            <Button>
              <Plus size={20} />
            </Button>
          </Link>
        </div>
      </div>

      <div
        className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1'
        }`}
      >
        {filteredInspirations.map((inspiration) => (
          <div key={inspiration.id}>
            {viewMode === 'grid' ? (
              <InspirationGridCard
                inspiration={inspiration}
                projectId={projectId}
                onDelete={handleDelete}
              />
            ) : (
              <InspirationListCard
                inspiration={inspiration}
                projectId={projectId}
                onDelete={handleDelete}
              />
            )}
          </div>
        ))}
      </div>

      {selectedInspiration && (
        <DeleteConfirmationDialog
          isOpen={isDeleteConfirmationOpen}
          onClose={handleCloseDeleteConfirmation}
          itemName={selectedInspiration.title}
          itemType="Inspiration"
          confirmText={selectedInspiration.title}
          apiEndpoint={`/api/generic-model/inspiration/${selectedInspiration.id}`}
          redirectPath={`/dashboard/project_details/${projectId}/inspiration`}
        />
      )}
    </div>
  );
}

export default InspirationClient;
