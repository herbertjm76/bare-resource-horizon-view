import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { TeamMember } from '@/components/dashboard/types';
import { WeeklyWorkloadBreakdown } from '@/components/workload/hooks/types';
import { WeeklyDemandData } from '@/hooks/useDemandProjection';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getMemberCapacity } from '@/utils/capacityUtils';

interface GapAnalysisViewProps {
  members: TeamMember[];
  weeklyWorkloadData: Record<string, Record<string, WeeklyWorkloadBreakdown>>;
  weeklyDemand: WeeklyDemandData[];
  weekStartDates: Array<{ date: Date; key: string }>;
  isLoading: boolean;
}

export const GapAnalysisView: React.FC<GapAnalysisViewProps> = ({
  members,
  weeklyWorkloadData,
  weeklyDemand,
  weekStartDates,
  isLoading
}) => {
  const { workWeekHours } = useAppSettings();
  
  // Calculate team capacity and actual workload per week
  const analysisData = useMemo(() => {
    return weekStartDates.map(week => {
      // Calculate total team capacity (sum of all members' weekly_capacity)
      const totalCapacity = members.reduce((sum, member) => {
        return sum + (member.weekly_capacity || workWeekHours);
      }, 0);

      // Calculate actual workload for this week
      const actualWorkload = members.reduce((sum, member) => {
        const memberData = weeklyWorkloadData[member.id]?.[week.key];
        return sum + (memberData?.total || 0);
      }, 0);

      // Get projected demand for this week
      const projectedDemand = weeklyDemand.find(d => d.weekKey === week.key)?.totalDemand || 0;

      // Calculate gaps
      const unscheduledWork = projectedDemand - actualWorkload; // Positive = work not yet scheduled
      const availableCapacity = totalCapacity - actualWorkload; // Positive = room for more work
      const overUnderCapacity = projectedDemand - totalCapacity; // Positive = over capacity

      return {
        week: format(week.date, 'MMM d'),
        weekKey: week.key,
        capacity: Math.round(totalCapacity),
        actual: Math.round(actualWorkload),
        projected: Math.round(projectedDemand),
        unscheduled: Math.round(unscheduledWork),
        available: Math.round(availableCapacity),
        gap: Math.round(overUnderCapacity),
      };
    });
  }, [weekStartDates, members, weeklyWorkloadData, weeklyDemand]);

  // Calculate summary metrics
  const summary = useMemo(() => {
    const totalCapacity = analysisData.reduce((sum, d) => sum + d.capacity, 0);
    const totalActual = analysisData.reduce((sum, d) => sum + d.actual, 0);
    const totalProjected = analysisData.reduce((sum, d) => sum + d.projected, 0);
    const totalUnscheduled = analysisData.reduce((sum, d) => sum + d.unscheduled, 0);

    const utilizationRate = totalCapacity > 0 ? (totalActual / totalCapacity) * 100 : 0;
    const projectedUtilization = totalCapacity > 0 ? (totalProjected / totalCapacity) * 100 : 0;

    return {
      totalCapacity,
      totalActual,
      totalProjected,
      totalUnscheduled,
      utilizationRate,
      projectedUtilization,
    };
  }, [analysisData]);

  if (isLoading) {
    return <Skeleton className="h-80 w-full" />;
  }

  // Check if there's any data
  const hasData = analysisData.some(d => d.actual > 0 || d.projected > 0);

  if (!hasData) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No capacity data available. Allocate resources to projects and add team compositions to see gap analysis.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="text-sm text-muted-foreground">Current Utilization</div>
          <div className="text-2xl font-bold">{Math.round(summary.utilizationRate)}%</div>
          <Badge variant={summary.utilizationRate > 80 ? 'destructive' : summary.utilizationRate < 50 ? 'secondary' : 'default'}>
            {summary.utilizationRate > 80 ? 'High' : summary.utilizationRate < 50 ? 'Low' : 'Optimal'}
          </Badge>
        </div>
        
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="text-sm text-muted-foreground">Projected Utilization</div>
          <div className="text-2xl font-bold">{Math.round(summary.projectedUtilization)}%</div>
          <Badge variant={summary.projectedUtilization > 100 ? 'destructive' : 'outline'}>
            {summary.projectedUtilization > 100 ? 'Over Capacity' : 'Within Capacity'}
          </Badge>
        </div>

        <div className="p-4 rounded-lg bg-muted/50">
          <div className="text-sm text-muted-foreground">Unscheduled Work</div>
          <div className="text-2xl font-bold flex items-center gap-1">
            {summary.totalUnscheduled > 0 ? (
              <>
                <TrendingUp className="h-5 w-5 text-amber-500" />
                {summary.totalUnscheduled}h
              </>
            ) : summary.totalUnscheduled < 0 ? (
              <>
                <TrendingDown className="h-5 w-5 text-green-500" />
                {Math.abs(summary.totalUnscheduled)}h ahead
              </>
            ) : (
              <>
                <Minus className="h-5 w-5 text-muted-foreground" />
                0h
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {summary.totalUnscheduled > 0 ? 'Needs scheduling' : 'Scheduled ahead'}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-muted/50">
          <div className="text-sm text-muted-foreground">Team Capacity</div>
          <div className="text-2xl font-bold">{summary.totalCapacity}h</div>
          <div className="text-xs text-muted-foreground">
            {members.length} members × {weekStartDates.length} weeks
          </div>
        </div>
      </div>

      {/* Gap Chart */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Capacity vs Demand by Week
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analysisData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                  const labels: Record<string, string> = {
                    actual: 'Actual Allocated',
                    projected: 'Projected Demand',
                    capacity: 'Team Capacity',
                  };
                  return [`${value} hours`, labels[name] || name];
                }}
              />
              <Legend 
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    actual: 'Actual Allocated',
                    projected: 'Projected Demand',
                  };
                  return labels[value] || value;
                }}
              />
              <ReferenceLine 
                y={members.reduce((sum, m) => sum + getMemberCapacity(m.weekly_capacity, workWeekHours), 0) / weekStartDates.length * weekStartDates.length / analysisData.length} 
                stroke="hsl(var(--destructive))" 
                strokeDasharray="5 5"
                label={{ 
                  value: 'Avg Capacity', 
                  position: 'insideTopRight',
                  fontSize: 10,
                  fill: 'hsl(var(--destructive))'
                }}
              />
              <Bar 
                dataKey="actual" 
                fill="hsl(var(--theme-primary))" 
                name="actual"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="projected" 
                fill="hsl(var(--muted-foreground))" 
                fillOpacity={0.5}
                name="projected"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Breakdown Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Week</th>
              <th className="text-right p-3 font-medium">Capacity</th>
              <th className="text-right p-3 font-medium">Actual</th>
              <th className="text-right p-3 font-medium">Projected</th>
              <th className="text-right p-3 font-medium">Available</th>
              <th className="text-right p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {analysisData.map((row, index) => (
              <tr key={row.weekKey} className={index % 2 === 0 ? '' : 'bg-muted/25'}>
                <td className="p-3">{row.week}</td>
                <td className="text-right p-3">{row.capacity}h</td>
                <td className="text-right p-3">{row.actual}h</td>
                <td className="text-right p-3">{row.projected}h</td>
                <td className="text-right p-3">
                  <span className={row.available < 0 ? 'text-destructive' : 'text-green-600'}>
                    {row.available}h
                  </span>
                </td>
                <td className="text-right p-3">
                  {row.gap > 0 ? (
                    <Badge variant="destructive" className="text-xs">Over</Badge>
                  ) : row.gap < -20 ? (
                    <Badge variant="secondary" className="text-xs">Under</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">OK</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
