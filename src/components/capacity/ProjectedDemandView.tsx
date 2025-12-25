import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { WeeklyDemandData } from '@/hooks/useDemandProjection';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProjectedDemandViewProps {
  weeklyDemand: WeeklyDemandData[];
  roleNames: Record<string, string>;
  weekStartDates: Array<{ date: Date; key: string }>;
  isLoading: boolean;
}

// Color palette for roles
const ROLE_COLORS = [
  'hsl(var(--theme-primary))',
  'hsl(217, 91%, 60%)',
  'hsl(142, 76%, 36%)',
  'hsl(38, 92%, 50%)',
  'hsl(280, 87%, 65%)',
  'hsl(0, 84%, 60%)',
  'hsl(180, 70%, 45%)',
  'hsl(330, 80%, 60%)',
];

export const ProjectedDemandView: React.FC<ProjectedDemandViewProps> = ({
  weeklyDemand,
  roleNames,
  weekStartDates,
  isLoading
}) => {
  if (isLoading) {
    return <Skeleton className="h-80 w-full" />;
  }

  // Check if there's any projected demand data
  const hasData = weeklyDemand.some(week => week.totalDemand > 0);

  if (!hasData) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No projected demand data available. Add team compositions to your project stages to see projected resource demand.
        </AlertDescription>
      </Alert>
    );
  }

  // Get all unique role IDs
  const allRoleIds = [...new Set(weeklyDemand.flatMap(week => Object.keys(week.demandByRole)))];

  // Transform data for the chart
  const chartData = weeklyDemand.map(week => {
    const dataPoint: Record<string, any> = {
      week: format(week.weekDate, 'MMM d'),
      weekKey: week.weekKey,
      total: Math.round(week.totalDemand),
    };

    allRoleIds.forEach(roleId => {
      dataPoint[roleId] = Math.round(week.demandByRole[roleId] || 0);
    });

    return dataPoint;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Projected Resource Demand by Role
        </h3>
        <div className="text-sm text-muted-foreground">
          Total: {Math.round(weeklyDemand.reduce((sum, w) => sum + w.totalDemand, 0))} hours
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              {allRoleIds.map((roleId, index) => (
                <linearGradient key={roleId} id={`gradient-${roleId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={ROLE_COLORS[index % ROLE_COLORS.length]} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={ROLE_COLORS[index % ROLE_COLORS.length]} stopOpacity={0.1}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
            />
            <YAxis 
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
              label={{ value: 'Hours', angle: -90, position: 'insideLeft', fontSize: 11 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string) => [
                `${value} hours`,
                roleNames[name] || name
              ]}
            />
            <Legend 
              formatter={(value) => roleNames[value] || value}
              wrapperStyle={{ fontSize: '12px' }}
            />
            {allRoleIds.map((roleId, index) => (
              <Area
                key={roleId}
                type="monotone"
                dataKey={roleId}
                stackId="1"
                stroke={ROLE_COLORS[index % ROLE_COLORS.length]}
                fill={`url(#gradient-${roleId})`}
                name={roleId}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Role Legend with totals */}
      <div className="flex flex-wrap gap-4 pt-2 border-t">
        {allRoleIds.map((roleId, index) => {
          const totalHours = weeklyDemand.reduce((sum, week) => sum + (week.demandByRole[roleId] || 0), 0);
          return (
            <div key={roleId} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: ROLE_COLORS[index % ROLE_COLORS.length] }}
              />
              <span className="text-muted-foreground">{roleNames[roleId] || roleId}:</span>
              <span className="font-medium">{Math.round(totalHours)}h</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
