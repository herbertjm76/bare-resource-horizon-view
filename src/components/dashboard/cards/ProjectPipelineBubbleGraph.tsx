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
  const chartData = bubbleData.map(bubble => ({
    name: bubble.label,
    value: bubble.count,
    color: bubble.color
  })).filter(item => item.value > 0);

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
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
            formatter={(value: number) => [`${value} projects`, '']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};