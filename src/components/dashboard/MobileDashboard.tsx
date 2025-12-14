import React, { useMemo } from 'react';
import { SparklineMetricCard } from './executive/SparklineMetricCard';
import { RiskAlertsSection } from './executive/RiskAlertsSection';
import { TopResourcesTable } from './executive/TopResourcesTable';
import { HorizontalBarChart } from './executive/HorizontalBarChart';
import { UnifiedHolidayCard } from './cards/UnifiedHolidayCard';
import { HerbieFloatingButton } from './HerbieFloatingButton';
import { useUnifiedDashboardData } from './UnifiedDashboardProvider';
import { TimeRange } from './TimeRangeSelector';
import { Users, Briefcase, TrendingUp, AlertCircle } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useTimeRangeCapacity } from '@/hooks/useTimeRangeCapacity';

interface MobileDashboardProps {
  selectedTimeRange: TimeRange;
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({
  selectedTimeRange
}) => {
  const data = useUnifiedDashboardData();
  const { workWeekHours } = useAppSettings();
  const { weekMultiplier, getTotalCapacity, label: timeRangeLabel } = useTimeRangeCapacity(selectedTimeRange);

  // Calculate metrics
  const utilizationRate = data.currentUtilizationRate;
  const activeProjects = data.projects.filter(p => p.status === 'Active').length;
  const totalProjects = data.projects.length;
  const teamSize = data.teamMembers.length + data.preRegisteredMembers.length;
  
  // Time-range-aware capacity
  const totalTeamCapacityForRange = teamSize * getTotalCapacity(workWeekHours);
  const totalAllocatedHoursForRange = data.memberUtilizations.reduce((sum, m) => {
    return sum + (m.totalAllocatedHours * weekMultiplier);
  }, 0);
  const remainingCapacity = totalTeamCapacityForRange - totalAllocatedHoursForRange;
  const hasCapacityGap = remainingCapacity < 0;
  
  const overloadedResources = data.memberUtilizations.filter(m => m.utilization > 100);
  const overloadedCount = overloadedResources.length;
  const atRiskProjects = overloadedCount > 3 ? 2 : 0;

  // Sparkline trends
  const utilizationTrend = [
    utilizationRate - 20,
    utilizationRate - 15,
    utilizationRate - 10,
    utilizationRate - 5,
    utilizationRate
  ];

  // Project pipeline
  const projectsByStatus = useMemo(() => {
    const statusCount = data.projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { label: 'Planning', value: statusCount['Planning'] || 0, max: totalProjects, color: 'hsl(var(--chart-1))' },
      { label: 'Active', value: statusCount['Active'] || 0, max: totalProjects, color: 'hsl(var(--primary))' },
      { label: 'On Hold', value: statusCount['On Hold'] || 0, max: totalProjects, color: 'hsl(var(--warning))' }
    ];
  }, [data.projects, totalProjects]);

  // Top resources
  const topOverloadedResources = useMemo(() => {
    return overloadedResources
      .sort((a, b) => b.utilization - a.utilization)
      .slice(0, 5)
      .map(m => {
        const member = data.teamMembers.find(tm => tm.id === m.memberId);
        return {
          id: m.memberId,
          name: m.memberName,
          avatarUrl: member?.avatar_url,
          thisWeek: Math.round(m.utilization),
          nextWeek: Math.round(m.utilization - 10),
          projectCount: 3
        };
      });
  }, [overloadedResources, data.teamMembers]);

  const getUtilizationStatus = () => {
    if (utilizationRate > 120) return { status: 'danger' as const, badge: 'Critical' };
    if (utilizationRate > 100) return { status: 'warning' as const, badge: 'High' };
    if (utilizationRate < 70) return { status: 'warning' as const, badge: 'Low' };
    return { status: 'good' as const, badge: 'Optimal' };
  };

  const utilizationStatus = getUtilizationStatus();

  return (
    <div className="w-full min-h-screen bg-gray-50/30">
      <div className="max-w-sm mx-auto px-3 py-4 space-y-4">
        {/* Risk Alerts */}
        <RiskAlertsSection
          overloadedCount={overloadedCount}
          atRiskProjects={atRiskProjects}
          upcomingGaps={hasCapacityGap ? 1 : 0}
        />

        {/* Key Metrics */}
        <SparklineMetricCard
          title="Team Utilization"
          value={`${Math.round(utilizationRate)}%`}
          subtitle={`${timeRangeLabel} • ${teamSize} members`}
          icon={TrendingUp}
          trend={utilizationTrend}
          status={utilizationStatus.status}
          badge={utilizationStatus.badge}
        />

        <SparklineMetricCard
          title={`${timeRangeLabel} Capacity`}
          value={`${Math.round(totalTeamCapacityForRange)}h`}
          subtitle={`${teamSize} × ${workWeekHours}h × ${weekMultiplier}w`}
          icon={Users}
          status={overloadedCount > 0 ? 'danger' : 'good'}
          badge={overloadedCount > 0 ? `${overloadedCount} overbooked` : 'Balanced'}
        />

        <SparklineMetricCard
          title="Active Projects"
          value={activeProjects}
          subtitle={`${totalProjects} total`}
          icon={Briefcase}
          status={atRiskProjects > 0 ? 'warning' : 'good'}
          badge={atRiskProjects > 0 ? `${atRiskProjects} at risk` : 'On Track'}
        />

        {/* Top Resources */}
        {overloadedCount > 0 && (
          <TopResourcesTable resources={topOverloadedResources} />
        )}

        {/* Project Pipeline */}
        <HorizontalBarChart
          title="Project Pipeline"
          data={projectsByStatus}
        />

        {/* Holidays */}
        <UnifiedHolidayCard data={data} />

        {/* Bottom padding */}
        <div className="h-20"></div>
      </div>
      
      <HerbieFloatingButton />
    </div>
  );
};
