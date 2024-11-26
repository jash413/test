//file : components/table/ReusableTable.tsx

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface ColumnDefinition {
  header: string;
  accessor: string;
}

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  timeFilter: FilterOption[];
  statusFilter: FilterOption[];
}

interface ReusableTableProps {
  columns: ColumnDefinition[];
  data: Record<string, React.ReactNode>[];
  initialPageSize?: number;
  filterConfig: FilterConfig;
}

const ReusableTable: React.FC<ReusableTableProps> = ({
  columns,
  data,
  initialPageSize = 10,
  filterConfig
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [statusFilter, setStatusFilter] = useState('All Orders');

  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply time filter
    if (timeFilter !== 'All Time') {
      result = result.filter((item) => {
        const date = new Date(item.date as string);
        const now = new Date();
        if (timeFilter === 'This Month') {
          return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
          );
        } else if (timeFilter === 'Last Month') {
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          return (
            date.getMonth() === lastMonth.getMonth() &&
            date.getFullYear() === lastMonth.getFullYear()
          );
        }
        return true;
      });
    }

    // Apply status filter
    if (statusFilter !== 'All Orders') {
      result = result.filter(
        (item) =>
          (item.status as string).toLowerCase() === statusFilter.toLowerCase()
      );
    }

    return result;
  }, [data, timeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    return filteredData.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredData, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [timeFilter, statusFilter, pageSize]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newPageSize = Number(event.target.value);
      setPageSize(newPageSize);
    },
    []
  );

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-end space-x-2">
        <select
          className="rounded border p-1 text-sm"
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
        >
          {filterConfig.timeFilter.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          className="rounded border p-1 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {filterConfig.statusFilter.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, cellIndex) => (
                  <TableCell key={cellIndex}>{item[column.accessor]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages} | Rows per page:
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="ml-2 rounded border"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ReusableTable;
