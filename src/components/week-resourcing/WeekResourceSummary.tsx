
import React from 'react';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

  // Find overloaded members (more than 100% capacity)
  const overloadedMembers = members.filter(member => {
    const memberAllocations = allocations.filter(a => a.resource_id === member.id);
    const memberTotal = memberAllocations.reduce((sum, a) => sum + a.hours, 0);
    const memberCapacity = member.weekly_capacity || 40;
    const memberUtilization = memberCapacity > 0 ? (memberTotal / memberCapacity) * 100 : 0;
    return memberUtilization > 100;
  });

  const renderMemberAvatars = (memberList: any[], maxShow: number = 4) => {
    const membersToShow = memberList.slice(0, maxShow);
    const remainingCount = memberList.length - maxShow;

    if (memberList.length === 0) {
      return <span className="text-sm text-white/80">All balanced</span>;
    }

    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {membersToShow.map((member) => (
            <Avatar key={member.id} className="h-6 w-6">
              <AvatarFallback className="text-xs bg-white/20 text-white">
                {member.first_name?.charAt(0) || '?'}{member.last_name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        {remainingCount > 0 && (
          <Badge variant="secondary" className="text-xs bg-white/20 text-white">
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
      title: "Needs Attention",
      value: underUtilizedMembers.length + overloadedMembers.length > 0 ? 
        renderMemberAvatars([...underUtilizedMembers, ...overloadedMembers]) : 
        <span className="text-sm text-white/80">All balanced</span>,
      subtitle: `${underUtilizedMembers.length} under-utilized, ${overloadedMembers.length} overloaded`,
      badgeText: `${underUtilizedMembers.length + overloadedMembers.length}`,
      badgeColor: underUtilizedMembers.length + overloadedMembers.length > 0 ? "red" : "green"
    }
  ];

  return (
    <StandardizedExecutiveSummary
      metrics={metrics}
      gradientType="purple"
    />
  );
};
