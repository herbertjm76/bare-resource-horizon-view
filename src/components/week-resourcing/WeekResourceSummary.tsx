import React from 'react';
import { StandardizedExecutiveSummary } from '@/components/dashboard/StandardizedExecutiveSummary';
import { format, addDays } from 'date-fns';
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';

interface WeekResourceSummaryProps {
  projects: any[];
  members: any[];
  allocations: any[];
  weekStartDate: Date;
  summaryFormat?: 'simple' | 'detailed';
}

export const WeekResourceSummary: React.FC<WeekResourceSummaryProps> = ({
  projects,
  members,
  allocations,
  weekStartDate,
  summaryFormat = 'simple'
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

  // Count completed and planning projects
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const planningProjects = projects.filter(p => p.status === 'Planning').length;

  const metrics = [
    {
      title: "Total Projects",
      value: projects.length,
      icon: TrendingUp,
      subtitle: `${activeProjectsCount} active this week`,
      isGood: activeProjectsCount > 0
    },
    {
      title: "Team Utilization",
      value: `${utilizationRate}%`,
      icon: Clock,
      subtitle: `${totalAllocatedHours}h allocated`,
      badgeText: utilizationRate > 90 ? "High Load" : utilizationRate < 50 ? "Available" : "Optimal",
      badgeColor: utilizationRate > 90 ? "red" : utilizationRate < 50 ? "blue" : "green",
      isGood: utilizationRate >= 70 && utilizationRate <= 85
    },
    {
      title: "Team Members",
      value: members.length,
      icon: Users,
      subtitle: `${totalCapacity}h capacity`,
      isGood: members.length > 0
    },
    {
      title: "Available Hours",
      value: `${availableHours}h`,
      icon: CheckCircle,
      subtitle: "This week",
      badgeText: availableHours === 0 ? "Fully Booked" : undefined,
      badgeColor: availableHours === 0 ? "orange" : undefined,
      isGood: availableHours > 0
    }
  ];

  return (
    <div className="mb-6">
      <StandardizedExecutiveSummary
        metrics={metrics}
        gradientType="purple"
        cardFormat={summaryFormat}
      />
    </div>
  );
};
