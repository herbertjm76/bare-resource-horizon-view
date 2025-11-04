import { WorkloadBreakdown } from '@/components/workload/hooks/types';

export interface PreparedSummaryData {
  overview: {
    totalResources: number;
    activeProjects: number;
    utilizationRate: number;
    capacityHours: number;
    timeframe: string;
  };
  utilization: {
    overloaded: number;
    underutilized: number;
    optimal: number;
    averageUtilization: number;
  };
  workload: {
    totalAllocated: number;
    totalCapacity: number;
    availableHours: number;
    demandVsCapacity: number;
  };
  trends: {
    direction: 'increasing' | 'decreasing' | 'stable';
    weeklyChange?: number;
    seasonality?: string;
  };
  risks: {
    burnoutRisk: number;
    underutilizationRisk: number;
    capacityGaps: string[];
  };
  metadata: {
    generatedAt: string;
    dataSource: string;
    confidence: number;
  };
}

export class SummaryDataPreparationService {
  static prepareExecutiveSummaryData(
    activeResources: number,
    activeProjects: number,
    utilizationRate: number,
    capacityHours?: number,
    timeRangeText?: string
  ): PreparedSummaryData {
    return {
      overview: {
        totalResources: activeResources,
        activeProjects,
        utilizationRate,
        capacityHours: capacityHours || 0,
        timeframe: timeRangeText || 'Current period'
      },
      utilization: {
        overloaded: utilizationRate > 100 ? 1 : 0,
        underutilized: utilizationRate < 60 ? 1 : 0,
        optimal: utilizationRate >= 60 && utilizationRate <= 100 ? 1 : 0,
        averageUtilization: utilizationRate
      },
      workload: {
        totalAllocated: (capacityHours || 0) * (utilizationRate / 100),
        totalCapacity: capacityHours || 0,
        availableHours: (capacityHours || 0) * (1 - utilizationRate / 100),
        demandVsCapacity: utilizationRate / 100
      },
      trends: {
        direction: this.determineTrend(utilizationRate),
        weeklyChange: 0 // TODO: Calculate from historical data
      },
      risks: {
        burnoutRisk: utilizationRate > 100 ? 80 : utilizationRate > 90 ? 40 : 10,
        underutilizationRisk: utilizationRate < 60 ? 70 : 20,
        capacityGaps: this.identifyCapacityGaps(utilizationRate, activeProjects)
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        dataSource: 'executive-summary',
        confidence: 85
      }
    };
  }

  static prepareWorkloadMetricsData(
    workloadData: Record<string, Record<string, WorkloadBreakdown>>,
    members: any[]
  ): PreparedSummaryData {
    const metrics = this.calculateWorkloadMetrics(workloadData, members);
    
    return {
      overview: {
        totalResources: members.length,
        activeProjects: this.countActiveProjects(workloadData),
        utilizationRate: metrics.utilizationRate,
        capacityHours: metrics.totalCapacity,
        timeframe: 'Current workload period'
      },
      utilization: {
        overloaded: metrics.overloadedMembers,
        underutilized: metrics.underUtilizedMembers,
        optimal: members.length - metrics.overloadedMembers - metrics.underUtilizedMembers,
        averageUtilization: metrics.utilizationRate
      },
      workload: {
        totalAllocated: metrics.totalAllocated,
        totalCapacity: metrics.totalCapacity,
        availableHours: metrics.availableHours,
        demandVsCapacity: metrics.totalAllocated / metrics.totalCapacity
      },
      trends: {
        direction: this.determineTrend(metrics.utilizationRate)
      },
      risks: {
        burnoutRisk: this.calculateBurnoutRisk(metrics),
        underutilizationRisk: this.calculateUnderutilizationRisk(metrics),
        capacityGaps: this.identifyWorkloadCapacityGaps(metrics)
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        dataSource: 'workload-metrics',
        confidence: 90
      }
    };
  }

  static prepareWeeklyResourceData(
    projects: any[],
    members: any[],
    allocations: any[],
    weekStartDate: string
  ): PreparedSummaryData {
    const activeProjects = this.countActiveProjectsFromAllocations(allocations);
    const { totalAllocated, totalCapacity, utilizationRate } = this.calculateWeeklyMetrics(
      members,
      allocations
    );

    return {
      overview: {
        totalResources: members.length,
        activeProjects,
        utilizationRate,
        capacityHours: totalCapacity,
        timeframe: `Week of ${weekStartDate}`
      },
      utilization: {
        overloaded: utilizationRate > 100 ? Math.ceil(members.length * 0.2) : 0,
        underutilized: utilizationRate < 60 ? Math.ceil(members.length * 0.3) : 0,
        optimal: members.length - Math.ceil(members.length * 0.2) - Math.ceil(members.length * 0.3),
        averageUtilization: utilizationRate
      },
      workload: {
        totalAllocated,
        totalCapacity,
        availableHours: totalCapacity - totalAllocated,
        demandVsCapacity: totalAllocated / totalCapacity
      },
      trends: {
        direction: this.determineTrend(utilizationRate)
      },
      risks: {
        burnoutRisk: utilizationRate > 100 ? 70 : 20,
        underutilizationRisk: utilizationRate < 60 ? 60 : 15,
        capacityGaps: this.identifyWeeklyCapacityGaps(allocations, totalCapacity)
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        dataSource: 'weekly-resource-summary',
        confidence: 88
      }
    };
  }


