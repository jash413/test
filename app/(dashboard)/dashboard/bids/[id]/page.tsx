// file: app/bids/[id]/page.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// This would typically come from your database or API
async function getBidsData(projectId: string) {
  // Simulated API call
  return {
    projectSummary: {
      projectName: 'Project Alpha',
      totalBids: 10,
      averageBidAmount: 50000,
      lowestBid: 40000,
      highestBid: 60000
    },
    bids: [
      {
        id: '1',
        requestor: 'John Doe',
        amount: 45000,
        status: 'Pending',
        name: 'Electrical wiring'
      },
      {
        id: '2',
        requestor: 'Jane Smith',
        amount: 52000,
        status: 'Approved',
        name: 'Foundation work'
      },
      {
        id: '3',
        requestor: 'Bob Johnson',
        amount: 48000,
        status: 'Rejected',
        name: 'Design phase'
      }
      // ... more bids
    ]
  };
}

export default async function AllBidsPage({
  params
}: {
  params: { id: string };
}) {
  const { projectSummary, bids } = await getBidsData(params.id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bid Summary for {projectSummary.projectName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm font-medium">Total Bids</p>
              <p className="text-2xl font-bold">{projectSummary.totalBids}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Average Bid</p>
              <p className="text-2xl font-bold">
                ${projectSummary.averageBidAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Lowest Bid</p>
              <p className="text-2xl font-bold">
                ${projectSummary.lowestBid.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Highest Bid</p>
              <p className="text-2xl font-bold">
                ${projectSummary.highestBid.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Bids</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requestor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.map((bid) => (
                <TableRow key={bid.id}>
                  <TableCell>{bid.requestor}</TableCell>
                  <TableCell>${bid.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        bid.status === 'Approved'
                          ? 'default'
                          : bid.status === 'Rejected'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {bid.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <a
                      href={`/dashboard/bids/${params.id}/bid_details/${bid.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View Details
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
