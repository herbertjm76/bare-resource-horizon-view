
import { Users, TrendingUp } from 'lucide-react';
import { InsightData } from '../types';

export const getTeamScalingInsights = (
  teamSize: number, 
  activeProjects: number, 
  utilizationRate: number
): InsightData[] => {
  const insights: InsightData[] = [];
  
  if (teamSize <= 3 && activeProjects > 5 && utilizationRate > 80) {
    insights.push({
      title: "Small Team, High Demand",
      description: `Your lean team of ${teamSize} is managing ${activeProjects} projects at ${utilizationRate}% utilization. Consider hiring to reduce risk and improve delivery capacity.`,
      type: "warning",
      icon: Users,
      priority: 1,
      category: "Team Scaling"
    });
  } else if (teamSize > 15 && activeProjects < 8 && utilizationRate < 60) {
    insights.push({
      title: "Large Team Underutilized",
      description: `Your team of ${teamSize} members with only ${activeProjects} projects suggests potential for significant growth or optimization opportunities.`,
      type: "info",
      icon: Users,
      priority: 2,
      category: "Resource Optimization"
    });
  }
  
  if (utilizationRate > 80 && teamSize < 8) {
    insights.push({
      title: "Scaling Readiness",
      description: `High utilization with a compact team suggests readiness for strategic hiring to capture more opportunities.`,
      type: "info",
      icon: TrendingUp,
      priority: 3,
      category: "Business Growth"
    });
  }
  
  return insights;
};
