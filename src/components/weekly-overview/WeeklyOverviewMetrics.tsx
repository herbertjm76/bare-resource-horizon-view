
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useProjects } from '@/hooks/useProjects';
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import { format, startOfWeek } from 'date-fns';

interface WeeklyOverviewMetricsProps {
  selectedWeek: Date;
}

export const useWeeklyOverviewMetrics = ({ selectedWeek }: WeeklyOverviewMetricsProps) => {
  // Get data for summary
  const { teamMembers } = useTeamMembersData(true);
  const { projects } = useProjects();

  // Get Monday of the current week
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });

  // Calculate metrics for the weekly overview
  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const completedProjects = projects.filter(p => p.status === 'Complete').length;
  const planningProjects = projects.filter(p => p.status === 'Planning').length;
  const totalCapacity = teamMembers.reduce((total, member) => total + (member.weekly_capacity || 40), 0);
  const averageUtilization = 75; // This would come from actual allocation data
  
  // Calculate total allocated hours (estimated)
  const estimatedAllocatedHours = Math.round(totalCapacity * (averageUtilization / 100));
  const availableHours = Math.max(0, totalCapacity - estimatedAllocatedHours);

  const metrics = [
    {
      title: "Team Utilization",
      value: `${averageUtilization}%`,
      icon: Clock,
      breakdowns: [
        { label: "Allocated", value: `${estimatedAllocatedHours}h`, color: "blue" },
        { label: "Available", value: `${availableHours}h`, color: "green" }
      ]
    },
    {
      title: "Available Capacity", 
      value: `${availableHours}h`,
      icon: CheckCircle,
      breakdowns: [
        { label: "Total Capacity", value: `${totalCapacity}h`, color: "blue" },
        { label: "Week", value: format(weekStart, 'MMM d'), color: "green" }
      ]
    },
    {
      title: "Active Projects",
      value: activeProjects,
      icon: TrendingUp,
      breakdowns: [
        { label: "Planning", value: planningProjects, color: "orange" },
        { label: "Completed", value: completedProjects, color: "green" }
      ]
    },
    {
      title: "Team Members",
      value: teamMembers.length,
      icon: Users,
      breakdowns: [
        { label: "Projects per person", value: teamMembers.length > 0 ? (activeProjects / teamMembers.length).toFixed(1) : "0", color: "blue" },
        { label: "Avg load", value: `${averageUtilization}%`, color: averageUtilization > 85 ? "red" : "green" }
      ],
      badgeText: averageUtilization > 90 ? "High Load" : undefined,
      badgeColor: "red"
    }
  ];

  return { metrics };
};