  private static calculateWorkloadMetrics(
    workloadData: Record<string, Record<string, WorkloadBreakdown>>,
    members: any[]
  ) {
    let totalCapacity = 0;
    let totalAllocated = 0;
    let overloadedMembers = 0;
    let underUtilizedMembers = 0;

    members.forEach(member => {
      const memberWorkload = workloadData[member.id] || {};
      const weeklyCapacity = member.weekly_capacity || 40;
      const allocated = Object.values(memberWorkload).reduce(
        (sum, week) => sum + (week.total || 0), 0
      );

      totalCapacity += weeklyCapacity;
      totalAllocated += allocated;

      const utilization = allocated / weeklyCapacity;
      if (utilization > 1) overloadedMembers++;
      if (utilization < 0.6) underUtilizedMembers++;
    });

    return {
      totalCapacity,
      totalAllocated,
      utilizationRate: totalCapacity > 0 ? (totalAllocated / totalCapacity) * 100 : 0,
      availableHours: totalCapacity - totalAllocated,
      overloadedMembers,
      underUtilizedMembers
    };
  }

  private static calculateWeeklyMetrics(members: any[], allocations: any[]) {
    const totalCapacity = members.reduce((sum, member) => sum + (member.weekly_capacity || 40), 0);
    const totalAllocated = allocations.reduce((sum, allocation) => sum + (allocation.hours || 0), 0);
    const utilizationRate = totalCapacity > 0 ? (totalAllocated / totalCapacity) * 100 : 0;

    return { totalAllocated, totalCapacity, utilizationRate };
  }

  private static countActiveProjects(workloadData: Record<string, Record<string, WorkloadBreakdown>>): number {
    const projectIds = new Set<string>();
    
    Object.values(workloadData).forEach(memberData => {
      Object.values(memberData).forEach(week => {
        week.projects?.forEach(project => projectIds.add(project.project_id));
      });
    });

    return projectIds.size;
  }

  private static countActiveProjectsFromAllocations(allocations: any[]): number {
    const projectIds = new Set(allocations.map(allocation => allocation.project_id));
    return projectIds.size;
  }

  private static determineTrend(utilizationRate: number): 'increasing' | 'decreasing' | 'stable' {
    // Simple heuristic - can be enhanced with historical data
    if (utilizationRate > 90) return 'increasing';
    if (utilizationRate < 60) return 'decreasing';
    return 'stable';
  }

  private static identifyCapacityGaps(utilizationRate: number, activeProjects: number): string[] {
    const gaps: string[] = [];
    
    if (utilizationRate > 100) {
      gaps.push('Team is overallocated - consider hiring or redistributing work');
    }
    
    if (utilizationRate < 60) {
      gaps.push('Underutilized capacity - opportunity for new projects');
    }
    
    if (activeProjects > 10) {
      gaps.push('High project count may lead to context switching inefficiencies');
    }

    return gaps;
  }

  private static identifyWorkloadCapacityGaps(metrics: any): string[] {
    const gaps: string[] = [];
    
    if (metrics.overloadedMembers > 0) {
      gaps.push(`${metrics.overloadedMembers} team members are overloaded`);
    }
    
    if (metrics.underUtilizedMembers > 0) {
      gaps.push(`${metrics.underUtilizedMembers} team members are underutilized`);
    }

    return gaps;
  }

  private static identifyWeeklyCapacityGaps(allocations: any[], totalCapacity: number): string[] {
    const gaps: string[] = [];
    const totalAllocated = allocations.reduce((sum, a) => sum + (a.hours || 0), 0);
    
    if (totalAllocated > totalCapacity) {
      gaps.push('Week is overbooked - some allocations may need adjustment');
    }

    return gaps;
  }

  private static calculateBurnoutRisk(metrics: any): number {
    return metrics.overloadedMembers > 0 ? 
      Math.min(80, metrics.overloadedMembers * 20) : 
      metrics.utilizationRate > 90 ? 40 : 10;
  }

  private static calculateUnderutilizationRisk(metrics: any): number {
    return metrics.underUtilizedMembers > 0 ? 
      Math.min(70, metrics.underUtilizedMembers * 15) : 20;
  }

  private static parseUtilizationFromTrend(trend: string): number {
    switch (trend) {
      case 'improving': return 85;
      case 'declining': return 55;
      case 'stable': return 75;
      default: return 70;
    }
  }

  private static parseCapacityFromStatus(status: string): number {
    switch (status) {
      case 'overloaded': return 120;
      case 'optimized': return 100;
      case 'underutilized': return 60;
      default: return 80;
    }
  }

  private static mapRiskLevel(riskLevel: string): number {
    switch (riskLevel) {
      case 'high': return 80;
      case 'medium': return 50;
      case 'low': return 20;
      default: return 35;
    }
  }
}