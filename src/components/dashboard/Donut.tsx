
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
            {item.value} ({percentage}%)
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

  return (
    <div className="h-full">
      <div className="text-sm font-medium text-gray-700 mb-3">{title}</div>
      
      <div className="flex flex-col items-center">
        <div style={{ height: `${height}px`, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={safeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
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
        
        {/* Separate legend below chart - solves text overlap */}
        <div className="w-full mt-2">
          <div className="flex flex-col items-start gap-2">
            {formattedData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: item.color }} 
                />
                <div className="font-medium truncate max-w-[120px]">{item.name}</div>
                <div className="text-gray-500">
                  {item.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
