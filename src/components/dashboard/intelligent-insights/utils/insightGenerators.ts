
import { TrendingUp, AlertTriangle, Users, Target, Calendar, Briefcase } from 'lucide-react';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  weekly_capacity?: number;
  job_title?: string;
}

interface Insight {
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  category: string;
  icon: { name: string; className: string };
  metric?: string;
}

export const generateUtilizationInsights = (utilizationRate: number, teamSize: number): Insight[] => {
  const insights: Insight[] = [];

  if (utilizationRate >= 95) {
    insights.push({
      title: 'Team Over-Capacity Alert',
      description: `Your team is operating at ${utilizationRate}% utilization, well above sustainable levels. This may lead to burnout and quality issues. Consider redistributing workload or bringing in additional resources.`,
      severity: 'critical',
      category: 'Capacity',
      icon: { name: 'alert-triangle', className: 'h-5 w-5' },
      metric: `${utilizationRate}% utilization (Target: 70-80%)`
    });
  } else if (utilizationRate >= 85) {
    insights.push({
      title: 'High Utilization Warning',
      description: `Team utilization at ${utilizationRate}% is approaching maximum capacity. Monitor closely and prepare contingency plans for upcoming projects.`,
      severity: 'warning',
      category: 'Capacity',
      icon: { name: 'trending-up', className: 'h-5 w-5' },
      metric: `${utilizationRate}% utilization`
    });
  } else if (utilizationRate >= 70) {
    insights.push({
      title: 'Optimal Team Utilization',
      description: `Excellent! Your team is operating at ${utilizationRate}% utilization, which is within the optimal range for sustainable productivity and quality delivery.`,
      severity: 'success',
      category: 'Performance',
      icon: { name: 'target', className: 'h-5 w-5' },
      metric: `${utilizationRate}% utilization (Optimal range)`
    });
  } else if (utilizationRate < 50) {
    insights.push({
      title: 'Under-Utilization Opportunity',
      description: `Team utilization at ${utilizationRate}% suggests available capacity for new projects. Consider business development initiatives or strategic planning activities.`,
      severity: 'info',
      category: 'Growth',
      icon: { name: 'trending-up', className: 'h-5 w-5' },
      metric: `${100 - utilizationRate}% available capacity`
    });
  }

  return insights;
};

