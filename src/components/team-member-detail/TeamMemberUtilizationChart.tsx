
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
        <h2 className="text-lg sm:text-xl font-semibold text-brand-primary flex items-center gap-2">
          <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Utilization Analytics</span>
          <span className="sm:hidden">Analytics</span>
        </h2>
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
    <div className="space-y-4 w-full">
      <h2 className="text-lg sm:text-xl font-semibold text-brand-primary flex items-center gap-2">
        <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline">Utilization Analytics</span>
        <span className="sm:hidden">Analytics</span>
      </h2>

      <Card className="bg-gradient-to-br from-gray-50 to-white border-2 w-full">
        <CardContent className="p-3 sm:p-6">
          {/* Responsive Chart Container */}
          <div className="mb-4 sm:mb-6 w-full">
            <ChartContainer config={chartConfig} className="h-32 sm:h-40 lg:h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={chartData}
                  margin={{ 
                    top: 5, 
                    right: 5, 
                    left: 5, 
                    bottom: 5 
                  }}
                >
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
                    tick={{ fontSize: 10 }}
                    interval={0}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    className="text-xs fill-gray-600"
                    tick={{ fontSize: 10 }}
                    width={30}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      fontSize: '12px',
                      padding: '8px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="utilization"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#utilizationGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          
          {/* Responsive Stats Cards */}
          <div className="grid grid-cols-1 gap-3">
            {/* Main Current Week Card */}
            <div className={`p-3 sm:p-4 rounded-xl bg-gradient-to-r ${getUtilizationGradient(utilization.days7)} text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-bold">{utilization.days7}%</div>
                  <p className="text-xs sm:text-sm opacity-90">Current Week</p>
                </div>
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 opacity-80" />
              </div>
            </div>
            
            {/* Responsive Sub-stats */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 rounded-lg bg-gray-50 border">
                <div className="text-sm sm:text-lg font-semibold text-gray-800">{utilization.days30}%</div>
                <p className="text-xs text-gray-600">30-Day Avg</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-gray-50 border">
                <div className="text-sm sm:text-lg font-semibold text-gray-800">{utilization.days90}%</div>
                <p className="text-xs text-gray-600">90-Day Avg</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
