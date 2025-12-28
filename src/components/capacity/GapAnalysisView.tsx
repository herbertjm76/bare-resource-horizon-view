import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { TeamMember } from '@/components/dashboard/types';
import { WeeklyWorkloadBreakdown } from '@/components/workload/hooks/types';
import { WeeklyDemandData } from '@/hooks/useDemandProjection';
import { format, addWeeks, startOfWeek } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getMemberCapacity } from '@/utils/capacityUtils';
import { formatAllocationValue } from '@/utils/allocationDisplay';

interface GapAnalysisViewProps {
  members: TeamMember[];
  weeklyWorkloadData: Record<string, Record<string, WeeklyWorkloadBreakdown>>;
  weeklyDemand: WeeklyDemandData[];
  weekStartDates: Array<{ date: Date; key: string }>;
  isLoading: boolean;
}

// Demo data generator for gap analysis
const generateDemoGapData = (numberOfWeeks: number = 12) => {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  // Using partial TeamMember type for demo - we only need the fields used in calculations
  const demoMembers = [
    { id: 'demo-1', email: 'alice@demo.com', weekly_capacity: 40, first_name: 'Alice', last_name: 'Johnson', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'demo-2', email: 'bob@demo.com', weekly_capacity: 40, first_name: 'Bob', last_name: 'Smith', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'demo-3', email: 'carol@demo.com', weekly_capacity: 35, first_name: 'Carol', last_name: 'Davis', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'demo-4', email: 'david@demo.com', weekly_capacity: 40, first_name: 'David', last_name: 'Lee', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 'demo-5', email: 'eva@demo.com', weekly_capacity: 40, first_name: 'Eva', last_name: 'Martinez', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ] as TeamMember[];

  const weekStartDates: Array<{ date: Date; key: string }> = [];
  const weeklyWorkloadData: Record<string, Record<string, WeeklyWorkloadBreakdown>> = {};
  const weeklyDemand: WeeklyDemandData[] = [];

  for (let i = 0; i < numberOfWeeks; i++) {
    const weekDate = addWeeks(startDate, i);
    const weekKey = format(weekDate, 'yyyy-MM-dd');
    weekStartDates.push({ date: weekDate, key: weekKey });

    // Generate varying demand pattern
    const demandMultiplier = 0.7 + Math.sin(i * 0.4) * 0.4;
    const totalDemand = Math.round(180 * demandMultiplier + Math.random() * 30);

    weeklyDemand.push({
      weekKey,
      weekDate,
      demandByRole: {},
      demandByProject: {},
      totalDemand,
    });

    // Generate actual workload (slightly less than demand for realistic gap)
    demoMembers.forEach(member => {
      if (!weeklyWorkloadData[member.id]) {
        weeklyWorkloadData[member.id] = {};
      }
      const capacity = (member as any).weekly_capacity || 40;
      const utilizationVariance = 0.6 + Math.random() * 0.35;
      const memberHours = Math.round(capacity * utilizationVariance);
      
      weeklyWorkloadData[member.id][weekKey] = {
        projectHours: memberHours,
        annualLeave: 0,
        officeHolidays: 0,
        otherLeave: 0,
        total: memberHours,
        projects: []
      };
    });
  }

  return { demoMembers, weekStartDates, weeklyWorkloadData, weeklyDemand };
};

export const GapAnalysisView: React.FC<GapAnalysisViewProps> = ({
  members: propMembers,
  weeklyWorkloadData: propWeeklyWorkloadData,
  weeklyDemand: propWeeklyDemand,
  weekStartDates: propWeekStartDates,
  isLoading
}) => {
  const { workWeekHours, displayPreference } = useAppSettings();

  // Check if we have real data
  const hasRealData = propMembers.length > 0 && 
    (Object.keys(propWeeklyWorkloadData).length > 0 || propWeeklyDemand.some(d => d.totalDemand > 0));

  // Use real or demo data
  const { members, weeklyWorkloadData, weeklyDemand, weekStartDates, isDemo } = useMemo(() => {
    if (hasRealData) {
      return {
        members: propMembers,
        weeklyWorkloadData: propWeeklyWorkloadData,
        weeklyDemand: propWeeklyDemand,
        weekStartDates: propWeekStartDates,
        isDemo: false
      };
    }
    const demo = generateDemoGapData(propWeekStartDates.length || 12);
    return {
      members: demo.demoMembers,
      weeklyWorkloadData: demo.weeklyWorkloadData,
      weeklyDemand: demo.weeklyDemand,
      weekStartDates: demo.weekStartDates,
      isDemo: true
    };
  }, [hasRealData, propMembers, propWeeklyWorkloadData, propWeeklyDemand, propWeekStartDates]);
  
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
  }, [weekStartDates, members, weeklyWorkloadData, weeklyDemand, workWeekHours]);

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

  return (
    <div className="space-y-6">
      {/* Demo indicator */}
      {isDemo && (
        <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-300/30 rounded-lg">
          <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-300">
            Demo Data
          </Badge>
          <span className="text-sm text-amber-700">
            Showing sample data. Allocate resources to projects and add team compositions to see real gap analysis.
          </span>
        </div>
      )}

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
                {formatAllocationValue(summary.totalUnscheduled, summary.totalCapacity, displayPreference)}
              </>
            ) : summary.totalUnscheduled < 0 ? (
              <>
                <TrendingDown className="h-5 w-5 text-green-500" />
                {formatAllocationValue(Math.abs(summary.totalUnscheduled), summary.totalCapacity, displayPreference)} ahead
              </>
            ) : (
              <>
                <Minus className="h-5 w-5 text-muted-foreground" />
                {displayPreference === 'percentage' ? '0%' : '0h'}
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {summary.totalUnscheduled > 0 ? 'Needs scheduling' : 'Scheduled ahead'}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-muted/50">
          <div className="text-sm text-muted-foreground">Team Capacity</div>
          <div className="text-2xl font-bold">{formatAllocationValue(summary.totalCapacity, summary.totalCapacity, displayPreference)}</div>
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
                y={members.reduce((sum, m) => sum + getMemberCapacity(m.weekly_capacity, workWeekHours), 0)} 
                stroke="hsl(var(--destructive))" 
                strokeDasharray="5 5"
                label={{ 
                  value: 'Weekly Capacity', 
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
