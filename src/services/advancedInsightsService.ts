
import { format, addWeeks, subWeeks, startOfWeek } from 'date-fns';

export interface AdvancedInsight {
  id: string;
  type: 'critical' | 'warning' | 'opportunity' | 'success' | 'trend';
  category: 'capacity' | 'efficiency' | 'risk' | 'growth' | 'financial' | 'team';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  metric: string;
  confidence: number; // 0-100
  timeframe: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  icon: string;
}

export interface TeamAnalytics {
  utilizationDistribution: {
    overCapacity: number;
    optimal: number;
    underUtilized: number;
  };
  capacityTrends: {
    weekOverWeek: number;
    monthOverMonth: number;
  };
  projectLoad: {
    averageProjectsPerMember: number;
    projectComplexity: 'low' | 'medium' | 'high';
    contextSwitching: number;
  };
  efficiency: {
    utilizationVariance: number;
    teamBalance: number;
    workloadDistribution: 'balanced' | 'uneven' | 'concentrated';
  };
  riskFactors: {
    burnoutRisk: number;
    capacityBuffer: number;
    skillBottlenecks: string[];
  };
}

export class AdvancedInsightsService {
  /**
   * Generate comprehensive team analytics from unified dashboard data
   */
  static analyzeTeamMetrics(data: any): TeamAnalytics {
    const { transformedStaffData, currentUtilizationRate, activeProjects, totalTeamSize } = data;
    
    // Calculate utilization distribution
    const utilizationDistribution = {
      overCapacity: transformedStaffData.filter((m: any) => (m.utilization || 0) > 90).length,
      optimal: transformedStaffData.filter((m: any) => {
        const util = m.utilization || 0;
        return util >= 70 && util <= 90;
      }).length,
      underUtilized: transformedStaffData.filter((m: any) => (m.utilization || 0) < 70).length
    };

    // Calculate capacity trends (mock data for now - would come from historical data)
    const capacityTrends = {
      weekOverWeek: Math.random() * 20 - 10, // -10 to +10%
      monthOverMonth: Math.random() * 30 - 15 // -15 to +15%
    };

    // Project load analysis with proper typing
    const avgProjectsPerMember = totalTeamSize > 0 ? activeProjects / totalTeamSize : 0;
    
    // Ensure projectComplexity is properly typed
    let projectComplexity: 'low' | 'medium' | 'high';
    if (activeProjects > totalTeamSize * 2.5) {
      projectComplexity = 'high';
    } else if (activeProjects > totalTeamSize * 1.5) {
      projectComplexity = 'medium';
    } else {
      projectComplexity = 'low';
    }

    const projectLoad = {
      averageProjectsPerMember: avgProjectsPerMember,
      projectComplexity,
      contextSwitching: activeProjects > totalTeamSize * 2 ? 85 : 
                       activeProjects > totalTeamSize ? 60 : 30
    };

    // Efficiency metrics
    const utilizations = transformedStaffData.map((m: any) => m.utilization || 0);
    const avgUtilization = utilizations.reduce((sum: number, util: number) => sum + util, 0) / utilizations.length;
    const variance = utilizations.reduce((sum: number, util: number) => sum + Math.pow(util - avgUtilization, 2), 0) / utilizations.length;
    
    // Ensure workloadDistribution is properly typed
    let workloadDistribution: 'balanced' | 'uneven' | 'concentrated';
    if (variance > 400) {
      workloadDistribution = 'uneven';
    } else if (variance > 200) {
      workloadDistribution = 'concentrated';
    } else {
      workloadDistribution = 'balanced';
    }

    const efficiency = {
      utilizationVariance: Math.sqrt(variance),
      teamBalance: 100 - Math.min(variance / 10, 100), // Higher variance = lower balance
      workloadDistribution
    };

    // Risk assessment
    const riskFactors = {
      burnoutRisk: utilizationDistribution.overCapacity / totalTeamSize * 100,
      capacityBuffer: 100 - currentUtilizationRate,
      skillBottlenecks: [] // Would analyze job titles/skills
    };

    return {
      utilizationDistribution,
      capacityTrends,
      projectLoad,
      efficiency,
      riskFactors
    };
  }

