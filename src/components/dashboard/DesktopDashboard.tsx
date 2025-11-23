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

interface DesktopDashboardProps {
  selectedTimeRange: TimeRange;
}

export const DesktopDashboard: React.FC<DesktopDashboardProps> = ({
  selectedTimeRange
}) => {
  const data = useDashboardData(selectedTimeRange);

  if (data.isLoading) {
    return <LoadingDashboard />;
  }

  // Calculate metrics
  const utilizationRate = data.currentUtilizationRate;
  const activeProjects = data.projects.filter(p => p.status === 'Active').length;
  const totalProjects = data.projects.length;
  const teamSize = data.teamMembers.length + data.preRegisteredMembers.length;
  
  // Calculate overloaded resources (>100% utilization)
  const overloadedResources = data.memberUtilizations.filter(m => m.utilization > 100);
  const overloadedCount = overloadedResources.length;
  
  // Calculate at-risk projects (projects with overallocated resources)
  const atRiskProjects = data.projects.filter(p => p.status === 'Active' || p.status === 'Planning').length > 0 && overloadedCount > 3 ? 2 : 0;
  
  // Simulate capacity gaps (weeks where utilization > 100%)
  const upcomingGaps = utilizationRate > 100 ? 2 : 0;

  // Sparkline trends (simulate 7-day trend)
  const utilizationTrend = [
    utilizationRate - 20,
    utilizationRate - 15,
    utilizationRate - 10,
    utilizationRate - 5,
    utilizationRate,
    utilizationRate + 2,
    utilizationRate + 3
  ];

  // Project pipeline data
  const projectsByStatus = useMemo(() => {
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
  }, [data.projects, totalProjects]);

  // Top overloaded resources
  const topOverloadedResources = useMemo(() => {
    return overloadedResources
      .sort((a, b) => b.utilization - a.utilization)
      .map(m => {
        const member = data.teamMembers.find(tm => tm.id === m.memberId);
        const projectCount = 3; // Mock for now
        return {
          id: m.memberId,
          name: m.memberName,
          avatarUrl: member?.avatar_url,
          thisWeek: Math.round(m.utilization),
          nextWeek: Math.round(m.utilization - 10), // Mock next week
          projectCount
        };
      });
  }, [overloadedResources, data.teamMembers]);

  // Capacity forecast (next 8 weeks)
  const capacityForecastData = useMemo(() => {
    const baseCapacity = teamSize * 40; // 40 hours per person per week
    const baseDemand = (utilizationRate / 100) * baseCapacity;
    
    return Array.from({ length: 8 }, (_, i) => ({
      week: `W${i + 1}`,
      capacity: baseCapacity + (i * 10), // Slight growth
      demand: baseDemand + (Math.random() * 100 - 50) // Fluctuation
    }));
  }, [teamSize, utilizationRate]);

  // Determine utilization status
  const getUtilizationStatus = () => {
    if (utilizationRate > 120) return { status: 'danger' as const, badge: 'Critical - Need Hiring' };
    if (utilizationRate > 100) return { status: 'warning' as const, badge: 'High - Monitor Closely' };
    if (utilizationRate < 70) return { status: 'warning' as const, badge: 'Low - Need Projects' };
    return { status: 'good' as const, badge: 'Optimal Range' };
  };

  const utilizationStatus = getUtilizationStatus();

  return (
    <div className="p-6 space-y-6">
      {/* Risk Alerts - Top Priority */}
      <RiskAlertsSection
        overloadedCount={overloadedCount}
        atRiskProjects={atRiskProjects}
        upcomingGaps={upcomingGaps}
      />

      {/* Hero Metrics - 4 Key Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SparklineMetricCard
          title="Team Utilization"
          value={`${Math.round(utilizationRate)}%`}
          subtitle={`${teamSize} team members`}
          icon={TrendingUp}
          trend={utilizationTrend}
          status={utilizationStatus.status}
          badge={utilizationStatus.badge}
        />
        <SparklineMetricCard
          title="Active Projects"
          value={activeProjects}
          subtitle={`${totalProjects} total projects`}
          icon={Briefcase}
          status={atRiskProjects > 0 ? 'warning' : 'good'}
          badge={atRiskProjects > 0 ? `${atRiskProjects} at risk` : 'On Track'}
        />
        <SparklineMetricCard
          title="Team Capacity"
          value={`${teamSize * 40}h`}
          subtitle={`${teamSize} available resources`}
          icon={Users}
          status={overloadedCount > 0 ? 'danger' : 'good'}
          badge={overloadedCount > 0 ? `${overloadedCount} overbooked` : 'Balanced'}
        />
        <SparklineMetricCard
          title="Capacity Gap"
          value={upcomingGaps > 0 ? `${upcomingGaps} weeks` : 'None'}
          subtitle="Upcoming shortfalls"
          icon={AlertCircle}
          status={upcomingGaps > 0 ? 'warning' : 'good'}
          badge={upcomingGaps > 0 ? 'Action Needed' : 'Well Planned'}
        />
      </div>

      {/* Capacity Forecast - Full Width */}
      <CapacityForecastChart data={capacityForecastData} />

      {/* Second Row: Top Resources + Project Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopResourcesTable resources={topOverloadedResources} />
        <HorizontalBarChart
          title="Project Pipeline"
          data={projectsByStatus}
        />
      </div>

      {/* Third Row: Holidays */}
      <div className="grid grid-cols-1 gap-6">
        <UnifiedHolidayCard data={data} />
      </div>
    </div>
  );
};
