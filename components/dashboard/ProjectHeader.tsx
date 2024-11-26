// components\dashboard\ProjectHeader.tsx

'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash, Info } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
import DeleteConfirmation from '@/components/DeleteConfirmation';

interface ProjectHeaderProps {
  id: number;
  name: string;
  logo: string;
  status: string;
  description: string;
  address: string;
  heatedSquareFootage: number;
  nonHeatedSquareFootage: number;
  lotSizeAcres: number;
  timelineInfo: {
    originalEstimatedDate: string;
    forecasetedEstimatedDate: string;
    status: string;
  };
  budgetInfo: {
    originalEstimateBudget: number;
    forecastedEstimateBudget: number;
    status: string;
  };
}

const StatusIndicator: React.FC<{
  status: string;
  label: string;
  type: 'time' | 'budget';
}> = ({ status, label, type }) => {
  const getStatusText = () => {
    if (type === 'time') {
      return status === 'G' ? 'On time' : status === 'R' ? 'Delayed' : 'Watch';
    } else {
      return status === 'G' ? 'Under' : status === 'R' ? 'Over' : 'Watch';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">{label}</span>
      <div
        className={`h-3 w-3 rounded-full ${
          status === 'R'
            ? 'bg-red-500'
            : status === 'G'
            ? 'bg-green-500'
            : 'bg-yellow-500'
        }`}
      ></div>
      <span className="text-xs text-gray-600">({getStatusText()})</span>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value
}) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-600">{label}:</span>
    <span className="text-sm font-semibold">{value}</span>
  </div>
);

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  id,
  name,
  logo,
  status,
  description,
  address,
  heatedSquareFootage,
  nonHeatedSquareFootage,
  lotSizeAcres,
  timelineInfo,
  budgetInfo
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [descriptionFontSize, setDescriptionFontSize] = useState(14); // Starting font size
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const adjustFontSize = () => {
      if (descriptionRef.current) {
        let currentSize = descriptionFontSize;
        while (descriptionRef.current.clientHeight > 48 && currentSize > 10) {
          currentSize -= 1;
          descriptionRef.current.style.fontSize = `${currentSize}px`;
        }
        setDescriptionFontSize(currentSize);
      }
    };

    adjustFontSize();
  }, [description, descriptionFontSize]);

  const handleViewDetails = () => {
    toast({
      title: 'View Project Details',
      description: 'View details functionality to be implemented.'
    });
  };

  const handleDeleteProject = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-4 rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex flex-grow space-x-4">
          <div className="relative h-16 w-16 flex-shrink-0">
            <Image
              src={logo}
              alt={`${name} logo`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold">{name}</h1>
            <p
              ref={descriptionRef}
              className="overflow-hidden text-gray-500"
              style={{
                fontSize: `${descriptionFontSize}px`,
                lineHeight: '1.2em',
                height: '2.4em',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis'
              }}
            >
              {description}
            </p>
            <p className="mt-1 text-sm text-gray-600">{address}</p>
          </div>
        </div>
        <div className="flex items-start space-x-8">
          <div className="mr-4 text-right">
            <div className="text-sm text-gray-600">
              Heated Sq Ft: {heatedSquareFootage.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              Non-Heated Sq Ft: {nonHeatedSquareFootage.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              Lot Size: {lotSizeAcres} acres
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleViewDetails}>
                <Info className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
              <Link href={`/dashboard/project_details/${id}/edit`}>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit Project</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={handleDeleteProject}>
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete Project</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <div className="flex justify-center mb-4">
            <StatusIndicator status={timelineInfo.status} label="Time" type="time" />
          </div>
          <div className="space-y-4">
            <InfoRow 
              label="Original Due Date"
              value={timelineInfo.originalEstimatedDate}
            />
            <InfoRow 
              label="Forecasted Due Date"
              value={timelineInfo.forecasetedEstimatedDate}
            />
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="flex justify-center mb-4">
            <StatusIndicator status={budgetInfo.status} label="Budget" type="budget" />
          </div>
          <div className="space-y-4">
            <InfoRow 
              label="Original Estimate"
              value={`$${budgetInfo.originalEstimateBudget.toLocaleString()}`}
            />
            <InfoRow 
              label="New Estimate"
              value={`$${budgetInfo.forecastedEstimateBudget.toLocaleString()}`}
            />
          </div>
        </div>
      </div> */}

      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        itemName={name}
        itemType="Project"
        confirmText={name}
        apiEndpoint={`/api/generic-model/project/${id}`}
        redirectPath="/dashboard/all_projects"
      />
    </div>
  );
};

export default ProjectHeader;
