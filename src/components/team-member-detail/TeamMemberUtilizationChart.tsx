
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Line, LineChart, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useIndividualMemberUtilization } from '@/hooks/useIndividualMemberUtilization';

interface TeamMemberUtilizationChartProps {
  memberId: string;
  weeklyCapacity?: number;
}

export const TeamMemberUtilizationChart: React.FC<TeamMemberUtilizationChartProps> = ({ 
  memberId, 
  weeklyCapacity = 40 
}) => {
  const { utilization, isLoading } = useIndividualMemberUtilization(memberId, weeklyCapacity);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Utilization Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 animate-pulse bg-gray-100 rounded-lg"></div>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    { period: '7 Days', utilization: utilization.days7, target: 80 },
    { period: '30 Days', utilization: utilization.days30, target: 80 },
    { period: '90 Days', utilization: utilization.days90, target: 80 },
  ];

  const getUtilizationColor = (value: number) => {
    if (value >= 90) return '#ef4444'; // red
    if (value >= 75) return '#f97316'; // orange
    if (value >= 50) return '#22c55e'; // green
    return '#3b82f6'; // blue
  };

  const getTrendIcon = () => {
    const trend = utilization.days7 - utilization.days90;
    if (trend > 5) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < -5) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const chartConfig = {
    utilization: {
      label: "Utilization %",
      color: "hsl(var(--chart-1))",
    },
    target: {
      label: "Target",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Utilization Analytics</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {getTrendIcon()}
          <span>
            {utilization.days7 > utilization.days90 ? 'Trending Up' : 
             utilization.days7 < utilization.days90 ? 'Trending Down' : 'Stable'}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Utilization Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="period" 
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="utilization" 
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getUtilizationColor(entry.utilization)} />
                ))}
              </Bar>
              <Line
                dataKey="target"
                stroke="#64748b"
                strokeDasharray="5,5"
                dot={false}
              />
            </BarChart>
          </ChartContainer>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
            <div className="text-center">
              <div className={`text-2xl font-bold ${utilization.days7 >= 90 ? 'text-red-600' : utilization.days7 >= 75 ? 'text-orange-600' : utilization.days7 >= 50 ? 'text-green-600' : 'text-blue-600'}`}>
                {utilization.days7}%
              </div>
              <p className="text-sm text-gray-600">Current Week</p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${utilization.days30 >= 90 ? 'text-red-600' : utilization.days30 >= 75 ? 'text-orange-600' : utilization.days30 >= 50 ? 'text-green-600' : 'text-blue-600'}`}>
                {utilization.days30}%
              </div>
              <p className="text-sm text-gray-600">Monthly Average</p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${utilization.days90 >= 90 ? 'text-red-600' : utilization.days90 >= 75 ? 'text-orange-600' : utilization.days90 >= 50 ? 'text-green-600' : 'text-blue-600'}`}>
                {utilization.days90}%
              </div>
              <p className="text-sm text-gray-600">Quarterly Trend</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
