
import { AlertTriangle, CheckCircle, TrendingUp, Target } from 'lucide-react';
import { InsightData } from '../types';

export const getUtilizationInsights = (utilizationRate: number): InsightData[] => {
  const insights: InsightData[] = [];
  
  if (utilizationRate > 95) {
    insights.push({
      title: "Critical Over-Utilization",
      description: `At ${utilizationRate}% utilization, your team is severely over-allocated. Immediate action required to prevent burnout and quality issues.`,
      type: "critical",
      icon: AlertTriangle,
      priority: 1,
      category: "Resource Management"
    });
  } else if (utilizationRate > 85) {
    insights.push({
      title: "Team Near Capacity",
      description: `${utilizationRate}% utilization indicates your team is approaching maximum capacity. Consider redistributing workload or planning for additional resources.`,
      type: "warning",
      icon: AlertTriangle,
      priority: 2,
      category: "Resource Management"
    });
  } else if (utilizationRate >= 70 && utilizationRate <= 85) {
    insights.push({
      title: "Optimal Team Efficiency",
      description: `Your team is operating at an ideal ${utilizationRate}% utilization rate, balancing productivity with sustainable workload.`,
      type: "success",
      icon: CheckCircle,
      priority: 3,
      category: "Performance"
    });
  } else if (utilizationRate < 50) {
    insights.push({
      title: "Significant Available Capacity",
      description: `At ${utilizationRate}% utilization, you have substantial capacity for new projects, strategic initiatives, or professional development.`,
      type: "info",
      icon: TrendingUp,
      priority: 2,
      category: "Growth Opportunity"
    });
  } else if (utilizationRate < 65) {
    insights.push({
      title: "Moderate Underutilization",
      description: `${utilizationRate}% utilization suggests room for taking on additional work or investing in skill development and innovation.`,
      type: "info",
      icon: Target,
      priority: 3,
      category: "Optimization"
    });
  }
  
  return insights;
};
