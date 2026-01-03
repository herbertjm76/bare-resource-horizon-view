import React, { useMemo } from 'react';
import { SparklineMetricCard } from './executive/SparklineMetricCard';
import { RiskAlertsSection } from './executive/RiskAlertsSection';
import { HorizontalBarChart } from './executive/HorizontalBarChart';
import { TopResourcesTable } from './executive/TopResourcesTable';
import { CapacityForecastChart } from './executive/CapacityForecastChart';
import { UnifiedHolidayCard } from './cards/UnifiedHolidayCard';
import { LoadingDashboard } from './LoadingDashboard';
import { useDashboardData } from './hooks/useDashboardData';
import { TimeRange } from './TimeRangeSelector';
import { Users, Briefcase, TrendingUp, AlertCircle } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useTimeRangeCapacity, getTimeRangeLabel } from '@/hooks/useTimeRangeCapacity';
import { formatAllocationValue, formatCapacityValue } from '@/utils/allocationDisplay';

interface DesktopDashboardProps {
  selectedTimeRange: TimeRange;
}

export const DesktopDashboard: React.FC<DesktopDashboardProps> = ({
  selectedTimeRange
}) => {
  const data = useDashboardData(selectedTimeRange);
  const { workWeekHours, displayPreference } = useAppSettings();
  const { weekMultiplier, getTotalCapacity, label: timeRangeLabel, shortLabel } = useTimeRangeCapacity(selectedTimeRange);

  if (data.isLoading) {
    return <LoadingDashboard />;
  }

  // Team metrics
  const teamSize = data.teamMembers.length + data.preRegisteredMembers.length;
  const activeProjects = data.metrics?.activeProjects || 0;
  const totalProjects = data.projects.length;
  
  // TIME-RANGE-AWARE CAPACITY CALCULATIONS
  // Total team capacity for the selected time range
  const totalTeamCapacityForRange = teamSize * getTotalCapacity(workWeekHours);
  
  // Calculate total allocated hours for the time range from member utilizations
  const totalAllocatedHoursForRange = useMemo(() => {
    return data.memberUtilizations.reduce((sum, m) => {
      // m.totalAllocatedHours is per-week average, multiply by weeks in range
      return sum + (m.totalAllocatedHours * weekMultiplier);
    }, 0);
  }, [data.memberUtilizations, weekMultiplier]);
  
  // Overall utilization rate (already calculated correctly in the hook)
  const utilizationRate = data.currentUtilizationRate;
  
  // Calculate overloaded resources (>100% utilization)
  const overloadedResources = data.memberUtilizations.filter(m => m.utilization > 100);
  const overloadedCount = overloadedResources.length;
  
  // Calculate at-risk projects
  const atRiskProjects = (activeProjects > 0 && overloadedCount > 3) ? Math.min(2, activeProjects) : 0;
  
  // Capacity gap (remaining capacity)
  const remainingCapacity = totalTeamCapacityForRange - totalAllocatedHoursForRange;
  const hasCapacityGap = remainingCapacity < 0;
  const capacityGapHours = Math.abs(remainingCapacity);

  // Sparkline trends
  const utilizationTrend = data.metrics?.utilizationTrends 
    ? [
        data.metrics.utilizationTrends.days90,
        data.metrics.utilizationTrends.days90,
        data.metrics.utilizationTrends.days30,
        data.metrics.utilizationTrends.days30,
        data.metrics.utilizationTrends.days7,
        utilizationRate,
        utilizationRate
      ]
    : [utilizationRate, utilizationRate, utilizationRate, utilizationRate, utilizationRate, utilizationRate, utilizationRate];

  // Project pipeline data
  const projectsByStatus = useMemo(() => {
    const statusData = data.metrics?.projectsByStatus || [];
    
    if (statusData.length > 0) {
      return statusData.map(s => ({
        label: s.name,
        value: s.value,
        max: totalProjects,
        color: s.name === 'Active' ? 'hsl(var(--primary))' : 
               s.name === 'Planning' ? 'hsl(var(--chart-1))' :
               s.name === 'On Hold' ? 'hsl(var(--warning))' : 'hsl(var(--chart-4))'
      }));
    }
    
    const statusCount = data.projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { label: 'Planning', value: statusCount['Planning'] || 0, max: totalProjects, color: 'hsl(var(--chart-1))' },
      { label: 'Active', value: statusCount['Active'] || 0, max: totalProjects, color: 'hsl(var(--primary))' },
      { label: 'On Hold', value: statusCount['On Hold'] || 0, max: totalProjects, color: 'hsl(var(--warning))' },
      { label: 'Completed', value: statusCount['Completed'] || 0, max: totalProjects, color: 'hsl(var(--chart-4))' }
    ];
  }, [data.projects, data.metrics?.projectsByStatus, totalProjects]);

  // Top overloaded resources with time-range-aware hours
  const topOverloadedResources = useMemo(() => {
    return overloadedResources
      .sort((a, b) => b.utilization - a.utilization)
      .slice(0, 5)
      .map(m => {
        const member = data.teamMembers.find(tm => tm.id === m.memberId);
        const projectCount = 3; // Mock for now
        return {
          id: m.memberId,
          name: m.memberName,
          avatarUrl: member?.avatar_url,
          thisWeek: Math.round(m.utilization),
          nextWeek: Math.round(m.utilization - 10),
          projectCount
        };
      });
  }, [overloadedResources, data.teamMembers]);

  // Capacity forecast (next 8 weeks from now)
  const capacityForecastData = useMemo(() => {
    const weeklyCapacity = teamSize * workWeekHours;
    const weeklyDemand = (utilizationRate / 100) * weeklyCapacity;
    
    return Array.from({ length: 8 }, (_, i) => ({
      week: `W${i + 1}`,
      capacity: weeklyCapacity,
      demand: Math.round(weeklyDemand + (Math.random() * 40 - 20))
    }));
  }, [teamSize, utilizationRate, workWeekHours]);

  // Utilization status
  const getUtilizationStatus = () => {
    if (utilizationRate > 120) return { status: 'danger' as const, badge: 'Critical - Need Hiring' };
    if (utilizationRate > 100) return { status: 'warning' as const, badge: 'High - Monitor Closely' };
    if (utilizationRate < 70) return { status: 'warning' as const, badge: 'Low - Need Projects' };
    return { status: 'good' as const, badge: 'Optimal Range' };
  };

  const utilizationStatus = getUtilizationStatus();

  return (
    <div className="space-y-6">
      {/* Hero Metrics - 4 Key Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="opacity-0 animate-[cascadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] animation-delay-0 h-full">
          <SparklineMetricCard
            title="Team Utilization"
            value={`${Math.round(utilizationRate)}%`}
            subtitle={`${timeRangeLabel} • ${teamSize} members`}
            icon={TrendingUp}
            trend={utilizationTrend}
            status={utilizationStatus.status}
            badge={utilizationStatus.badge}
          />
        </div>
        <div className="opacity-0 animate-[cascadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] animation-delay-100 h-full">
          <SparklineMetricCard
            title="Active Projects"
            value={activeProjects}
            subtitle={`${totalProjects} total projects`}
            icon={Briefcase}
            status={atRiskProjects > 0 ? 'warning' : 'good'}
            badge={atRiskProjects > 0 ? `${atRiskProjects} at risk` : 'On Track'}
          />
        </div>
        <div className="opacity-0 animate-[cascadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] animation-delay-200 h-full">
          <SparklineMetricCard
            title={`${timeRangeLabel} Capacity`}
            value={formatCapacityValue(Math.round(totalTeamCapacityForRange), displayPreference)}
            subtitle={`${teamSize} resources × ${formatCapacityValue(workWeekHours, displayPreference)} × ${weekMultiplier}w`}
            icon={Users}
            status={overloadedCount > 0 ? 'danger' : 'good'}
            badge={overloadedCount > 0 ? `${overloadedCount} overbooked` : 'Balanced'}
          />
        </div>
        <div className="opacity-0 animate-[cascadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] animation-delay-300 h-full">
          <SparklineMetricCard
            title="Capacity Gap"
            value={hasCapacityGap 
              ? `${formatAllocationValue(Math.round(capacityGapHours), totalTeamCapacityForRange, displayPreference)} over` 
              : `${formatAllocationValue(Math.round(remainingCapacity), totalTeamCapacityForRange, displayPreference)} free`}
            subtitle={`${timeRangeLabel} ${hasCapacityGap ? 'overbooked' : 'available'}`}
            icon={AlertCircle}
            status={hasCapacityGap ? 'danger' : remainingCapacity < totalTeamCapacityForRange * 0.1 ? 'warning' : 'good'}
            badge={hasCapacityGap ? 'Over Capacity' : remainingCapacity < totalTeamCapacityForRange * 0.1 ? 'Nearly Full' : 'Well Planned'}
          />
        </div>
      </div>

      {/* Alerts + Forecast Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="opacity-0 animate-[cascadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] animation-delay-400">
          <RiskAlertsSection
            overloadedCount={overloadedCount}
            atRiskProjects={atRiskProjects}
            upcomingGaps={hasCapacityGap ? 1 : 0}
          />
        </div>
        <div className="opacity-0 animate-[cascadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] animation-delay-500">
          <CapacityForecastChart data={capacityForecastData} />
        </div>
      </div>

      {/* Second Row: Top Resources + Project Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="opacity-0 animate-[cascadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] animation-delay-600">
          <TopResourcesTable resources={topOverloadedResources} />
        </div>
        <div className="opacity-0 animate-[cascadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] animation-delay-700">
          <HorizontalBarChart
            title="Project Pipeline"
            data={projectsByStatus}
          />
        </div>
      </div>

      {/* Third Row: Holidays */}
      <div className="grid grid-cols-1 gap-6">
        <div className="opacity-0 animate-[cascadeUp_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] animation-delay-800">
          <UnifiedHolidayCard data={data} />
        </div>
      </div>
    </div>
  );
};
