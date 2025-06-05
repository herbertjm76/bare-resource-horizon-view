
import React from 'react';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface WeekResourceSummaryProps {
  projects: any[];
  members: any[];
  allocations: any[];
  weekStartDate: string;
}

export const WeekResourceSummary: React.FC<WeekResourceSummaryProps> = ({
  projects,
  members,
  allocations,
  weekStartDate
}) => {
  // Calculate total allocated hours
  const totalAllocatedHours = allocations.reduce((total, allocation) => {
    return total + (allocation.hours || 0);
  }, 0);

  // Calculate total capacity
  const totalCapacity = members.reduce((total, member) => {
    return total + (member.weekly_capacity || 40);
  }, 0);

  // Calculate utilization rate
  const utilizationRate = totalCapacity > 0 ? Math.round((totalAllocatedHours / totalCapacity) * 100) : 0;

  // Calculate available hours
  const availableHours = Math.max(0, totalCapacity - totalAllocatedHours);

  // Count active projects (projects with allocations)
  const activeProjectsCount = projects.filter(project => {
    return allocations.some(allocation => allocation.project_id === project.id && allocation.hours > 0);
  }).length;

  // Find underutilized members (less than 60% capacity)
  const underUtilizedMembers = members.filter(member => {
    const memberAllocations = allocations.filter(a => a.resource_id === member.id);
    const memberTotal = memberAllocations.reduce((sum, a) => sum + a.hours, 0);
    const memberCapacity = member.weekly_capacity || 40;
    const memberUtilization = memberCapacity > 0 ? (memberTotal / memberCapacity) * 100 : 0;
    return memberUtilization < 60;
  });

  // Helper to get user initials
  const getUserInitials = (member: any): string => {
    const firstName = member.first_name || '';
    const lastName = member.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper to get avatar URL safely
  const getAvatarUrl = (member: any): string | undefined => {
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  // Helper to get member display name
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
      value: `${utilizationRate}%`,
      subtitle: `${totalAllocatedHours}h of ${totalCapacity}h`,
      badgeText: utilizationRate < 70 ? 'Low' : 
                utilizationRate > 90 ? 'High' : 'Optimal',
      badgeColor: utilizationRate < 70 ? 'orange' : 
                 utilizationRate > 90 ? 'red' : 'green'
    },
    {
      title: "Available Capacity",
      value: `${availableHours}h`,
      subtitle: "This week",
      badgeText: availableHours === 0 ? "Fully Booked" : "Available",
      badgeColor: availableHours === 0 ? "orange" : "blue"
    },
    {
      title: "Needs Resourcing",
      value: underUtilizedMembers.length > 0 ? renderMemberAvatars(underUtilizedMembers) : (
        <span className="text-xs text-gray-600">All well utilized</span>
      ),
      subtitle: "Under 60% utilization",
      badgeText: `${underUtilizedMembers.length}`,
      badgeColor: underUtilizedMembers.length > 0 ? "blue" : "green"
    }
  ];

  return (
    <div className="scale-85 origin-top">
      <StandardizedExecutiveSummary
        metrics={metrics}
        gradientType="purple"
      />
    </div>
  );
};
