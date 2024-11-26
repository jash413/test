// file: components/layout/HeaderDropdown.tsx

'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface HeaderDropdownProps {
  userName: string;
  imageUrl: string | null;
}

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  userName,
  imageUrl
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 text-[hsl(var(--foreground))] focus:outline-none">
          <div className="relative h-6 w-6 flex-shrink-0 overflow-hidden rounded-full">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={userName || 'User'}
                fill
                sizes="24px"
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[hsl(var(--primary))] text-xs text-[hsl(var(--primary-foreground))]">
                {userName?.[0] || 'U'}
              </div>
            )}
          </div>
          <span className="text-sm font-medium">{userName || 'User'}</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))]"
      >
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[hsl(var(--border))]" />
        <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderDropdown;
