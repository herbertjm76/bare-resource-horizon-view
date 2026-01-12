
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek, subWeeks, addWeeks } from 'date-fns';

export interface UnifiedMemberInsights {
  utilizationInsights: UtilizationInsight[];
  projectLoadInsights: ProjectLoadInsight[];
  capacityInsights: CapacityInsight[];
  trendInsights: TrendInsight[];
}

export interface UtilizationInsight {
  type: 'warning' | 'success' | 'info' | 'critical';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  metric: string;
  icon: string;
}

export interface ProjectLoadInsight {
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  metric: string;
  icon: string;
}

export interface CapacityInsight {
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  metric: string;
  icon: string;
}

export interface TrendInsight {
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  metric: string;
  icon: string;
}

export interface MemberUtilizationData {
  days7: number;
  days30: number;
  days90: number;
}

export interface MemberProjectData {
  activeProjectsCount: number;
  futureWeeksAllocated: number;
  averageWeeklyHours: number;
}

export class UnifiedInsightsService {
  /**
   * Fetch comprehensive member data from database for insights calculation
   */
  static async fetchMemberData(memberId: string, companyId: string, weeklyCapacity: number = 40) {
    const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const fourWeeksAgo = subWeeks(currentWeekStart, 4);
    const twelveWeeksAgo = subWeeks(currentWeekStart, 12);
    const fourWeeksOut = addWeeks(currentWeekStart, 4);

    // Fetch all allocation data in one query
    // RULEBOOK: ALL allocation reads include both active and pre_registered
    const { data: allocations, error } = await supabase
      .from('project_resource_allocations')
      .select('hours, week_start_date, project:projects(id, name, status)')
      .eq('resource_id', memberId)
      .eq('company_id', companyId)
      .in('resource_type', ['active', 'pre_registered'])
      .gte('week_start_date', format(twelveWeeksAgo, 'yyyy-MM-dd'))
      .lte('week_start_date', format(fourWeeksOut, 'yyyy-MM-dd'));

    if (error) throw error;

    return {
      allocations: allocations || [],
      currentWeekStart,
      fourWeeksAgo,
      twelveWeeksAgo,
      fourWeeksOut,
      weeklyCapacity
    };
  }

  /**
   * Calculate utilization metrics from allocation data
   */
  static calculateUtilizationMetrics(
    allocations: any[],
    currentWeekStart: Date,
    fourWeeksAgo: Date,
    twelveWeeksAgo: Date,
    weeklyCapacity: number
  ): MemberUtilizationData {
    const calculatePeriodUtilization = (startDate: Date, weeksCount: number) => {
      const periodAllocations = allocations.filter(allocation => {
        const allocationDate = new Date(allocation.week_start_date);
        return allocationDate >= startDate && allocationDate <= currentWeekStart;
      });
      
      const totalHours = periodAllocations.reduce((sum, allocation) => 
        sum + (allocation.hours || 0), 0
      );
      
      const totalCapacity = weeklyCapacity * weeksCount;
      return totalCapacity > 0 ? Math.round((totalHours / totalCapacity) * 100) : 0;
    };

    return {
      days7: calculatePeriodUtilization(currentWeekStart, 1),
      days30: calculatePeriodUtilization(fourWeeksAgo, 4),
      days90: calculatePeriodUtilization(twelveWeeksAgo, 12)
    };
  }

  /**
   * Calculate project-related metrics from allocation data
   */
  static calculateProjectMetrics(allocations: any[], currentWeekStart: Date): MemberProjectData {
    // Get unique active projects
    const activeProjects = new Set();
    let futureWeeksAllocated = 0;
    let totalFutureHours = 0;

    allocations.forEach(allocation => {
      const allocationDate = new Date(allocation.week_start_date);
      
      if (allocation.project && allocation.project.status === 'active') {
        activeProjects.add(allocation.project.id);
      }
      
      if (allocationDate >= currentWeekStart) {
        futureWeeksAllocated++;
        totalFutureHours += (allocation.hours || 0);
      }
    });

    const averageWeeklyHours = futureWeeksAllocated > 0 ? totalFutureHours / Math.max(futureWeeksAllocated / activeProjects.size || 1, 1) : 0;

    return {
      activeProjectsCount: activeProjects.size,
      futureWeeksAllocated,
      averageWeeklyHours
    };
  }