  /**
   * Generate advanced insights based on team analytics
   */
  static generateAdvancedInsights(data: any): AdvancedInsight[] {
    const analytics = this.analyzeTeamMetrics(data);
    const insights: AdvancedInsight[] = [];
    
    // Capacity Management Insights
    if (analytics.riskFactors.capacityBuffer < 15) {
      insights.push({
        id: 'capacity-risk',
        type: 'critical',
        category: 'capacity',
        priority: 'high',
        title: 'Critical Capacity Shortage',
        description: `Team operating at ${100 - analytics.riskFactors.capacityBuffer}% utilization with only ${analytics.riskFactors.capacityBuffer}% buffer remaining.`,
        impact: 'High risk of project delays and team burnout if new work is accepted.',
        recommendation: 'Consider hiring additional resources or redistributing current workload before taking on new projects.',
        metric: `${analytics.riskFactors.capacityBuffer}% capacity buffer`,
        confidence: 95,
        timeframe: 'immediate',
        icon: 'alert-triangle'
      });
    }

    // Project Load Analysis
    if (analytics.projectLoad.averageProjectsPerMember > 3) {
      insights.push({
        id: 'context-switching',
        type: 'warning',
        category: 'efficiency',
        priority: 'high',
        title: 'High Context Switching Risk',
        description: `Team members managing ${analytics.projectLoad.averageProjectsPerMember.toFixed(1)} projects each, leading to ${analytics.projectLoad.contextSwitching}% efficiency loss.`,
        impact: 'Reduced productivity and increased error rates due to frequent task switching.',
        recommendation: 'Consolidate projects or implement focused work blocks to minimize context switching.',
        metric: `${analytics.projectLoad.contextSwitching}% efficiency impact`,
        confidence: 88,
        timeframe: 'short-term',
        icon: 'refresh-cw'
      });
    }

    // Utilization Distribution Insights
    if (analytics.utilizationDistribution.overCapacity > 0) {
      insights.push({
        id: 'burnout-prevention',
        type: 'warning',
        category: 'risk',
        priority: 'high',
        title: 'Burnout Prevention Required',
        description: `${analytics.utilizationDistribution.overCapacity} team members at over 90% utilization risk burnout and quality degradation.`,
        impact: 'Potential for decreased quality, missed deadlines, and employee turnover.',
        recommendation: 'Immediately redistribute workload or provide additional support to over-utilized team members.',
        metric: `${analytics.riskFactors.burnoutRisk.toFixed(0)}% of team at risk`,
        confidence: 92,
        timeframe: 'immediate',
        icon: 'user-x'
      });
    }

    // Growth Opportunities
    if (analytics.utilizationDistribution.underUtilized > data.totalTeamSize * 0.3) {
      insights.push({
        id: 'growth-opportunity',
        type: 'opportunity',
        category: 'growth',
        priority: 'medium',
        title: 'Significant Growth Capacity Available',
        description: `${analytics.utilizationDistribution.underUtilized} team members under 70% utilization, representing ${((analytics.utilizationDistribution.underUtilized * 40 * 0.3)).toFixed(0)} hours weekly capacity.`,
        impact: 'Opportunity to increase revenue by 25-40% without additional hiring.',
        recommendation: 'Develop business development strategy to capture additional projects matching available capacity.',
        metric: `${((analytics.utilizationDistribution.underUtilized * 40 * 0.3)).toFixed(0)}h weekly available`,
        confidence: 85,
        timeframe: 'medium-term',
        icon: 'trending-up'
      });
    }

    // Team Balance Analysis
    if (analytics.efficiency.workloadDistribution === 'uneven') {
      insights.push({
        id: 'workload-imbalance',
        type: 'warning',
        category: 'efficiency',
        priority: 'medium',
        title: 'Workload Distribution Imbalance',
        description: `High utilization variance (${analytics.efficiency.utilizationVariance.toFixed(0)}%) indicates uneven work distribution across the team.`,
        impact: 'Some team members may be overwhelmed while others are underutilized, reducing overall efficiency.',
        recommendation: 'Review project assignments and redistribute work to balance utilization across team members.',
        metric: `${analytics.efficiency.teamBalance.toFixed(0)}% team balance score`,
        confidence: 78,
        timeframe: 'short-term',
        icon: 'balance-scale'
      });
    }

    // Financial Impact Insights
    const weeklyCapacity = data.totalTeamSize * 40;
    const unutilizedHours = weeklyCapacity * (analytics.riskFactors.capacityBuffer / 100);
    const potentialRevenue = unutilizedHours * 150; // Assuming $150/hour average

    if (potentialRevenue > 5000) {
      insights.push({
        id: 'revenue-opportunity',
        type: 'opportunity',
        category: 'financial',
        priority: 'medium',
        title: 'Untapped Revenue Potential',
        description: `${unutilizedHours.toFixed(0)} hours of unutilized capacity represents $${potentialRevenue.toLocaleString()} in potential weekly revenue.`,
        impact: `Potential annual revenue increase of $${(potentialRevenue * 52).toLocaleString()}.`,
        recommendation: 'Focus sales efforts on projects that match current team capacity and skill sets.',
        metric: `$${(potentialRevenue * 52).toLocaleString()} annual potential`,
        confidence: 80,
        timeframe: 'medium-term',
        icon: 'dollar-sign'
      });
    }

    // Trend Analysis
    if (Math.abs(analytics.capacityTrends.weekOverWeek) > 10) {
      const trend = analytics.capacityTrends.weekOverWeek > 0 ? 'increasing' : 'decreasing';
      insights.push({
        id: 'capacity-trend',
        type: analytics.capacityTrends.weekOverWeek > 10 ? 'warning' : 'trend',
        category: 'capacity',
        priority: 'medium',
        title: `Capacity ${trend.charAt(0).toUpperCase() + trend.slice(1)} Rapidly`,
        description: `Team utilization ${trend} by ${Math.abs(analytics.capacityTrends.weekOverWeek).toFixed(1)}% week-over-week.`,
        impact: trend === 'increasing' ? 'Approaching capacity limits faster than expected.' : 'Losing utilization and potential revenue.',
        recommendation: trend === 'increasing' ? 'Prepare scaling strategy for upcoming capacity constraints.' : 'Investigate causes of utilization drop and implement retention strategies.',
        metric: `${analytics.capacityTrends.weekOverWeek.toFixed(1)}% weekly change`,
        confidence: 70,
        timeframe: 'short-term',
        icon: trend === 'increasing' ? 'trending-up' : 'trending-down'
      });
    }

    // Sort by priority and confidence
    return insights
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return b.confidence - a.confidence;
      })
      .slice(0, 6); // Return top 6 insights
  }
}
