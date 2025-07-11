import { AIInsight } from './aiInsightsService';

export interface AISummaryData {
  utilizationTrend: 'improving' | 'declining' | 'stable';
  capacityStatus: 'overloaded' | 'optimized' | 'underutilized';
  criticalInsights: number;
  topRecommendation: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export class AISummaryService {
  static generateSummaryFromInsights(insights: AIInsight[]): AISummaryData {
    if (!insights || insights.length === 0) {
      return {
        utilizationTrend: 'stable',
        capacityStatus: 'optimized',
        criticalInsights: 0,
        topRecommendation: 'Continue current operations',
        riskLevel: 'low'
      };
    }

    // Count critical insights
    const criticalInsights = insights.filter(i => i.priority === 'critical').length;
    const warningInsights = insights.filter(i => i.priority === 'warning').length;

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (criticalInsights > 0) {
      riskLevel = 'high';
    } else if (warningInsights > 1) {
      riskLevel = 'medium';
    }

    // Find utilization-related insights to determine trend
    const utilizationInsights = insights.filter(i => 
      i.type === 'utilization' || 
      i.category === 'Resource Management' ||
      i.description.toLowerCase().includes('utilization')
    );

    let utilizationTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (utilizationInsights.length > 0) {
      const hasPositive = utilizationInsights.some(i => i.priority === 'success' || i.priority === 'opportunity');
      const hasNegative = utilizationInsights.some(i => i.priority === 'critical' || i.priority === 'warning');
      
      if (hasPositive && !hasNegative) {
        utilizationTrend = 'improving';
      } else if (hasNegative && !hasPositive) {
        utilizationTrend = 'declining';
      }
    }

    // Determine capacity status from insights
    const capacityInsights = insights.filter(i => 
      i.type === 'capacity' || 
      i.description.toLowerCase().includes('capacity') ||
      i.description.toLowerCase().includes('overload') ||
      i.description.toLowerCase().includes('underutilized')
    );

    let capacityStatus: 'overloaded' | 'optimized' | 'underutilized' = 'optimized';
    if (capacityInsights.length > 0) {
      const overloadedInsights = capacityInsights.filter(i => 
        i.description.toLowerCase().includes('overload') ||
        i.description.toLowerCase().includes('over capacity') ||
        i.priority === 'critical'
      );
      
      const underutilizedInsights = capacityInsights.filter(i => 
        i.description.toLowerCase().includes('underutilized') ||
        i.description.toLowerCase().includes('under capacity')
      );

      if (overloadedInsights.length > 0) {
        capacityStatus = 'overloaded';
      } else if (underutilizedInsights.length > 0) {
        capacityStatus = 'underutilized';
      }
    }

    // Get top recommendation (highest priority insight's recommendation)
    const topPriorityInsight = insights.find(i => i.priority === 'critical') || 
                               insights.find(i => i.priority === 'warning') ||
                               insights[0];

    const topRecommendation = topPriorityInsight?.recommendation || 'Continue monitoring team performance';

    return {
      utilizationTrend,
      capacityStatus,
      criticalInsights,
      topRecommendation,
      riskLevel
    };
  }

  static getUtilizationTrendText(trend: string): string {
    switch (trend) {
      case 'improving': return 'Improving';
      case 'declining': return 'Declining';
      case 'stable': return 'Stable';
      default: return 'Unknown';
    }
  }

  static getCapacityStatusText(status: string): string {
    switch (status) {
      case 'overloaded': return 'Overloaded';
      case 'optimized': return 'Optimized';
      case 'underutilized': return 'Underutilized';
      default: return 'Unknown';
    }
  }

  static getRiskLevelColor(riskLevel: string): string {
    switch (riskLevel) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  }

  static getCapacityStatusColor(status: string): string {
    switch (status) {
      case 'overloaded': return 'red';
      case 'optimized': return 'green';
      case 'underutilized': return 'blue';
      default: return 'gray';
    }
  }
}