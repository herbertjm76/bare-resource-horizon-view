
import { useMemo } from 'react';
import { generateCapacityInsights } from '../utils/insightGenerators';
import { generateUtilizationInsights } from '../utils/insightGenerators';
import { generateProjectLoadInsights } from '../utils/insightGenerators';
import { generateTeamScalingInsights } from '../utils/insightGenerators';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  weekly_capacity?: number;
  job_title?: string;
}

interface UseIntelligentInsightsProps {
  teamMembers: TeamMember[];
  activeProjects: number;
  utilizationRate: number;
}

export const useIntelligentInsights = ({
  teamMembers,
  activeProjects,
  utilizationRate
}: UseIntelligentInsightsProps) => {
  const insights = useMemo(() => {
    const allInsights = [
      ...generateUtilizationInsights(utilizationRate, teamMembers.length),
      ...generateCapacityInsights(teamMembers, utilizationRate),
      ...generateProjectLoadInsights(activeProjects, teamMembers.length, utilizationRate),
      ...generateTeamScalingInsights(teamMembers.length, utilizationRate, activeProjects)
    ];

    // Sort by severity and return top insights
    const priorityOrder = { 'critical': 4, 'warning': 3, 'info': 2, 'success': 1 };
    
    return allInsights
      .sort((a, b) => (priorityOrder[b.severity as keyof typeof priorityOrder] || 0) - (priorityOrder[a.severity as keyof typeof priorityOrder] || 0))
      .slice(0, 6); // Limit to 6 most important insights
  }, [teamMembers, activeProjects, utilizationRate]);

  return { insights };
};
