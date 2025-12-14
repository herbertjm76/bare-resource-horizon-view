
import { Clock, Calendar } from 'lucide-react';
import { TimeRange } from '../../TimeRangeSelector';
import { InsightData } from '../types';

export const getTimeBasedInsights = (
  selectedTimeRange: TimeRange, 
  utilizationRate: number
): InsightData[] => {
  const insights: InsightData[] = [];
  
  if (selectedTimeRange === 'week' && utilizationRate > 90) {
    insights.push({
      title: "Weekly Sprint Risk",
      description: `This week's ${utilizationRate}% utilization may indicate unsustainable pace. Monitor team wellbeing and consider workload adjustments.`,
      type: "warning",
      icon: Clock,
      priority: 2,
      category: "Short-term Planning"
    });
  } else if (selectedTimeRange === '3months' && utilizationRate < 65) {
    insights.push({
      title: "Quarterly Growth Potential",
      description: `Quarter-to-date utilization of ${utilizationRate}% indicates significant opportunity for business expansion and revenue growth.`,
      type: "info",
      icon: Calendar,
      priority: 2,
      category: "Strategic Growth"
    });
  }
  
  return insights;
};
