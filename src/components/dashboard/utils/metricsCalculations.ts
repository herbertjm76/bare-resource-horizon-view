
import { TeamMember } from '../types';
import { format, startOfWeek, endOfWeek } from 'date-fns';

export interface PageMetric {
  title: string;
  value: string | number;
  subtitle?: string;
  badgeText?: string;
  badgeColor?: string;
  isGood?: boolean;
}

// Team Members page metrics
export const calculateTeamMembersMetrics = (teamMembers: TeamMember[]): PageMetric[] => {
  const totalMembers = teamMembers.length;
  const departments = new Set(teamMembers.map(m => m.department).filter(Boolean)).size;
  const locations = new Set(teamMembers.map(m => m.location).filter(Boolean)).size;
  const activeMembers = teamMembers.filter(m => m.status === 'active').length;
  
  const activeRate = totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0;

  return [
    {
      title: "Total Members",
      value: totalMembers,
      subtitle: "Registered team members",
      badgeText: totalMembers > 20 ? 'Large Team' : totalMembers > 10 ? 'Growing' : 'Small Team',
      badgeColor: totalMembers > 20 ? 'blue' : totalMembers > 10 ? 'green' : 'orange'
    },
    {
      title: "Active Members",
      value: activeMembers,
      subtitle: `${activeRate}% active`,
      badgeText: activeRate > 85 ? 'Excellent' : activeRate > 70 ? 'Good' : 'Needs Attention',
      badgeColor: activeRate > 85 ? 'green' : activeRate > 70 ? 'blue' : 'orange'
    },
    {
      title: "Departments",
      value: departments,
      subtitle: "Active departments",
      badgeText: "Diverse",
      badgeColor: "blue"
    },
    {
      title: "Locations",
      value: locations,
      subtitle: "Office locations",
      badgeText: locations > 1 ? 'Multi-Site' : 'Single Site',
      badgeColor: locations > 1 ? 'blue' : 'green'
    }
  ];
};

// Team Annual Leave page metrics
export const calculateAnnualLeaveMetrics = (teamMembers: TeamMember[], selectedMonth: Date): PageMetric[] => {
  const totalMembers = teamMembers.length;
  const monthName = format(selectedMonth, 'MMMM');
  
  // Mock calculations - in real app these would come from leave data
  const onLeaveThisWeek = Math.floor(totalMembers * 0.15);
  const scheduledNextMonth = Math.floor(totalMembers * 0.25);
  const coverageRate = Math.round((1 - (onLeaveThisWeek / totalMembers)) * 100);
  const leaveBalance = Math.round(totalMembers * 18.5); // Average days per person

  return [
    {
      title: "On Leave This Week",
      value: onLeaveThisWeek,
      subtitle: `${Math.round((onLeaveThisWeek / totalMembers) * 100)}% of team`,
      badgeText: onLeaveThisWeek > totalMembers * 0.3 ? 'High Impact' : 'Manageable',
      badgeColor: onLeaveThisWeek > totalMembers * 0.3 ? 'orange' : 'green'
    },
    {
      title: "Scheduled Next Month",
      value: scheduledNextMonth,
      subtitle: "People with leave planned",
      badgeText: "Plan Ahead",
      badgeColor: "blue"
    },
    {
      title: "Team Coverage",
      value: `${coverageRate}%`,
      subtitle: "Available this week",
      badgeText: coverageRate > 80 ? 'Good Coverage' : coverageRate > 60 ? 'Moderate' : 'Low Coverage',
      badgeColor: coverageRate > 80 ? 'green' : coverageRate > 60 ? 'orange' : 'red'
    },
    {
      title: "Leave Balance",
      value: leaveBalance,
      subtitle: "Total days available",
      badgeText: "Balanced",
      badgeColor: "green"
    }
  ];
};

// Team Workload page metrics
export const calculateWorkloadMetrics = (teamMembers: TeamMember[], selectedWeek: Date): PageMetric[] => {
  const totalMembers = teamMembers.length;
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekLabel = format(weekStart, 'MMM d');
  
  // Mock calculations - in real app these would come from workload data
  const totalCapacity = totalMembers * 40; // 40 hours per person
  const allocatedHours = Math.floor(totalCapacity * 0.75);
  const utilizationRate = Math.round((allocatedHours / totalCapacity) * 100);
  const overallocated = Math.floor(totalMembers * 0.1);

  return [
    {
      title: "Total Capacity",
      value: `${totalCapacity}h`,
      subtitle: "Available hours this week",
      badgeText: "Full Team",
      badgeColor: "blue"
    },
    {
      title: "Allocated Hours",
      value: `${allocatedHours}h`,
      subtitle: `${utilizationRate}% utilization`,
      badgeText: utilizationRate > 85 ? 'High Load' : utilizationRate > 70 ? 'Good' : 'Underutilized',
      badgeColor: utilizationRate > 85 ? 'orange' : utilizationRate > 70 ? 'green' : 'blue'
    },
    {
      title: "Overallocated",
      value: overallocated,
      subtitle: "People over capacity",
      badgeText: overallocated > 0 ? 'Attention Needed' : 'Balanced',
      badgeColor: overallocated > 0 ? 'red' : 'green'
    },
    {
      title: "Available Hours",
      value: `${totalCapacity - allocatedHours}h`,
      subtitle: "Remaining capacity",
      badgeText: "Buffer Available",
      badgeColor: "green"
    }
  ];
};

// Weekly Overview page metrics
export const calculateWeeklyOverviewMetrics = (selectedWeek: Date): PageMetric[] => {
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });
  
  // Mock calculations - in real app these would come from resource data
  const activeProjects = 12;
  const totalResources = 25;
  const utilizationRate = 78;
  const completedTasks = 43;

  return [
    {
      title: "Active Projects",
      value: activeProjects,
      subtitle: "Projects in progress",
      badgeText: activeProjects > 10 ? 'High Volume' : 'Manageable',
      badgeColor: activeProjects > 10 ? 'blue' : 'green'
    },
    {
      title: "Team Resources",
      value: totalResources,
      subtitle: "Available this week",
      badgeText: "Full Team",
      badgeColor: "green"
    },
    {
      title: "Utilization Rate",
      value: `${utilizationRate}%`,
      subtitle: "Team capacity used",
      badgeText: utilizationRate > 85 ? 'High' : utilizationRate > 70 ? 'Optimal' : 'Low',
      badgeColor: utilizationRate > 85 ? 'orange' : utilizationRate > 70 ? 'green' : 'blue'
    },
    {
      title: "Tasks Completed",
      value: completedTasks,
      subtitle: "This week so far",
      badgeText: "On Track",
      badgeColor: "green"
    }
  ];
};
