
import { InsightItem, TeamMember } from '../types';

export const generateUtilizationInsights = (
  utilizationRate: number,
  teamSize: number,
  navigate: (path: string) => void
): InsightItem[] => {
  const insights: InsightItem[] = [];
  const averageCapacity = 40; // Default capacity
  
  if (utilizationRate < 60) {
    insights.push({
      title: "Low Team Utilization",
      description: `Team is ${utilizationRate}% utilized. Consider taking on more projects.`,
      severity: 'medium',
      actionLabel: "View Capacity",
      onAction: () => navigate('/resources'),
      metric: `${utilizationRate}%`,
      icon: { name: 'trending-up', className: 'h-4 w-4 text-orange-500' }
    });
  } else if (utilizationRate > 90) {
    insights.push({
      title: "Team Overutilization",
      description: `${utilizationRate}% utilization may lead to burnout. Consider hiring.`,
      severity: 'critical',
      actionLabel: "Plan Hiring",
      onAction: () => navigate('/team-members'),
      metric: `${utilizationRate}%`,
      icon: { name: 'alert-triangle', className: 'h-4 w-4 text-red-500' }
    });
  }

  // Capacity buffer warning
  const totalWeeklyCapacity = teamSize * averageCapacity;
  const availableCapacity = totalWeeklyCapacity * (1 - utilizationRate / 100);
  
  if (availableCapacity < 80 && utilizationRate > 80) {
    insights.push({
      title: "Limited Buffer",
      description: `Only ${Math.round(availableCapacity)}h weekly capacity remaining.`,
      severity: 'high',
      actionLabel: "View Planning",
      onAction: () => navigate('/workload'),
      metric: `${Math.round(availableCapacity)}h available`,
      icon: { name: 'calendar', className: 'h-4 w-4 text-red-400' }
    });
  }

  return insights;
};

export const generateProjectLoadInsights = (
  activeProjects: number,
  teamSize: number,
  navigate: (path: string) => void
): InsightItem[] => {
  const insights: InsightItem[] = [];
  const projectsPerPerson = activeProjects / teamSize;
  
  if (projectsPerPerson > 3) {
    insights.push({
      title: "High Project Load",
      description: `${projectsPerPerson.toFixed(1)} projects per person may impact focus.`,
      severity: 'high',
      actionLabel: "Review Projects",
      onAction: () => navigate('/projects'),
      metric: `${projectsPerPerson.toFixed(1)} proj/person`,
      icon: { name: 'briefcase', className: 'h-4 w-4 text-orange-600' }
    });
  }

  return insights;
};

export const generateTeamScalingInsights = (
  teamSize: number,
  activeProjects: number,
  navigate: (path: string) => void
): InsightItem[] => {
  const insights: InsightItem[] = [];
  
  if (teamSize < 5 && activeProjects > 10) {
    insights.push({
      title: "Consider Expansion",
      description: `${activeProjects} projects with ${teamSize} members suggests need for hiring.`,
      severity: 'medium',
      actionLabel: "Hiring Guide",
      onAction: () => navigate('/team-members'),
      metric: `${teamSize} members`,
      icon: { name: 'users', className: 'h-4 w-4 text-blue-500' }
    });
  }

  return insights;
};

export const generateOptimalInsights = (utilizationRate: number): InsightItem[] => {
  const insights: InsightItem[] = [];
  
  if (utilizationRate >= 70 && utilizationRate <= 85) {
    insights.push({
      title: "Optimal Utilization",
      description: "Team operating at ideal utilization rate.",
      severity: 'low',
      metric: `${utilizationRate}%`,
      icon: { name: 'target', className: 'h-4 w-4 text-green-500' }
    });
  }

  return insights;
};
