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

const PurchaseOrders = () => {
  const [purchaseOrdersData, setPurchaseOrdersData] = React.useState([]);

  const params = useParams();

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    purchaseOrder: any;
  }>({
    isOpen: false,
    purchaseOrder: null
  });

  const closeDeletePurchase = () => {
    setDeleteConfirmation({ isOpen: false, purchaseOrder: null });
  };

  const { fetchWithLoading } = useLoadingAPI();

  const fetchPurchaseOrders = async () => {
    try {
      let res = await fetchWithLoading('/api/generic-model/purchaseOrder');

      if (res) {
        setPurchaseOrdersData(res?.models);
      } else {
        setPurchaseOrdersData([]);
      }
    } catch (error) {
      console.error('Error fetching change orders:', error);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Purchase Orders</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Purchase Order
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Purchase Order List</CardTitle>
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
                  <div className="min-w-max">CREATOR ID</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">ORDER DATE</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">DELIVERY DATE</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">USER ID</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max ">DESCRIPTION</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">AMOUNT</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">NOTES</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">BUSINESS ID</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">STATUS</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">PO NUMBER</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">ADDRESS</div>
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
              {/* {purchaseOrders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.description}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>${order.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))} */}
              {purchaseOrdersData?.length > 0 ? (
                purchaseOrdersData.map((order: any) => (
                  // <TableRow key={order.id}>
                  //   <TableCell>{order.id}</TableCell>
                  //   <TableCell>{order.creator_id}</TableCell>
                  //   <TableCell>{order.Order_date}</TableCell>
                  //   <TableCell>{order.Delivery_date}</TableCell>
                  //   <TableCell>{order.user_id}</TableCell>
                  //   <TableCell>{order.description}</TableCell>
                  //   <TableCell>{order.amount}</TableCell>
                  //   <TableCell>{order.notes?.join(", ")}</TableCell>
                  //   <TableCell>{order.business_id}</TableCell>
                  //   <TableCell>{order.status}</TableCell>
                  //   <TableCell>{order.po_number}</TableCell>
                  //   <TableCell>{order.address}</TableCell>
                  //   <TableCell>{order.file_info?.length} file</TableCell>
                  // </TableRow>
                  // add div in table cell
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="min-w-max">{order.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.creator_id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.Order_date}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.Delivery_date}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.user_id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-[300px] max-w-[400px] ">
                        {order.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.amount}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.notes?.join(', ')}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.business_id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.status}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.po_number}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.address}</div>
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
                              purchaseOrder: order
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
                  <TableCell colSpan={12} className="text-center">
                    No Data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <DeleteConfirmation
        isOpen={deleteConfirmation.isOpen}
        onClose={closeDeletePurchase}
        itemName={deleteConfirmation.purchaseOrder?.id || ''}
        itemType="purchase order"
        confirmText={deleteConfirmation.purchaseOrder?.id?.toString() || ''}
        apiEndpoint={`/api/generic-model/purchaseOrder/${deleteConfirmation.purchaseOrder?.id}`}
        redirectPath={`/dashboard/project_details/${params.folderId}/purchase_orders`}
      />
    </div>
  );
};

export default PurchaseOrders;
