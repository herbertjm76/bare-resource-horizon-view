import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { WeeklyDemandData } from '@/hooks/useDemandProjection';
import { format } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';

interface DemandCapacityChartProps {
  weeklyDemand: WeeklyDemandData[];
  roleNames: Record<string, string>;
  weeklyCapacity: number;
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

export const DemandCapacityChart: React.FC<DemandCapacityChartProps> = ({
  weeklyDemand,
  roleNames,
  weeklyCapacity
}) => {
  // Check if there's any projected demand data
  const hasRealData = weeklyDemand.some(week => week.totalDemand > 0);

  // Generate demo data when no real data exists
  const demoWeeklyDemand: WeeklyDemandData[] = !hasRealData ? Array.from({ length: 12 }, (_, i) => {
    const weekDate = new Date();
    weekDate.setDate(weekDate.getDate() + (i * 7));
    
    // Create realistic demand patterns
    const seniorDemand = 15 + Math.sin(i * 0.5) * 8 + Math.random() * 5;
    const midDemand = 25 + Math.cos(i * 0.4) * 10 + Math.random() * 8;
    const juniorDemand = 20 + Math.sin(i * 0.3 + 1) * 6 + Math.random() * 6;
    const specialistDemand = 10 + Math.cos(i * 0.6) * 5 + Math.random() * 4;
    
    return {
      weekKey: format(weekDate, 'yyyy-MM-dd'),
      weekDate,
      totalDemand: seniorDemand + midDemand + juniorDemand + specialistDemand,
      demandByRole: {
        'senior-consultant': seniorDemand,
        'consultant': midDemand,
        'analyst': juniorDemand,
        'specialist': specialistDemand,
      },
      demandByProject: {},
    };
  }) : weeklyDemand;

  const demoRoleNames: Record<string, string> = !hasRealData ? {
    'senior-consultant': 'Senior Consultant',
    'consultant': 'Consultant',
    'analyst': 'Analyst',
    'specialist': 'Specialist',
  } : roleNames;

  const effectiveWeeklyDemand = hasRealData ? weeklyDemand : demoWeeklyDemand;
  const effectiveRoleNames = hasRealData ? roleNames : demoRoleNames;
  const effectiveCapacity = hasRealData ? weeklyCapacity : 80; // Demo capacity

  // Get all unique role IDs
  const allRoleIds = [...new Set(effectiveWeeklyDemand.flatMap(week => Object.keys(week.demandByRole)))];

  // Transform data for the chart
  const chartData = effectiveWeeklyDemand.map(week => {
    const dataPoint: Record<string, any> = {
      week: format(week.weekDate, 'MMM d'),
      weekKey: week.weekKey,
      total: Math.round(week.totalDemand),
      capacity: effectiveCapacity,
    };

    allRoleIds.forEach(roleId => {
      dataPoint[roleId] = Math.round(week.demandByRole[roleId] || 0);
    });

    return dataPoint;
  });

  // Calculate over/under capacity
  const overCapacityWeeks = effectiveWeeklyDemand.filter(w => w.totalDemand > effectiveCapacity).length;
  const utilizationPct = effectiveCapacity > 0 
    ? Math.round((effectiveWeeklyDemand.reduce((sum, w) => sum + w.totalDemand, 0) / (effectiveCapacity * effectiveWeeklyDemand.length)) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Demo data indicator */}
      {!hasRealData && (
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            <span className="font-medium">Demo Data Preview</span> – This chart shows sample data. Add team compositions to your projects to see real demand projections.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Badges */}
      <div className="flex flex-wrap gap-3 text-sm">
        <div className="px-3 py-1.5 rounded-full bg-muted">
          <span className="text-muted-foreground">Avg Utilization: </span>
          <span className={utilizationPct > 100 ? 'text-destructive font-medium' : 'font-medium'}>
            {utilizationPct}%
          </span>
        </div>
        {overCapacityWeeks > 0 && (
          <div className="px-3 py-1.5 rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-3.5 w-3.5 inline mr-1" />
            {overCapacityWeeks} weeks over capacity
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              {allRoleIds.map((roleId, index) => (
                <linearGradient key={roleId} id={`gradient-rp-${roleId}`} x1="0" y1="0" x2="0" y2="1">
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
              formatter={(value: number, name: string) => {
                if (name === 'capacity') return [`${value} hours`, 'Team Capacity'];
                return [`${value} hours`, effectiveRoleNames[name] || name];
              }}
            />
            <Legend 
              formatter={(value) => {
                if (value === 'capacity') return 'Team Capacity';
                return effectiveRoleNames[value] || value;
              }}
              wrapperStyle={{ fontSize: '12px' }}
            />
            
            {/* Capacity line */}
            <ReferenceLine 
              y={effectiveCapacity} 
              stroke="hsl(var(--destructive))" 
              strokeDasharray="5 5"
              strokeWidth={2}
            />
            
            {/* Stacked areas for each role */}
            {allRoleIds.map((roleId, index) => (
              <Area
                key={roleId}
                type="monotone"
                dataKey={roleId}
                stackId="1"
                stroke={ROLE_COLORS[index % ROLE_COLORS.length]}
                fill={`url(#gradient-rp-${roleId})`}
                name={roleId}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Role Legend with totals */}
      <div className="flex flex-wrap gap-4 pt-2 border-t">
        {allRoleIds.map((roleId, index) => {
          const totalHours = effectiveWeeklyDemand.reduce((sum, week) => sum + (week.demandByRole[roleId] || 0), 0);
          return (
            <div key={roleId} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: ROLE_COLORS[index % ROLE_COLORS.length] }}
              />
              <span className="text-muted-foreground">{effectiveRoleNames[roleId] || roleId}:</span>
              <span className="font-medium">{Math.round(totalHours)}h</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
