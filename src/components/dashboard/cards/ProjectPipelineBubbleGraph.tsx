import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface BubbleData {
  label: string;
  count: number;
  color: string;
  textColor: string;
}

interface ProjectPipelineBubbleGraphProps {
  bubbleData: BubbleData[];
  totalProjects: number;
}

export const ProjectPipelineBubbleGraph: React.FC<ProjectPipelineBubbleGraphProps> = ({
  bubbleData,
  totalProjects
}) => {
  // Convert CSS variable colors to actual hex values for Recharts
  const getColorValue = (cssColor: string): string => {
    if (cssColor.includes('--muted')) return '#9ca3af'; // gray-400
    if (cssColor.includes('0.7')) return '#a78bfa'; // violet-400
    if (cssColor.includes('--brand-violet')) return '#8b5cf6'; // violet-500
    return cssColor;
  };

  const chartData = bubbleData.map(bubble => ({
    name: bubble.label,
    value: bubble.count,
    color: getColorValue(bubble.color)
  })).filter(item => item.value > 0);

  // Show placeholder if no data
  if (chartData.length === 0) {
    return (
      <div className="relative w-full h-48 flex items-center justify-center">
        <span className="text-muted-foreground text-sm">No projects to display</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
            label={({ value }) => value}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
            formatter={(value: number) => [`${value} projects`, '']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};