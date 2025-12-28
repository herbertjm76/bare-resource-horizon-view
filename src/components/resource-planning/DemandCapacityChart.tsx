import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { WeeklyDemandData, ProjectDemand } from '@/hooks/useDemandProjection';
import { format } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';

interface DemandCapacityChartProps {
  weeklyDemand: WeeklyDemandData[];
  roleNames: Record<string, string>;
  weeklyCapacity: number;
  projectDemands?: ProjectDemand[];
}

// Color palette for projects
const PROJECT_COLORS = [
  'hsl(var(--theme-primary))',
  'hsl(217, 91%, 60%)',
  'hsl(142, 76%, 36%)',
  'hsl(38, 92%, 50%)',
  'hsl(280, 87%, 65%)',
  'hsl(0, 84%, 60%)',
  'hsl(180, 70%, 45%)',
  'hsl(330, 80%, 60%)',
  'hsl(200, 80%, 50%)',
  'hsl(45, 90%, 55%)',
  'hsl(160, 70%, 40%)',
  'hsl(300, 70%, 55%)',
];

export const DemandCapacityChart: React.FC<DemandCapacityChartProps> = ({
  weeklyDemand,
  roleNames,
  weeklyCapacity,
  projectDemands = []
}) => {
  // Check if there's any projected demand data
  const hasRealData = weeklyDemand.some(week => week.totalDemand > 0);

  // Build project names map from projectDemands
  const projectNames = useMemo(() => {
    const names: Record<string, string> = {};
    projectDemands.forEach(pd => {
      if (!names[pd.projectId]) {
        names[pd.projectId] = pd.projectCode || pd.projectName;
      }
    });
    return names;
  }, [projectDemands]);

  // Generate demo data when no real data exists - now by PROJECT
  const demoWeeklyDemand: WeeklyDemandData[] = useMemo(() => {
    if (hasRealData) return weeklyDemand;
    
    return Array.from({ length: 12 }, (_, i) => {
      const weekDate = new Date();
      weekDate.setDate(weekDate.getDate() + (i * 7));
      
      // Create realistic demand patterns by project
      const projectA = 20 + Math.sin(i * 0.5) * 8 + Math.random() * 5;
      const projectB = 15 + Math.cos(i * 0.4) * 6 + Math.random() * 4;
      const projectC = 25 + Math.sin(i * 0.3 + 1) * 10 + Math.random() * 6;
      const projectD = 10 + Math.cos(i * 0.6) * 4 + Math.random() * 3;
      
      return {
        weekKey: format(weekDate, 'yyyy-MM-dd'),
        weekDate,
        totalDemand: projectA + projectB + projectC + projectD,
        demandByRole: {},
        demandByProject: {
          'demo-project-a': projectA,
          'demo-project-b': projectB,
          'demo-project-c': projectC,
          'demo-project-d': projectD,
        },
      };
    });
  }, [hasRealData, weeklyDemand]);

  const demoProjectNames: Record<string, string> = !hasRealData ? {
    'demo-project-a': 'Office Tower A',
    'demo-project-b': 'Retail Center',
    'demo-project-c': 'Hospital Wing',
    'demo-project-d': 'School Campus',
  } : projectNames;

  const effectiveWeeklyDemand = hasRealData ? weeklyDemand : demoWeeklyDemand;
  const effectiveProjectNames = hasRealData ? projectNames : demoProjectNames;
  const effectiveCapacity = hasRealData ? weeklyCapacity : 80;

  // Get all unique project IDs
  const allProjectIds = [...new Set(effectiveWeeklyDemand.flatMap(week => Object.keys(week.demandByProject)))];

  // Transform data for the chart
  const chartData = effectiveWeeklyDemand.map(week => {
    const dataPoint: Record<string, any> = {
      week: format(week.weekDate, 'MMM d'),
      weekKey: week.weekKey,
      total: Math.round(week.totalDemand),
      capacity: effectiveCapacity,
    };

    allProjectIds.forEach(projectId => {
      dataPoint[projectId] = Math.round(week.demandByProject[projectId] || 0);
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
          <span className="text-muted-foreground">Projects: </span>
          <span className="font-medium">{allProjectIds.length}</span>
        </div>
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
              {allProjectIds.map((projectId, index) => (
                <linearGradient key={projectId} id={`gradient-proj-${projectId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PROJECT_COLORS[index % PROJECT_COLORS.length]} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={PROJECT_COLORS[index % PROJECT_COLORS.length]} stopOpacity={0.1}/>
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
                return [`${value} hours`, effectiveProjectNames[name] || name];
              }}
            />
            <Legend 
              formatter={(value) => {
                if (value === 'capacity') return 'Team Capacity';
                return effectiveProjectNames[value] || value;
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
            
            {/* Stacked areas for each project */}
            {allProjectIds.map((projectId, index) => (
              <Area
                key={projectId}
                type="monotone"
                dataKey={projectId}
                stackId="1"
                stroke={PROJECT_COLORS[index % PROJECT_COLORS.length]}
                fill={`url(#gradient-proj-${projectId})`}
                name={projectId}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Project Legend with totals */}
      <div className="flex flex-wrap gap-4 pt-2 border-t">
        {allProjectIds.map((projectId, index) => {
          const totalHours = effectiveWeeklyDemand.reduce((sum, week) => sum + (week.demandByProject[projectId] || 0), 0);
          return (
            <div key={projectId} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: PROJECT_COLORS[index % PROJECT_COLORS.length] }}
              />
              <span className="text-muted-foreground">{effectiveProjectNames[projectId] || projectId}:</span>
              <span className="font-medium">{Math.round(totalHours)}h</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};