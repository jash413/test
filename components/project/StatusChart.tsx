// components/project/StatusChart.tsx

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Category {
  label: string;
  value: number;
  color: string;
}

interface TimeSummary {
  actualTimeSpent: number;
  forecastTotalTime: number;
  estimatedTimeRemaining: number;
  estimatedCompletionDate?: string;
}

interface CostSummary {
  actualCostSpent: number;
  forecastTotalCost: number;
  estimatedCostRemaining: number;
  estimatedCompletionCost: number;
}

interface StatusChartProps {
  total: number;
  categories: Category[];
  totalLabel: string;
  title: string;
  isDollar: boolean;
  timeSummary?: TimeSummary;
  costSummary?: CostSummary;
}

const StatusChart: React.FC<StatusChartProps> = ({
  total,
  categories,
  totalLabel,
  title,
  isDollar,
  timeSummary,
  costSummary
}) => {
  const size = 160;
  const radius = 60;
  const center = size / 2;

  const formatValue = (value: number) => {
    if (isDollar) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  const createArc = (startAngle: number, endAngle: number): string => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y
    ].join(' ');
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  let startAngle = 0;
  const arcs = categories.map((category) => {
    const angle = (category.value / total) * 360;
    const arc = createArc(startAngle, startAngle + angle);
    startAngle += angle;
    return { ...category, arc };
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex h-full flex-col">
          <div className="mb-4 text-lg font-semibold">{title}</div>
          <div className="flex items-center justify-between">
            <svg className="h-40 w-40" viewBox={`0 0 ${size} ${size}`}>
              {arcs.map((arc, index) => (
                <path
                  key={index}
                  d={arc.arc}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth="16"
                />
              ))}
              <text
                x={center}
                y={center}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="24"
                fontWeight="bold"
                fill="#333"
              >
                {formatValue(total)}
              </text>
              <text
                x={center}
                y={center + 22}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="14"
                fill="#666"
              >
                {totalLabel}
              </text>
            </svg>
            <div className="ml-6 flex-grow">
              {timeSummary && (
                <div className="mb-4">
                  <Progress
                    value={
                      (timeSummary.actualTimeSpent /
                        timeSummary.forecastTotalTime) *
                      100
                    }
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm">
                    <span>{timeSummary.actualTimeSpent} days</span>
                    <span>{timeSummary.forecastTotalTime} days</span>
                  </div>
                  <p className="mt-1 text-sm">
                    Estimated Completion Date:{' '}
                    {timeSummary.estimatedCompletionDate}
                  </p>
                </div>
              )}
              {costSummary && (
                <div>
                  <Progress
                    value={
                      (costSummary.actualCostSpent /
                        costSummary.forecastTotalCost) *
                      100
                    }
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm">
                    <span>${costSummary.actualCostSpent.toLocaleString()}</span>
                    <span>
                      ${costSummary.forecastTotalCost.toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">
                    Estimated total: $
                    {costSummary.estimatedCompletionCost.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-between text-xs">
            {categories.map((category, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="mb-1 h-3 w-3 rounded-sm"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span
                  className="font-semibold"
                  style={{ color: category.color }}
                >
                  {formatValue(category.value)}
                </span>
                <span className="text-gray-600">{category.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusChart;
