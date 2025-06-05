
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';

interface DonutProps {
  data: {
    name: string;
    value: number;
  }[];
  title: string;
  colors: string[];
  height?: number;
}

export const Donut: React.FC<DonutProps> = ({ 
  data = [], // Add default empty array
  title, 
  colors = ['#6F4BF6', '#5669F7', '#E64FC4'],
  height = 250 
}) => {
  // Add null check and default to empty array
  const safeData = data || [];
  
  // Calculate total for percentages - handle empty data
  const total = safeData.reduce((sum, item) => sum + (item?.value || 0), 0);

  // Don't render chart if no data
  if (safeData.length === 0 || total === 0) {
    return (
      <div className="h-full">
        <div className="text-sm font-medium text-gray-700 mb-3">{title}</div>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500 text-sm">No data available</div>
        </div>
      </div>
    );
  }

  // Custom tooltip to show values and percentages
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = ((item.value / total) * 100).toFixed(1);
      
      return (
        <Card className="p-2 text-xs bg-white shadow-lg border">
          <div className="font-medium">{item.name}</div>
          <div className="text-gray-600 mt-1">
            {item.value} project{item.value !== 1 ? 's' : ''} ({percentage}%)
          </div>
        </Card>
      );
    }
    return null;
  };

  // Format data for the legend
  const formattedData = safeData.map((item, index) => {
    return {
      ...item,
      percentage: ((item.value / total) * 100).toFixed(1),
      color: colors[index % colors.length]
    };
  });

  // Adjust sizes based on height
  const isCompact = height <= 160;
  const innerRadius = isCompact ? 35 : 60;
  const outerRadius = isCompact ? 55 : 80;

  return (
    <div className="h-full flex flex-col">
      {title && <div className="text-sm font-medium text-gray-700 mb-2">{title}</div>}
      
      <div className="flex-1 flex flex-col">
        <div style={{ height: `${Math.min(height, 120)}px`, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={safeData}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={1}
                dataKey="value"
                stroke="#fff"
                strokeWidth={1}
              >
                {safeData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Compact legend with quantities */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-1 text-xs">
            {formattedData.slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-sm flex-shrink-0" 
                  style={{ backgroundColor: item.color }} 
                />
                <div className="truncate flex-1 min-w-0">
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-gray-500 flex-shrink-0">
                  {item.value} ({item.percentage}%)
                </div>
              </div>
            ))}
            {formattedData.length > 4 && (
              <div className="text-gray-500 text-center">
                +{formattedData.length - 4} more
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
