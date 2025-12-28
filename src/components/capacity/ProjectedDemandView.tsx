import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { WeeklyDemandData } from '@/hooks/useDemandProjection';
import { format, addWeeks, startOfWeek } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

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

// Demo data generator
const generateDemoData = (numberOfWeeks: number = 12): { 
  weeklyDemand: WeeklyDemandData[]; 
  roleNames: Record<string, string>;
} => {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const demoRoles = {
    'role-1': 'Senior Architect',
    'role-2': 'Project Manager',
    'role-3': 'Designer',
    'role-4': 'Engineer',
    'role-5': 'Analyst',
  };

  const weeklyDemand: WeeklyDemandData[] = [];
  
  for (let i = 0; i < numberOfWeeks; i++) {
    const weekDate = addWeeks(startDate, i);
    const baseMultiplier = 1 + Math.sin(i * 0.5) * 0.3; // Creates wave pattern
    
    weeklyDemand.push({
      weekKey: format(weekDate, 'yyyy-MM-dd'),
      weekDate,
      demandByRole: {
        'role-1': Math.round(40 * baseMultiplier + Math.random() * 10),
        'role-2': Math.round(30 * baseMultiplier + Math.random() * 8),
        'role-3': Math.round(50 * baseMultiplier + Math.random() * 12),
        'role-4': Math.round(80 * baseMultiplier + Math.random() * 15),
        'role-5': Math.round(25 * baseMultiplier + Math.random() * 6),
      },
      demandByProject: {},
      totalDemand: 0,
    });
    
    // Calculate total
    weeklyDemand[i].totalDemand = Object.values(weeklyDemand[i].demandByRole).reduce((a, b) => a + b, 0);
  }

  return { weeklyDemand, roleNames: demoRoles };
};

export const ProjectedDemandView: React.FC<ProjectedDemandViewProps> = ({
  weeklyDemand: propWeeklyDemand,
  roleNames: propRoleNames,
  weekStartDates,
  isLoading
}) => {
  // Check if we have real data
  const hasRealData = propWeeklyDemand.some(week => week.totalDemand > 0);
  
  // Generate or use demo data
  const { weeklyDemand, roleNames, isDemo } = useMemo(() => {
    if (hasRealData) {
      return { weeklyDemand: propWeeklyDemand, roleNames: propRoleNames, isDemo: false };
    }
    const demo = generateDemoData(weekStartDates.length || 12);
    return { ...demo, isDemo: true };
  }, [hasRealData, propWeeklyDemand, propRoleNames, weekStartDates.length]);

  if (isLoading) {
    return <Skeleton className="h-80 w-full" />;
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
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Projected Resource Demand by Role
          </h3>
          {isDemo && (
            <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-300">
              Demo Data
            </Badge>
          )}
        </div>
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
      
      {isDemo && (
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Add team compositions to your project stages to see real projected demand data.
        </div>
      )}
    </div>
  );
};