export const generateCapacityInsights = (
  teamMembers: TeamMember[],
  utilizationRate: number,
  workWeekHours: number
): Insight[] => {
  const insights: Insight[] = [];
  const totalCapacity = teamMembers.reduce((sum, member) => sum + (member.weekly_capacity || workWeekHours), 0);
  const availableHours = totalCapacity * (1 - utilizationRate / 100);

  if (availableHours < workWeekHours && teamMembers.length > 0) {
    insights.push({
      title: 'Limited Available Capacity',
      description: `Only ${Math.round(availableHours)} hours of available capacity remaining this week. New project requests may require resource reallocation or timeline adjustments.`,
      severity: 'warning',
      category: 'Capacity',
      icon: { name: 'alert-triangle', className: 'h-5 w-5' },
      metric: `${Math.round(availableHours)} hours available`
    });
  } else if (availableHours > 160) {
    insights.push({
      title: 'Significant Capacity Available',
      description: `${Math.round(availableHours)} hours of available capacity suggests opportunity for new projects or strategic initiatives. Consider reaching out to prospects or advancing internal projects.`,
      severity: 'info',
      category: 'Growth',
      icon: { name: 'trending-up', className: 'h-5 w-5' },
      metric: `${Math.round(availableHours)} hours available`
    });
  }

  // Analyze team composition
  const roles = teamMembers.reduce((acc, member) => {
    const role = member.job_title || 'Team Member';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uniqueRoles = Object.keys(roles).length;
  if (uniqueRoles < 3 && teamMembers.length >= 5) {
    insights.push({
      title: 'Limited Role Diversity',
      description: `Your team has only ${uniqueRoles} distinct roles across ${teamMembers.length} members. Consider cross-training or hiring specialists to increase project versatility and reduce bottlenecks.`,
      severity: 'info',
      category: 'Team Structure',
      icon: { name: 'users', className: 'h-5 w-5' },
      metric: `${uniqueRoles} roles across ${teamMembers.length} members`
    });
  }

  return insights;
};

export const generateProjectLoadInsights = (activeProjects: number, teamSize: number, utilizationRate: number): Insight[] => {
  const insights: Insight[] = [];
  const projectsPerPerson = teamSize > 0 ? activeProjects / teamSize : 0;

  if (projectsPerPerson > 3) {
    insights.push({
      title: 'High Project-to-Staff Ratio',
      description: `With ${activeProjects} active projects across ${teamSize} team members (${projectsPerPerson.toFixed(1)} projects per person), team members may be context-switching frequently. Consider project prioritization or team expansion.`,
      severity: 'warning',
      category: 'Workload',
      icon: { name: 'briefcase', className: 'h-5 w-5' },
      metric: `${projectsPerPerson.toFixed(1)} projects per person`
    });
  } else if (projectsPerPerson < 1 && teamSize > 0) {
    insights.push({
      title: 'Low Project Volume',
      description: `${activeProjects} active projects for ${teamSize} team members suggests potential for increased project intake. This could be an opportunity for business development or strategic initiatives.`,
      severity: 'info',
      category: 'Growth',
      icon: { name: 'trending-up', className: 'h-5 w-5' },
      metric: `${projectsPerPerson.toFixed(1)} projects per person`
    });
  }

  // Analyze project concentration risk
  if (activeProjects >= 1 && activeProjects <= 3 && utilizationRate > 70) {
    insights.push({
      title: 'Project Concentration Risk',
      description: `High utilization with only ${activeProjects} active projects creates concentration risk. If a project is delayed or cancelled, it could significantly impact team utilization and revenue.`,
      severity: 'warning',
      category: 'Risk Management',
      icon: { name: 'alert-triangle', className: 'h-5 w-5' },
      metric: `${activeProjects} active projects`
    });
  }

  return insights;
};

export const generateTeamScalingInsights = (teamSize: number, utilizationRate: number, activeProjects: number): Insight[] => {
  const insights: Insight[] = [];

  // Small team with high utilization
  if (teamSize <= 5 && utilizationRate > 80) {
    insights.push({
      title: 'Small Team Scaling Opportunity',
      description: `Your ${teamSize}-person team is highly utilized at ${utilizationRate}%. Consider strategic hiring to increase capacity and reduce individual workload pressures.`,
      severity: 'info',
      category: 'Team Growth',
      icon: { name: 'users', className: 'h-5 w-5' },
      metric: `${teamSize} team members at ${utilizationRate}% utilization`
    });
  }

  // Large team with low utilization
  if (teamSize >= 15 && utilizationRate < 60) {
    insights.push({
      title: 'Team Efficiency Review Needed',
      description: `With ${teamSize} team members at ${utilizationRate}% utilization, there may be opportunities to optimize team structure or increase project intake to improve efficiency.`,
      severity: 'info',
      category: 'Efficiency',
      icon: { name: 'target', className: 'h-5 w-5' },
      metric: `${teamSize} team members, ${utilizationRate}% utilized`
    });
  }

  // Rapid growth indicators
  if (activeProjects > teamSize * 2 && utilizationRate > 75) {
    insights.push({
      title: 'Rapid Growth Management',
      description: `High project volume (${activeProjects} projects) relative to team size (${teamSize} members) with ${utilizationRate}% utilization suggests rapid growth. Ensure systems and processes can scale effectively.`,
      severity: 'warning',
      category: 'Growth Management',
      icon: { name: 'trending-up', className: 'h-5 w-5' },
      metric: `${activeProjects} projects, ${teamSize} team members`
    });
  }

  return insights;
};
