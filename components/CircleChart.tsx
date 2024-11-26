import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Category {
  label: string;
  value: number;
  color: string;
}

interface CircleChartProps {
  total: number;
  categories: Category[];
  totalLabel: string;
  title: string;
  isDollar: boolean;
}

const CircleChart: React.FC<CircleChartProps> = ({ total, categories, totalLabel, title, isDollar }) => {
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
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  let startAngle = 0;
  const arcs = categories.map(category => {
    const angle = (category.value / total) * 360;
    const arc = createArc(startAngle, startAngle + angle);
    startAngle += angle;
    return { ...category, arc };
  });

  return (
    <Card className="h-[300px]">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="text-lg font-semibold mb-4">{title}</div>
          <div className="flex-grow flex justify-center items-center">
            <svg className="w-40 h-40" viewBox={`0 0 ${size} ${size}`}>
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
          </div>
          <div className="mt-4 flex justify-between text-xs">
            {categories.map((category, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-sm mb-1" style={{ backgroundColor: category.color }}></div>
                <span className="font-semibold" style={{ color: category.color }}>{formatValue(category.value)}</span>
                <span className="text-gray-600">{category.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CircleChart;