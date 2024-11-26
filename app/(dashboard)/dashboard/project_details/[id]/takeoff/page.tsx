// app/dashboard/project_details/[id]/takeoff/page.tsx

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

const TakeoffPage = () => {
  const materials = [
    {
      id: 1,
      name: 'Concrete',
      quantity: 100,
      unit: 'cubic yards',
      unitCost: 150,
      totalCost: 15000
    },
    {
      id: 2,
      name: 'Steel Rebar',
      quantity: 5000,
      unit: 'lbs',
      unitCost: 0.75,
      totalCost: 3750
    },
    {
      id: 3,
      name: 'Lumber 2x4',
      quantity: 1000,
      unit: 'board feet',
      unitCost: 0.65,
      totalCost: 650
    },
    {
      id: 4,
      name: 'Drywall',
      quantity: 200,
      unit: 'sheets',
      unitCost: 10,
      totalCost: 2000
    },
    {
      id: 5,
      name: 'Paint',
      quantity: 50,
      unit: 'gallons',
      unitCost: 30,
      totalCost: 1500
    }
  ];

  return (
    <div className="space-y-6 bg-gray-100 p-6">
      <h1 className="text-3xl font-bold">Project Takeoff</h1>

      <Card>
        <CardHeader>
          <CardTitle>Material Quantities and Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell>{material.name}</TableCell>
                  <TableCell>{material.quantity}</TableCell>
                  <TableCell>{material.unit}</TableCell>
                  <TableCell>${material.unitCost.toFixed(2)}</TableCell>
                  <TableCell>${material.totalCost.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Takeoff Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold">
                Total Materials: {materials.length}
              </p>
              <p className="text-lg font-semibold">
                Total Cost: $
                {materials
                  .reduce((sum, material) => sum + material.totalCost, 0)
                  .toFixed(2)}
              </p>
            </div>
            <Badge variant="outline" className="text-lg">
              Preliminary
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TakeoffPage;
