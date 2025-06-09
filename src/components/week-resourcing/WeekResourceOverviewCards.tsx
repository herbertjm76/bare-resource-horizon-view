
import React from 'react';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useStandardizedUtilizationData } from '@/hooks/useStandardizedUtilizationData';
import { UtilizationCalculationService } from '@/services/utilizationCalculationService';

interface WeekResourceOverviewCardsProps {
  projects: any[];
  members: any[];
  allocations: any[];
  weekStartDate: string;
}

export const WeekResourceOverviewCards: React.FC<WeekResourceOverviewCardsProps> = ({
  projects,
  members,
  allocations,
  weekStartDate
}) => {
  const selectedWeek = new Date(weekStartDate);
  const { teamSummary, isLoading } = useStandardizedUtilizationData({
    selectedWeek,
    teamMembers: members
  });

  console.log('WeekResourceOverviewCards Debug:', {
    weekStartDate,
    projectsCount: projects?.length,
    membersCount: members?.length,
    allocationsCount: allocations?.length,
    isLoading,
    teamSummary
  });

  // Show loading state while data is being fetched
  if (isLoading) {
    console.log('WeekResourceOverviewCards: Still loading...');
    return (
      <div className="scale-85 origin-top">
        <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
      </div>
    );
  }

  // If we don't have basic data, don't render
  if (!projects || !members || !allocations) {
    console.log('WeekResourceOverviewCards: Missing basic data');
    return null;
  }

  // Helper functions for member avatars
  const getUserInitials = (member: any): string => {
    const firstName = member.first_name || '';
    const lastName = member.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarUrl = (member: any): string | undefined => {
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  const getMemberDisplayName = (member: any): string => {
    return `${member.first_name || ''} ${member.last_name || ''}`.trim();
  };

  const renderMemberAvatars = (memberList: any[], maxShow: number = 5) => {
    const membersToShow = memberList.slice(0, maxShow);
    const remainingCount = memberList.length - maxShow;

    return (
      <div className="flex items-center justify-center gap-1">
        <div className="flex gap-0.5">
          {membersToShow.map((member) => (
            <Avatar key={member.id} className="h-4 w-4 sm:h-5 sm:w-5">
              <AvatarImage src={getAvatarUrl(member)} alt={getMemberDisplayName(member)} />
              <AvatarFallback className="bg-brand-violet text-white text-xs">
                {getUserInitials(member)}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        {remainingCount > 0 && (
          <Badge variant="secondary" className="text-xs px-1 py-0">
            +{remainingCount}
          </Badge>
        )}
      </div>
    );
  };

  // Count active projects (projects with allocations > 0)
  const activeProjectsCount = projects.filter(project => {
    return allocations.some(allocation => allocation.project_id === project.id && allocation.hours > 0);
  }).length;

  // Calculate basic utilization if teamSummary is not available
  const fallbackUtilization = teamSummary ? null : (() => {
    const totalCapacity = members.reduce((sum, member) => sum + (member.weekly_capacity || 40), 0);
    const totalAllocated = allocations.reduce((sum, allocation) => sum + (allocation.hours || 0), 0);
    const utilizationRate = totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 0;
    const availableHours = Math.max(0, totalCapacity - totalAllocated);
    
    return {
      teamUtilizationRate: utilizationRate,
      totalAllocatedHours: totalAllocated,
      totalCapacity,
      totalAvailableHours: availableHours,
      underUtilizedMembers: members.filter(member => {
        const memberAllocated = allocations
          .filter(a => a.resource_id === member.id)
          .reduce((sum, a) => sum + (a.hours || 0), 0);
        const memberCapacity = member.weekly_capacity || 40;
        return (memberAllocated / memberCapacity) < 0.6;
      })
    };
  })();

  // Use teamSummary if available, otherwise use fallback
  const summary = teamSummary || fallbackUtilization;

  // Get members who need resourcing (under-utilized)
  const needsResourcingMembers = members.filter(member => {
    const memberUtilization = summary.underUtilizedMembers?.find(u => u.id === member.id);
    if (memberUtilization) return true;
    
    // Fallback calculation
    const memberAllocated = allocations
      .filter(a => a.resource_id === member.id)
      .reduce((sum, a) => sum + (a.hours || 0), 0);
    const memberCapacity = member.weekly_capacity || 40;
    return (memberAllocated / memberCapacity) < 0.6;
  });

  const metrics = [
    {
      title: "Active Projects",
      value: activeProjectsCount,
      subtitle: `${projects.length} total projects`,
      badgeText: activeProjectsCount > 0 ? "Active" : "No Activity",
      badgeColor: activeProjectsCount > 0 ? "green" : "gray"
    },
    {
      title: "Team Utilization",
      value: `${summary.teamUtilizationRate}%`,
      subtitle: `${summary.totalAllocatedHours}h of ${summary.totalCapacity}h`,
      badgeText: UtilizationCalculationService.getUtilizationBadgeText(summary.teamUtilizationRate),
      badgeColor: UtilizationCalculationService.getUtilizationColor(summary.teamUtilizationRate)
    },
    {
      title: "Available Capacity",
      value: `${summary.totalAvailableHours}h`,
      subtitle: "This week",
      badgeText: UtilizationCalculationService.getAvailableHoursBadgeText(summary.totalAvailableHours),
      badgeColor: UtilizationCalculationService.getAvailableHoursColor(summary.totalAvailableHours)
    },
    {
      title: "Needs Resourcing",
      value: needsResourcingMembers.length > 0 ? renderMemberAvatars(needsResourcingMembers) : (
        <span className="text-xs text-gray-600">All well utilized</span>
      ),
      subtitle: "Under 60% utilization",
      badgeText: `${needsResourcingMembers.length}`,
      badgeColor: needsResourcingMembers.length > 0 ? "blue" : "green"
    }
  ];

  console.log('WeekResourceOverviewCards: Rendering with metrics:', metrics);

  return (
    <div className="scale-85 origin-top">
      <StandardizedExecutiveSummary
        metrics={metrics}
        gradientType="purple"
      />
    </div>
  );
};
