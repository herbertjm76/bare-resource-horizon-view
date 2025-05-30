
import React from 'react';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown } from './hooks/useWorkloadData';

interface WorkloadSummaryProps {
  members: TeamMember[];
  workloadData: Record<string, Record<string, WorkloadBreakdown>>;
  selectedWeek: Date;
  periodToShow?: number;
  summaryFormat?: 'simple' | 'detailed';
}

export const WorkloadSummary: React.FC<WorkloadSummaryProps> = ({
  members,
  workloadData,
  selectedWeek,
  periodToShow = 12,
  summaryFormat = 'simple'
}) => {
  // Calculate overall team utilization for the specified period
  const calculateOverallUtilization = () => {
    if (members.length === 0) return 0;
    
    let totalCapacity = 0;
    let totalAllocated = 0;
    
    members.forEach(member => {
      const weeklyCapacity = member.weekly_capacity || 40;
      totalCapacity += weeklyCapacity * periodToShow;
      
      const memberData = workloadData[member.id] || {};
      const memberTotal = Object.values(memberData).reduce((sum, breakdown) => sum + breakdown.total, 0);
      totalAllocated += memberTotal;
    });
    
    return totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 0;
  };

  // Calculate available capacity for the specified period
  const calculateAvailableCapacity = () => {
    let totalAvailable = 0;
    
    members.forEach(member => {
      const weeklyCapacity = member.weekly_capacity || 40;
      const totalCapacity = weeklyCapacity * periodToShow;
      
      const memberData = workloadData[member.id] || {};
      const memberAllocated = Object.values(memberData).reduce((sum, breakdown) => sum + breakdown.total, 0);
      totalAvailable += Math.max(0, totalCapacity - memberAllocated);
    });
    
    return Math.round(totalAvailable);
  };

  // Get hiring recommendation
  const getHiringRecommendation = (utilization: number, availableHours: number) => {
    if (utilization >= 90) {
      return { status: 'urgent', message: 'Urgent hiring needed', color: 'red' };
    } else if (utilization >= 80) {
      return { status: 'consider', message: 'Consider hiring soon', color: 'orange' };
    } else if (availableHours > (periodToShow * 120)) { // 3 people equivalent capacity
      return { status: 'capacity', message: 'Good capacity available', color: 'green' };
    } else {
      return { status: 'monitor', message: 'Monitor capacity', color: 'blue' };
    }
  };

  // Calculate metrics
  const overallUtilization = calculateOverallUtilization();
  const availableCapacity = calculateAvailableCapacity();
  const hiringRec = getHiringRecommendation(overallUtilization, availableCapacity);
  
  const memberStats = members.reduce((stats, member) => {
    const memberData = workloadData[member.id] || {};
    const memberTotal = Object.values(memberData).reduce((sum, breakdown) => sum + breakdown.total, 0);
    const memberCapacity = (member.weekly_capacity || 40) * periodToShow;
    const utilization = memberCapacity > 0 ? (memberTotal / memberCapacity) * 100 : 0;
    
    if (utilization < 50) stats.underutilized++;
    else if (utilization > 100) stats.overallocated++;
    else stats.optimal++;
    
    return stats;
  }, { underutilized: 0, overallocated: 0, optimal: 0 });

  const metrics = [
    {
      title: "Team Utilization",
      value: `${overallUtilization}%`,
      subtitle: overallUtilization < 70 ? 'More projects needed' : 
               overallUtilization > 90 ? 'At capacity' : 'Good utilization',
      badgeText: overallUtilization < 70 ? 'Low' : 
                overallUtilization > 90 ? 'High' : 'Optimal',
      badgeColor: overallUtilization < 70 ? 'orange' : 
                 overallUtilization > 90 ? 'red' : 'green'
    },
    {
      title: "Available Hours",
      value: `${availableCapacity}h`,
      subtitle: `Next ${periodToShow} weeks capacity`,
      badgeText: "Plan Ahead",
      badgeColor: "blue"
    },
    {
      title: "Team Status",
      value: `${memberStats.optimal}`,
      subtitle: "Optimal allocation",
      badgeText: memberStats.overallocated > 0 ? `${memberStats.overallocated} Over` :
                memberStats.underutilized > 0 ? `${memberStats.underutilized} Under` : 'Balanced',
      badgeColor: memberStats.overallocated > 0 ? 'red' :
                 memberStats.underutilized > 0 ? 'orange' : 'green'
    },
    {
      title: "Hiring Status",
      value: hiringRec.message,
      subtitle: `Based on ${periodToShow}-week projection`,
      badgeText: hiringRec.status === 'urgent' ? 'Action Needed' : 'Monitor',
      badgeColor: hiringRec.color
    }
  ];

  return (
    <StandardizedExecutiveSummary
      metrics={metrics}
      gradientType="purple"
      cardFormat={summaryFormat}
    />
  );
};
