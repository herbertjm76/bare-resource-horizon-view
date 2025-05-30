
import React from 'react';
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import { useWeekResourceData } from '../week-resourcing/hooks/useWeekResourceData';
import { startOfWeek } from 'date-fns';

interface WeeklyOverviewMetricsProps {
  selectedWeek: Date;
}

export const useWeeklyOverviewMetrics = ({ selectedWeek }: WeeklyOverviewMetricsProps) => {
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  
  const {
    projects,
    members,
    weekAllocations,
    isLoading,
    error
  } = useWeekResourceData({ 
    selectedWeek, 
    filters: { office: "all", searchTerm: "" } 
  });

  // Calculate total allocated hours for the week
  const totalAllocatedHours = weekAllocations?.reduce((total, allocation) => {
    return total + (allocation.hours || 0);
  }, 0) || 0;

  // Calculate total capacity for the week
  const totalCapacity = members?.reduce((total, member) => {
    return total + (member.weekly_capacity || 40);
  }, 0) || 0;

  // Calculate utilization rate
  const utilizationRate = totalCapacity > 0 ? Math.round((totalAllocatedHours / totalCapacity) * 100) : 0;

  // Calculate available hours
  const availableHours = Math.max(0, totalCapacity - totalAllocatedHours);

  // Count active projects for the week
  const activeProjectsCount = projects?.filter(project => {
    return weekAllocations?.some(allocation => allocation.project_id === project.id);
  }).length || 0;

  const metrics = [
    {
      title: "Total Projects",
      value: projects?.length || 0,
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
      value: members?.length || 0,
      icon: Users,
      subtitle: `${totalCapacity}h capacity`,
      isGood: (members?.length || 0) > 0
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

  return {
    metrics,
    isLoading,
    error
  };
};
