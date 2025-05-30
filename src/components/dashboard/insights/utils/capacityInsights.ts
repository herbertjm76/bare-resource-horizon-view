
import { Clock } from 'lucide-react';
import { InsightData } from '../types';

export const getCapacityInsights = (
  utilizationRate: number, 
  teamSize: number
): InsightData[] => {
  const insights: InsightData[] = [];
  const recommendedBuffer = teamSize > 10 ? 15 : 20;
  const currentBuffer = 100 - utilizationRate;
  
  if (currentBuffer < recommendedBuffer && utilizationRate > 75) {
    insights.push({
      title: "Insufficient Capacity Buffer",
      description: `Only ${currentBuffer}% capacity buffer remaining. Recommend maintaining ${recommendedBuffer}% buffer for unexpected work and sick leave.`,
      type: "warning",
      icon: Clock,
      priority: 2,
      category: "Risk Management"
    });
  }
  
  return insights;
};
