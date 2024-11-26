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
  const [taskData, setTaskData] = useState([]);

  const params = useParams();

  const { fetchWithLoading } = useLoadingAPI();

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    task: any;
  }>({
    isOpen: false,
    task: null
  });

  const closeDeleteTask = () => {
    setDeleteConfirmation({ isOpen: false, task: null });
  };

  const fetchTasks = async () => {
    try {
      let res = await fetchWithLoading('/api/generic-model/task');

      if (res) {
        setTaskData(res?.models);
      } else {
        setTaskData([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Tasks</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="min-w-max">ID</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">CREATOR ID</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">TASK CODE</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">TASK NAME</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max ">DESCRIPTION</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">START DATE</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">END DATE</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">TASK OWNER ID</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">BUSINESS ID</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">ORDER BY</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">STATUS</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">NOTES</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">DAY ESTIMATED</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">BUDGET ESTIMATED</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">ACTUAL DAY</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">ACTUAL SPENT</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">PERCENTAGE COMPLETE</div>
                </TableHead>
                <TableHead>
                  <div className="min-w-max">PERCENTAGE SPENT</div>
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
              {taskData.length > 0 ? (
                taskData.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="min-w-max">{order.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.creator_id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.task_code}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.task_name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.description}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.start_date}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.end_date}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.task_owner_id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.business_id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.order_by}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.status}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.notes?.join(', ')}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.days_estimated}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.budget_estimated}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.actual_day}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.actual_spent}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">
                        {order.percentage_complete}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-max">{order.percentage_spent}</div>
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
                            setDeleteConfirmation({ isOpen: true, task: order })
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
                  <TableCell colSpan={21}>
                    <div className="w-full min-w-max text-center">No Data</div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <DeleteConfirmation
        isOpen={deleteConfirmation.isOpen}
        onClose={closeDeleteTask}
        itemName={deleteConfirmation.task?.id || ''}
        itemType="task"
        confirmText={deleteConfirmation.task?.id?.toString() || ''}
        apiEndpoint={`/api/generic-model/task/${deleteConfirmation.task?.id}`}
        redirectPath={`/dashboard/project_details/${params.folderId}/tasks`}
      />
    </div>
  );
};

export default PurchaseOrders;
