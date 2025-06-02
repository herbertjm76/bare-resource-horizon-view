
import React from 'react';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TeamMember } from '@/components/dashboard/types';
import { WorkloadBreakdown } from './hooks/useWorkloadData';

interface WorkloadSummaryProps {
  members: TeamMember[];
  workloadData: Record<string, Record<string, WorkloadBreakdown>>;
  selectedWeek: Date;
  periodToShow?: number;
}

export const WorkloadSummary: React.FC<WorkloadSummaryProps> = ({
  members,
  workloadData,
  selectedWeek,
  periodToShow = 12
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

  // Calculate which members need resourcing (low utilization) and are overloaded
  const memberStatus = members.map(member => {
    const weeklyCapacity = member.weekly_capacity || 40;
    const totalCapacity = weeklyCapacity * periodToShow;
    
    const memberData = workloadData[member.id] || {};
    const totalAllocated = Object.values(memberData).reduce((sum, breakdown) => sum + breakdown.total, 0);
    
    const utilization = totalCapacity > 0 ? (totalAllocated / totalCapacity) * 100 : 0;
    
    return {
      member,
      utilization,
      totalAllocated,
      totalCapacity
    };
  });

  const needsResourcing = memberStatus.filter(m => m.utilization < 60);
  const overloaded = memberStatus.filter(m => m.utilization > 100);

  const renderMemberAvatars = (memberList: typeof memberStatus, maxShow: number = 6) => {
    const membersToShow = memberList.slice(0, maxShow);
    const remainingCount = memberList.length - maxShow;

    return (
      <div className="flex items-center justify-center gap-2">
        <div className="flex -space-x-2">
          {membersToShow.map(({ member }) => (
            <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
              <AvatarFallback className="text-xs bg-blue-500 text-white">
                {member.first_name?.charAt(0) || '?'}{member.last_name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        {remainingCount > 0 && (
          <Badge variant="secondary" className="text-xs">
            +{remainingCount}
          </Badge>
        )}
      </div>
    );
  };

  // Calculate metrics
  const overallUtilization = calculateOverallUtilization();
  const availableCapacity = calculateAvailableCapacity();

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
      title: "Needs Resourcing",
      value: needsResourcing.length > 0 ? renderMemberAvatars(needsResourcing) : (
        <span className="text-sm text-white/80">All well utilized</span>
      ),
      subtitle: "Under 60% utilization",
      badgeText: `${needsResourcing.length}`,
      badgeColor: needsResourcing.length > 0 ? "blue" : "green"
    },
    {
      title: "Overloaded Staff",
      value: overloaded.length > 0 ? renderMemberAvatars(overloaded) : (
        <span className="text-sm text-white/80">No one overloaded</span>
      ),
      subtitle: "Over 100% utilization",
      badgeText: `${overloaded.length}`,
      badgeColor: overloaded.length > 0 ? "red" : "green"
    }
  ];

  return (
    <StandardizedExecutiveSummary
      metrics={metrics}
      gradientType="purple"
    />
  );
};
