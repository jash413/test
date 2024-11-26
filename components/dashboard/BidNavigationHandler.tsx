// file: components/dashboard/BidNavigationHandler.tsx

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface BidNavigationHandlerProps {
  projectId: number;
  onBidIdChange: (bidId: string) => void;
}

export default function BidNavigationHandler({ projectId, onBidIdChange }: BidNavigationHandlerProps) {
  const pathname = usePathname();

  useEffect(() => {
    const bidIdMatch = pathname.match(/\/bid_details\/(\d+)/);
    if (bidIdMatch) {
      const newBidId = bidIdMatch[1];
      localStorage.setItem(`lastVisitedBidId_${projectId}`, newBidId);
      onBidIdChange(newBidId);
    } else {
      const lastVisitedBidId = localStorage.getItem(`lastVisitedBidId_${projectId}`) || '1';
      onBidIdChange(lastVisitedBidId);
    }
  }, [projectId, pathname, onBidIdChange]);

  return null;
}