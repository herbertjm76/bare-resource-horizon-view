
import React from 'react';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown } from './hooks/useWorkloadData';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';

interface WorkloadSummaryProps {
  members: TeamMember[];
  workloadData: Record<string, Record<string, WorkloadBreakdown>>;
  selectedWeek: Date;
  periodToShow: number;
}

export const WorkloadSummary: React.FC<WorkloadSummaryProps> = ({
  members,
  workloadData,
  selectedWeek,
  periodToShow
}) => {
  // Calculate summary metrics
  const calculateMetrics = () => {
    let totalCapacity = 0;
    let totalAllocated = 0;
    let totalProjectHours = 0;
    let totalLeaveHours = 0;
    
    members.forEach(member => {
      const memberWeeklyCapacity = member.weekly_capacity || 40;
      totalCapacity += memberWeeklyCapacity * periodToShow;
      
      const memberData = workloadData[member.id] || {};
      Object.values(memberData).forEach(breakdown => {
        totalAllocated += breakdown.total;
        totalProjectHours += breakdown.projectHours;
        totalLeaveHours += breakdown.annualLeave + breakdown.otherLeave;
      });
    });
    
    const utilizationRate = totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 0;
    const projectUtilization = totalCapacity > 0 ? Math.round((totalProjectHours / totalCapacity) * 100) : 0;
    const leaveRate = totalCapacity > 0 ? Math.round((totalLeaveHours / totalCapacity) * 100) : 0;
    
    return {
      totalCapacity,
      totalAllocated,
      utilizationRate,
      projectUtilization,
      leaveRate,
      totalMembers: members.length
    };
  };

  const metrics = calculateMetrics();
  
  const weekRange = `${format(startOfWeek(selectedWeek, { weekStartsOn: 1 }), 'MMM d')} - ${format(addDays(startOfWeek(selectedWeek, { weekStartsOn: 1 }), (periodToShow * 7) - 1), 'MMM d, yyyy')}`;

  const summaryMetrics = [
    {
      title: "Team Utilization",
      value: `${metrics.utilizationRate}%`,
      subtitle: `${metrics.totalAllocated}h of ${metrics.totalCapacity}h capacity`,
      badgeText: metrics.utilizationRate > 85 ? 'High' : metrics.utilizationRate > 70 ? 'Optimal' : 'Low',
      badgeColor: metrics.utilizationRate > 85 ? 'red' : metrics.utilizationRate > 70 ? 'green' : 'yellow'
    },
    {
      title: "Project Work",
      value: `${metrics.projectUtilization}%`,
      subtitle: "Time allocated to projects",
      badgeText: "Billable",
      badgeColor: "blue"
    },
    {
      title: "Leave & Holidays",
      value: `${metrics.leaveRate}%`,
      subtitle: "Time away from work",
      badgeText: metrics.leaveRate > 20 ? 'High Impact' : 'Manageable',
      badgeColor: metrics.leaveRate > 20 ? 'orange' : 'green'
    },
    {
      title: "Available Capacity",
      value: `${Math.max(0, metrics.totalCapacity - metrics.totalAllocated)}h`,
      subtitle: "Unallocated hours",
      badgeText: metrics.totalCapacity - metrics.totalAllocated > 0 ? 'Available' : 'Fully Allocated',
      badgeColor: metrics.totalCapacity - metrics.totalAllocated > 0 ? 'blue' : 'yellow'
    }
  ];

  return (
    <StandardizedExecutiveSummary
      title="Team Workload Overview"
      timeRangeText={`${weekRange} (${periodToShow} weeks)`}
      metrics={summaryMetrics}
    />
  );
};
