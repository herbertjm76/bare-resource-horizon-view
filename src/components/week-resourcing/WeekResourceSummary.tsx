
import React from 'react';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { format, addDays } from 'date-fns';

interface WeekResourceSummaryProps {
  projects: any[];
  members: any[];
  allocations: any[];
  weekStartDate: Date;
}

export const WeekResourceSummary: React.FC<WeekResourceSummaryProps> = ({
  projects,
  members,
  allocations,
  weekStartDate
}) => {
  // Calculate total allocated hours for the week
  const totalAllocatedHours = allocations.reduce((total, allocation) => {
    return total + (allocation.hours || 0);
  }, 0);

  // Calculate total capacity for the week
  const totalCapacity = members.reduce((total, member) => {
    return total + (member.weekly_capacity || 40);
  }, 0);

  // Calculate utilization rate
  const utilizationRate = totalCapacity > 0 ? Math.round((totalAllocatedHours / totalCapacity) * 100) : 0;

  // Calculate available hours
  const availableHours = Math.max(0, totalCapacity - totalAllocatedHours);

  // Count active projects for the week
  const activeProjectsCount = projects.filter(project => {
    return allocations.some(allocation => allocation.project_id === project.id);
  }).length;

  const weekEnd = addDays(weekStartDate, 6);
  const weekLabel = `${format(weekStartDate, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;

  const metrics = [
    {
      title: "Active Projects",
      value: activeProjectsCount,
      subtitle: `Week of ${weekLabel}`,
      badgeText: activeProjectsCount > 10 ? 'High Load' : 'Manageable',
      badgeColor: activeProjectsCount > 10 ? 'orange' : 'green'
    },
    {
      title: "Team Utilization",
      value: `${utilizationRate}%`,
      subtitle: `${totalAllocatedHours}h of ${totalCapacity}h`,
      badgeText: utilizationRate > 90 ? 'At Capacity' : utilizationRate > 70 ? 'Good' : 'Available',
      badgeColor: utilizationRate > 90 ? 'red' : utilizationRate > 70 ? 'green' : 'blue'
    },
    {
      title: "Available Hours",
      value: `${availableHours}h`,
      subtitle: `${members.length} team members`,
      badgeText: availableHours > 100 ? 'High Capacity' : 'Limited',
      badgeColor: availableHours > 100 ? 'green' : 'orange'
    },
    {
      title: "Resource Status",
      value: members.length,
      subtitle: "Team members",
      badgeText: utilizationRate > 85 ? 'Fully Loaded' : 'Capacity Available',
      badgeColor: utilizationRate > 85 ? 'red' : 'green'
    }
  ];

  return (
    <div className="mb-6">
      <StandardizedExecutiveSummary
        metrics={metrics}
        gradientType="purple"
      />
    </div>
  );
};
