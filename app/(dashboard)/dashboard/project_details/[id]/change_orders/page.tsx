// app/(dashboard)/dashboard/project_details/[id]/change_orders/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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

const ChangeOrders = () => {
  const params = useParams();

  const [changeOrdersData, setChangeOrdersData] = React.useState([]);

  const { fetchWithLoading } = useLoadingAPI();

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    changeOrder: any;
  }>({
    isOpen: false,
    changeOrder: null
  });

  const closeDeleteChangeOrder = () => {
    setDeleteConfirmation({ isOpen: false, changeOrder: null });
  };

  const fetchChangeOrders = async () => {
    try {
      let res = await fetchWithLoading('/api/generic-model/changeOrder');

      if (res.ok) {
        setChangeOrdersData(res.model);
      } else {
        setChangeOrdersData([]);
      }
    } catch (error) {
      console.error('Error fetching change orders:', error);
    }
  };

  useEffect(() => {
    fetchChangeOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Change Orders</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Change Order
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Change Order List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead className="min-w-max">CREATOR ID</TableHead>
                <TableHead className="min-w-max">ID</TableHead>
                <TableHead className="min-w-max">ORDER DATE</TableHead>
                <TableHead className="min-w-max">DELIVERY DATE</TableHead>
                <TableHead className="min-w-max">DELIVERY DATE</TableHead>
                <TableHead className="min-w-max">USER ID</TableHead>
                <TableHead className="min-w-max">DESCRIPTION</TableHead>
                <TableHead className="min-w-max">AMOUNT</TableHead>
                <TableHead className="min-w-max">NOTES</TableHead>
                <TableHead className="min-w-max">BUSINESS ID</TableHead>
                <TableHead className="min-w-max">STATUS</TableHead>
                <TableHead className="min-w-max">PO NUMBER</TableHead>
                <TableHead className="min-w-max">ADDRESS</TableHead>
                <TableHead className="min-w-max">FILE</TableHead> */}
                <TableHead>
                  <div className="min-w-max">ID</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">ACTION TASK ID</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max ">ACTIVE</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max ">DESCRIPTION</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">AMOUNT</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">STATUS</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">NOTES</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">INCREASE BUDGET</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">PAYMENT TERMS</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">REVIEWED BY</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">APPROVED BY</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">FILE</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">ACTION</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {changeOrdersData?.length > 0 ? (
                changeOrdersData?.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="min-w-max">{order.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.action_task_id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.active}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.description}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.amount}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.status}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.notes?.join(', ')}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.increase_budget}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.payment_terms}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.reviewed_by}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.approved_by}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">
                        {order.file_info?.length} file
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button
                          className=" rounded-md bg-rose-200 px-2 py-1 text-red-800"
                          onClick={() =>
                            setDeleteConfirmation({
                              isOpen: true,
                              changeOrder: order
                            })
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} className=" text-center">
                    No Change Orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <DeleteConfirmation
        isOpen={deleteConfirmation.isOpen}
        onClose={closeDeleteChangeOrder}
        itemName={deleteConfirmation.changeOrder?.id || ''}
        itemType="change order"
        confirmText={deleteConfirmation.changeOrder?.id?.toString() || ''}
        apiEndpoint={`/api/generic-model/purchaseOrder/${deleteConfirmation.changeOrder?.id}`}
        redirectPath={`/dashboard/project_details/${params.folderId}/change_orders`}
      />
    </div>
  );
};

export default ChangeOrders;
