
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
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
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Utilization Analytics</h2>
        <Card>
          <CardContent className="p-6">
            <div className="h-64 animate-pulse bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg"></div>
          </CardContent>
        </Card>
      </div>
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

  const getUtilizationGradient = (value: number) => {
    if (value >= 90) return 'from-red-400 to-red-600';
    if (value >= 75) return 'from-orange-400 to-orange-600';
    if (value >= 50) return 'from-green-400 to-green-600';
    return 'from-blue-400 to-blue-600';
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
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Activity className="h-5 w-5 text-brand-violet" />
          Utilization Analytics
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {getTrendIcon()}
          <span>
            {utilization.days7 > utilization.days90 ? 'Trending Up' : 
             utilization.days7 < utilization.days90 ? 'Trending Down' : 'Stable'}
          </span>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-gray-50 to-white border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-brand-primary">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Modern Chart with Gradients */}
          <div className="mb-6">
            <ChartContainer config={chartConfig} className="h-48">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="utilizationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="period" 
                  tickLine={false}
                  axisLine={false}
                  className="text-xs fill-gray-600"
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  className="text-xs fill-gray-600"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="utilization"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#utilizationGradient)"
                />
              </AreaChart>
            </ChartContainer>
          </div>
          
          {/* Modern Stats Cards */}
          <div className="grid grid-cols-1 gap-3">
            <div className={`p-4 rounded-xl bg-gradient-to-r ${getUtilizationGradient(utilization.days7)} text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{utilization.days7}%</div>
                  <p className="text-sm opacity-90">Current Week</p>
                </div>
                <TrendingUp className="h-6 w-6 opacity-80" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-gray-50 border">
                <div className="text-lg font-semibold text-gray-800">{utilization.days30}%</div>
                <p className="text-xs text-gray-600">30-Day Avg</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border">
                <div className="text-lg font-semibold text-gray-800">{utilization.days90}%</div>
                <p className="text-xs text-gray-600">90-Day Avg</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
