// file: app/bids/[id]/bid_details/[bidId]/page.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// This would typically come from your database or API
async function getBidDetails(projectId: string, bidId: string) {
  // Simulated API call
  return {
    requestor: 'John Doe',
    requestorBusinessId: 'BUS123',
    budget: 50000,
    bidAmount: 48000,
    inscope: 'Foundation work, Framing, Roofing',
    outscope: 'Landscaping, Interior finishes',
    paymentTerms: '50% upfront, 25% at midpoint, 25% upon completion',
    notes: 'Can start immediately upon approval',
    builderNotes: 'Good track record with previous projects',
    subcontractor: 'ABC Construction Ltd.',
    status: 'Pending',
    files: [
      { name: 'proposal.pdf', url: '/files/proposal.pdf' },
      { name: 'budget_breakdown.xlsx', url: '/files/budget_breakdown.xlsx' }
    ]
  };
}

export default async function BidDetailsPage({
  params
}: {
  params: { id: string; bidId: string };
}) {
  const bidDetails = await getBidDetails(params.id, params.bidId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bid Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Requestor</p>
              <p>{bidDetails.requestor}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Business ID</p>
              <p>{bidDetails.requestorBusinessId}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Budget</p>
              <p>${bidDetails.budget.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Bid Amount</p>
              <p>${bidDetails.bidAmount.toLocaleString()}</p>
            </div>
            <Badge
              variant={
                bidDetails.status === 'Approved'
                  ? 'default'
                  : bidDetails.status === 'Rejected'
                  ? 'destructive'
                  : 'secondary'
              }
            >
              {bidDetails.status}
            </Badge>
            <div>
              <p className="text-sm font-medium">Subcontractor</p>
              <p>{bidDetails.subcontractor}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium">In Scope</p>
            <p>{bidDetails.inscope}</p>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium">Out of Scope</p>
            <p>{bidDetails.outscope}</p>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium">Payment Terms</p>
            <p>{bidDetails.paymentTerms}</p>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium">Notes</p>
            <p>{bidDetails.notes}</p>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium">Builder Notes</p>
            <p>{bidDetails.builderNotes}</p>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium">Attached Files</p>
            <ul className="mt-2 list-disc pl-5">
              {bidDetails.files.map((file, index) => (
                <li key={index}>
                  <a
                    href={file.url}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
