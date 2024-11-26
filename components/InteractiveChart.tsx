// components/InteractiveChart.tsx

'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Tooltip,
  TooltipProps
} from 'recharts';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ChartDataItem {
  name: string;
  estimatedStart: number;
  estimatedFinish: number;
  actualStart: number | null;
  actualFinish: number;
  status: string;
}

interface InteractiveChartProps {
  chartData: ChartDataItem[];
}

const InteractiveChart: React.FC<InteractiveChartProps> = ({ chartData }) => {
  const [selectedTask, setSelectedTask] = useState<ChartDataItem | null>(null);

  const minDate = Math.min(...chartData.map((d) => d.estimatedStart));
  const maxDate = Math.max(
    ...chartData.map((d) => Math.max(d.estimatedFinish, d.actualFinish))
  );

  const CustomBar = (props: any) => {
    const { x, y, width, height, value, status } = props;
    const color =
      status === 'delayed'
        ? '#EF4444'
        : status === 'at-risk'
        ? '#F59E0B'
        : '#10B981';
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill={color} />
        {status === 'delayed' && (
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            stroke="#991B1B"
            strokeWidth={2}
            fill="none"
          />
        )}
      </g>
    );
  };

  const formatTooltipValue = (value: number) => {
    return format(value, 'MMM d, yyyy');
  };

  const CustomTooltip = ({
    active,
    payload,
    label
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartDataItem;
      return (
        <div className="rounded border border-gray-300 bg-white p-2 shadow">
          <p className="font-bold">{data.name}</p>
          <p>Estimated Start: {formatTooltipValue(data.estimatedStart)}</p>
          <p>Estimated Finish: {formatTooltipValue(data.estimatedFinish)}</p>
          <p>
            Actual Start:{' '}
            {data.actualStart
              ? formatTooltipValue(data.actualStart)
              : 'Not started'}
          </p>
          <p>
            Actual/Projected Finish: {formatTooltipValue(data.actualFinish)}
          </p>
          <p>Status: {data.status}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            layout="vertical"
            onClick={(data) =>
              setSelectedTask(data.activePayload?.[0]?.payload as ChartDataItem)
            }
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[minDate, maxDate]}
              tickFormatter={(unixTime) => format(unixTime, 'MMM yyyy')}
            />
            <YAxis type="category" dataKey="name" width={150} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="estimatedStart"
              stackId="a"
              fill="#8884d8"
              name="Estimated Start"
            />
            <Bar
              dataKey="estimatedFinish"
              stackId="a"
              fill="#82ca9d"
              name="Estimated Duration"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#8884d8" />
              ))}
            </Bar>
            <Bar
              dataKey="actualStart"
              stackId="b"
              fill="#ffc658"
              name="Actual Start"
            />
            <Bar dataKey="actualFinish" stackId="b" name="Actual Duration">
              {chartData.map((entry, index) => (
                <CustomBar key={`cell-${index}`} status={entry.status} />
              ))}
            </Bar>
            <ReferenceLine
              x={new Date().getTime()}
              stroke="red"
              label="Today"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {selectedTask && (
        <Alert className="mt-4">
          <AlertTitle>Selected Task: {selectedTask.name}</AlertTitle>
          <AlertDescription>
            <p>
              <strong>Status:</strong> {selectedTask.status}
            </p>
            <p>
              <strong>Estimated Start:</strong>{' '}
              {formatTooltipValue(selectedTask.estimatedStart)}
            </p>
            <p>
              <strong>Estimated Finish:</strong>{' '}
              {formatTooltipValue(selectedTask.estimatedFinish)}
            </p>
            <p>
              <strong>Actual Start:</strong>{' '}
              {selectedTask.actualStart
                ? formatTooltipValue(selectedTask.actualStart)
                : 'Not started'}
            </p>
            <p>
              <strong>Actual/Projected Finish:</strong>{' '}
              {formatTooltipValue(selectedTask.actualFinish)}
            </p>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default InteractiveChart;
