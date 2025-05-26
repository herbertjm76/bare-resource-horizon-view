
import React from 'react';
import { CompactInsightCard } from './CompactInsightCard';
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
        description: `Team is ${utilizationRate}% utilized. Consider taking on more projects.`,
        severity: 'medium' as const,
        actionLabel: "View Capacity",
        onAction: () => navigate('/resources'),
        metric: `${utilizationRate}%`,
        icon: <TrendingUp className="h-4 w-4 text-orange-500" />
      });
    } else if (utilizationRate > 90) {
      insights.push({
        title: "Team Overutilization",
        description: `${utilizationRate}% utilization may lead to burnout. Consider hiring.`,
        severity: 'critical' as const,
        actionLabel: "Plan Hiring",
        onAction: () => navigate('/team-members'),
        metric: `${utilizationRate}%`,
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />
      });
    }

    // Project to team ratio analysis
    const projectsPerPerson = activeProjects / teamSize;
    if (projectsPerPerson > 3) {
      insights.push({
        title: "High Project Load",
        description: `${projectsPerPerson.toFixed(1)} projects per person may impact focus.`,
        severity: 'high' as const,
        actionLabel: "Review Projects",
        onAction: () => navigate('/projects'),
        metric: `${projectsPerPerson.toFixed(1)} proj/person`,
        icon: <Briefcase className="h-4 w-4 text-orange-600" />
      });
    }

    // Team size recommendations
    if (teamSize < 5 && activeProjects > 10) {
      insights.push({
        title: "Consider Expansion",
        description: `${activeProjects} projects with ${teamSize} members suggests need for hiring.`,
        severity: 'medium' as const,
        actionLabel: "Hiring Guide",
        onAction: () => navigate('/team-members'),
        metric: `${teamSize} members`,
        icon: <Users className="h-4 w-4 text-blue-500" />
      });
    }

    // Optimal utilization
    if (utilizationRate >= 70 && utilizationRate <= 85) {
      insights.push({
        title: "Optimal Utilization",
        description: "Team operating at ideal utilization rate.",
        severity: 'low' as const,
        metric: `${utilizationRate}%`,
        icon: <Target className="h-4 w-4 text-green-500" />
      });
    }

    // Capacity buffer warning
    const totalWeeklyCapacity = teamSize * averageCapacity;
    const availableCapacity = totalWeeklyCapacity * (1 - utilizationRate / 100);
    
    if (availableCapacity < 80 && utilizationRate > 80) {
      insights.push({
        title: "Limited Buffer",
        description: `Only ${Math.round(availableCapacity)}h weekly capacity remaining.`,
        severity: 'high' as const,
        actionLabel: "View Planning",
        onAction: () => navigate('/workload'),
        metric: `${Math.round(availableCapacity)}h available`,
        icon: <Calendar className="h-4 w-4 text-red-400" />
      });
    }

    return insights;
  };

  const insights = generateInsights();

  if (insights.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-green-900 mb-1">All Systems Running Smoothly</h3>
        <p className="text-xs text-green-700">Team utilization and project load are well-balanced.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-gray-900 mb-3">🧠 Smart Insights</h2>
      <div className="grid gap-2">
        {insights.slice(0, 3).map((insight, index) => (
          <CompactInsightCard
            key={index}
            {...insight}
          />
        ))}
      </div>
    </div>
  );
};
