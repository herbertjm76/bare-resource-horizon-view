
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
  data = [],
  title, 
  colors = ['hsl(var(--brand-violet))', 'hsl(var(--brand-violet) / 0.7)', 'hsl(var(--brand-violet) / 0.5)'],
  height = 250 
}) => {
  const safeData = data || [];
  const total = safeData.reduce((sum, item) => sum + (item?.value || 0), 0);

  // Don't render chart if no data
  if (safeData.length === 0 || total === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="text-sm font-semibold text-muted-foreground">{title}</div>
          <div className="text-muted-foreground text-xs">No data available</div>
        </div>
      </div>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = ((item.value / total) * 100).toFixed(1);
      
      return (
        <Card className="p-2 text-xs bg-white shadow-lg border border-border">
          <div className="font-medium text-foreground">{item.name}</div>
          <div className="text-muted-foreground mt-1">
            {item.value} ({percentage}%)
          </div>
        </Card>
      );
    }
    return null;
  };

  // Format data for legend
  const formattedData = safeData.map((item, index) => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(0),
    color: colors[index % colors.length]
  }));

  // Adjust sizes based on height
  const isCompact = height <= 180;
  const innerRadius = isCompact ? 40 : 55;
  const outerRadius = isCompact ? 60 : 75;

  return (
    <div className="flex flex-col gap-3 h-full w-full p-4">
      <h3 className="text-sm font-semibold text-foreground text-center">{title}</h3>
      
      {/* Chart */}
      <div className="relative flex items-center justify-center flex-1">
        <ResponsiveContainer width="100%" height="100%" minHeight={140}>
          <PieChart>
            <Pie
              data={safeData}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
            >
              {safeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Compact Legend */}
      <div className="grid grid-cols-1 gap-1.5">
        {formattedData.slice(0, 4).map((item, index) => (
          <div key={index} className="flex items-center justify-between text-xs px-2 py-1 rounded bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div 
                className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground truncate">{item.name}</span>
            </div>
            <span className="font-medium text-foreground ml-2 flex-shrink-0">
              {item.percentage}%
            </span>
          </div>
        ))}
        {formattedData.length > 4 && (
          <div className="text-xs text-muted-foreground text-center pt-1">
            +{formattedData.length - 4} more
          </div>
        )}
      </div>
    </div>
  );
};
