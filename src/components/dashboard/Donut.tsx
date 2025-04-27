
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DonutDataItem {
  name: string;
  value: number;
}

interface DonutProps {
  data: DonutDataItem[];
  title: string;
  colors?: string[];
  height?: number;
}

export const Donut: React.FC<DonutProps> = ({
  data,
  title,
  colors = ['#6F4BF6', '#9B87F5', '#D4CCFC', '#E9E5FD'],
  height = 250,
}) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <div style={{ height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#6F4BF6"
              paddingAngle={2}
              label={(entry) => entry.name}
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value}`, '']}
              contentStyle={{ 
                backgroundColor: 'white', 
                borderColor: '#F0F0F4',
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
              }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