  /**
   * Generate utilization insights based on calculated metrics
   */
  static generateUtilizationInsights(utilization: MemberUtilizationData): UtilizationInsight[] {
    const insights: UtilizationInsight[] = [];

    // Current week utilization insights
    if (utilization.days7 > 100) {
      insights.push({
        type: 'warning',
        icon: 'alert-triangle',
        title: 'Overallocation Alert',
        description: `Currently allocated ${utilization.days7}% - consider redistributing workload`,
        priority: 'high',
        metric: `${utilization.days7}% this week`
      });
    } else if (utilization.days7 < 50) {
      insights.push({
        type: 'info',
        icon: 'trending-up',
        title: 'Capacity Available',
        description: `Only ${utilization.days7}% utilized - opportunity for additional projects`,
        priority: 'medium',
        metric: `${100 - utilization.days7}% available capacity`
      });
    } else if (utilization.days7 >= 75 && utilization.days7 <= 90) {
      insights.push({
        type: 'success',
        icon: 'check-circle',
        title: 'Optimal Utilization',
        description: `Well-balanced at ${utilization.days7}% - maintaining healthy workload`,
        priority: 'low',
        metric: `${utilization.days7}% optimal range`
      });
    }

    return insights;
  }

  /**
   * Generate trend insights based on utilization changes
   */
  static generateTrendInsights(utilization: MemberUtilizationData): TrendInsight[] {
    const insights: TrendInsight[] = [];
    const trend = utilization.days7 - utilization.days90;

    if (Math.abs(trend) > 20) {
      insights.push({
        type: trend > 0 ? 'warning' : 'info',
        icon: 'trending-up',
        title: trend > 0 ? 'Utilization Spike' : 'Utilization Drop',
        description: `${Math.abs(trend)}% ${trend > 0 ? 'increase' : 'decrease'} from quarterly average`,
        priority: 'medium',
        metric: `${Math.abs(trend)}% change from 90-day average`
      });
    }

    return insights;
  }

  /**
   * Generate project load insights
   */
  static generateProjectLoadInsights(
    projectData: MemberProjectData, 
    weeklyCapacity: number
  ): ProjectLoadInsight[] {
    const insights: ProjectLoadInsight[] = [];

    if (projectData.activeProjectsCount > 5) {
      insights.push({
        type: 'warning',
        icon: 'calendar',
        title: 'High Project Load',
        description: `Managing ${projectData.activeProjectsCount} projects - monitor for context switching`,
        priority: 'medium',
        metric: `${projectData.activeProjectsCount} active projects`
      });
    } else if (projectData.activeProjectsCount === 0) {
      insights.push({
        type: 'info',
        icon: 'calendar',
        title: 'No Active Projects',
        description: 'Available for new project assignments',
        priority: 'low',
        metric: 'No current allocations'
      });
    }

    return insights;
  }

  /**
   * Generate capacity insights
   */
  static generateCapacityInsights(
    utilization: MemberUtilizationData,
    projectData: MemberProjectData,
    weeklyCapacity: number
  ): CapacityInsight[] {
    const insights: CapacityInsight[] = [];
    const availableHours = weeklyCapacity * (1 - utilization.days7 / 100);

    if (availableHours > 20) {
      insights.push({
        type: 'info',
        icon: 'clock',
        title: 'Significant Capacity Available',
        description: `${Math.round(availableHours)} hours available this week for new assignments`,
        priority: 'medium',
        metric: `${Math.round(availableHours)} hours available`
      });
    } else if (availableHours < 5 && availableHours > 0) {
      insights.push({
        type: 'warning',
        icon: 'clock',
        title: 'Limited Capacity',
        description: `Only ${Math.round(availableHours)} hours available - approaching full utilization`,
        priority: 'medium',
        metric: `${Math.round(availableHours)} hours remaining`
      });
    }

    return insights;
  }

  /**
   * Main method to generate all insights for a member
   */
  static async generateMemberInsights(
    memberId: string, 
    companyId: string, 
    weeklyCapacity: number = 40
  ): Promise<UnifiedMemberInsights> {
    try {
      // Fetch all data from database
      const memberData = await this.fetchMemberData(memberId, companyId, weeklyCapacity);
      
      // Calculate metrics
      const utilization = this.calculateUtilizationMetrics(
        memberData.allocations,
        memberData.currentWeekStart,
        memberData.fourWeeksAgo,
        memberData.twelveWeeksAgo,
        weeklyCapacity
      );

      const projectData = this.calculateProjectMetrics(
        memberData.allocations,
        memberData.currentWeekStart
      );

      // Generate insights
      const utilizationInsights = this.generateUtilizationInsights(utilization);
      const trendInsights = this.generateTrendInsights(utilization);
      const projectLoadInsights = this.generateProjectLoadInsights(projectData, weeklyCapacity);
      const capacityInsights = this.generateCapacityInsights(utilization, projectData, weeklyCapacity);

      return {
        utilizationInsights,
        projectLoadInsights,
        capacityInsights,
        trendInsights
      };
    } catch (error) {
      console.error('Error generating member insights:', error);
      return {
        utilizationInsights: [],
        projectLoadInsights: [],
        capacityInsights: [],
        trendInsights: []
      };
    }
  }
}
