
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

  const weekEnd = addDays(weekStartDate, 6);
  const weekLabel = `${format(weekStartDate, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;

  const metrics = [
    {
      title: "Total Projects",
      value: projects.length,
      icon: TrendingUp,
      breakdowns: [
        { label: "Active", value: activeProjectsCount, color: "green" },
        { label: "Planning", value: planningProjects, color: "orange" }
      ]
    },
    {
      title: "Team Utilization",
      value: `${utilizationRate}%`,
      icon: Clock,
      breakdowns: [
        { label: "Allocated", value: `${totalAllocatedHours}h`, color: "blue" },
        { label: "Available", value: `${availableHours}h`, color: "green" }
      ]
    },
    {
      title: "Team Members",
      value: members.length,
      icon: Users,
      breakdowns: [
        { label: "Capacity", value: `${totalCapacity}h`, color: "blue" },
        { label: "Week", value: weekLabel.split(' - ')[0], color: "green" }
      ]
    },
    {
      title: "Resource Status",
      value: utilizationRate > 85 ? "High Load" : "Available",
      icon: CheckCircle,
      breakdowns: [
        { label: "Utilization", value: `${utilizationRate}%`, color: utilizationRate > 85 ? "red" : "green" },
        { label: "Projects per person", value: members.length > 0 ? (activeProjectsCount / members.length).toFixed(1) : "0", color: "blue" }
      ],
      badgeText: utilizationRate > 90 ? `${utilizationRate}%` : undefined,
      badgeColor: "red"
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
