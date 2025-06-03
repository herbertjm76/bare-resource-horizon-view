
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnnualLeaveInsights } from '@/hooks/useAnnualLeaveInsights';
import { TeamMember, InsightItem } from '../types';
import { 
  generateUtilizationInsights,
  generateProjectLoadInsights,
  generateTeamScalingInsights,
  generateOptimalInsights
} from '../utils/insightGenerators';
import { generateLeaveInsights } from '../utils/leaveInsightGenerators';

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
  const navigate = useNavigate();
  const { insights: leaveInsights } = useAnnualLeaveInsights(teamMembers);
  
  const insights = useMemo(() => {
    const allInsights: InsightItem[] = [];
    const teamSize = teamMembers.length;
    
    // Annual Leave Insights (prioritized)
    allInsights.push(...generateLeaveInsights(leaveInsights, teamSize, navigate));
    
    // Utilization analysis
    allInsights.push(...generateUtilizationInsights(utilizationRate, teamSize, navigate));

    // Project to team ratio analysis
    allInsights.push(...generateProjectLoadInsights(activeProjects, teamSize, navigate));

    // Team size recommendations
    allInsights.push(...generateTeamScalingInsights(teamSize, activeProjects, navigate));

    // Optimal utilization
    allInsights.push(...generateOptimalInsights(utilizationRate));

    return allInsights;
  }, [teamMembers, activeProjects, utilizationRate, leaveInsights, navigate]);

  return { insights };
};
