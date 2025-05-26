
import React from 'react';
import { InsightCard } from './InsightCard';
import { AlertTriangle, Users, Target, TrendingUp, Calendar, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  weekly_capacity?: number;
  job_title?: string;
}

interface IntelligentInsightsProps {
  teamMembers: TeamMember[];
  activeProjects: number;
  utilizationRate: number;
}

export const IntelligentInsights: React.FC<IntelligentInsightsProps> = ({
  teamMembers,
  activeProjects,
  utilizationRate
}) => {
  const navigate = useNavigate();
  
  const generateInsights = () => {
    const insights = [];
    const teamSize = teamMembers.length;
    const averageCapacity = teamMembers.reduce((sum, member) => sum + (member.weekly_capacity || 40), 0) / teamSize;
    
    // Utilization analysis
    if (utilizationRate < 60) {
      insights.push({
        title: "Low Team Utilization",
        description: `Your team is only ${utilizationRate}% utilized. This indicates you could take on more projects or reduce team size to optimize costs.`,
        severity: 'medium' as const,
        actionLabel: "View Available Capacity",
        onAction: () => navigate('/resources'),
        metric: `${utilizationRate}%`,
        trend: 'down' as const,
        icon: <TrendingUp className="h-5 w-5 text-orange-500" />
      });
    } else if (utilizationRate > 90) {
      insights.push({
        title: "Team Overutilization",
        description: `Your team is ${utilizationRate}% utilized, which may lead to burnout and quality issues. Consider hiring or reducing project scope.`,
        severity: 'critical' as const,
        actionLabel: "Plan Hiring",
        onAction: () => navigate('/team-members'),
        metric: `${utilizationRate}%`,
        trend: 'up' as const,
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />
      });
    }

    // Project to team ratio analysis
    const projectsPerPerson = activeProjects / teamSize;
    if (projectsPerPerson > 3) {
      insights.push({
        title: "High Project Load per Person",
        description: `Each team member is handling ${projectsPerPerson.toFixed(1)} projects on average. This could impact focus and quality.`,
        severity: 'high' as const,
        actionLabel: "Review Project Assignments",
        onAction: () => navigate('/projects'),
        metric: `${projectsPerPerson.toFixed(1)} projects/person`,
        icon: <Briefcase className="h-5 w-5 text-orange-600" />
      });
    }

    // Team size recommendations
    if (teamSize < 5 && activeProjects > 10) {
      insights.push({
        title: "Consider Team Expansion",
        description: `With ${activeProjects} active projects and only ${teamSize} team members, you might benefit from strategic hiring.`,
        severity: 'medium' as const,
        actionLabel: "View Hiring Recommendations",
        onAction: () => navigate('/team-members'),
        metric: `${teamSize} members`,
        icon: <Users className="h-5 w-5 text-blue-500" />
      });
    }

    // Capacity insights
    if (utilizationRate >= 70 && utilizationRate <= 85) {
      insights.push({
        title: "Optimal Team Utilization",
        description: "Your team is operating at an ideal utilization rate. This balance allows for quality work while maintaining healthy capacity.",
        severity: 'low' as const,
        metric: `${utilizationRate}%`,
        trend: 'stable' as const,
        icon: <Target className="h-5 w-5 text-green-500" />
      });
    }

    // Upcoming capacity crunch
    const totalWeeklyCapacity = teamSize * averageCapacity;
    const availableCapacity = totalWeeklyCapacity * (1 - utilizationRate / 100);
    
    if (availableCapacity < 80 && utilizationRate > 80) {
      insights.push({
        title: "Limited Capacity Buffer",
        description: `Only ${Math.round(availableCapacity)} hours of weekly capacity remaining. New projects may strain the team.`,
        severity: 'high' as const,
        actionLabel: "View Capacity Planning",
        onAction: () => navigate('/workload'),
        metric: `${Math.round(availableCapacity)}h available`,
        icon: <Calendar className="h-5 w-5 text-red-400" />
      });
    }

    return insights;
  };

  const insights = generateInsights();

  if (insights.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <Target className="h-8 w-8 text-green-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-green-900 mb-2">All Systems Running Smoothly</h3>
        <p className="text-green-700">Your team utilization and project load are well-balanced. Keep up the great work!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">🧠 Intelligent Insights</h2>
      <div className="grid gap-4">
        {insights.map((insight, index) => (
          <InsightCard
            key={index}
            {...insight}
          />
        ))}
      </div>
    </div>
  );
};
