
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

export interface MemberUtilizationData {
  id: string;
  weeklyCapacity: number;
  projectHours: number;
  annualLeave: number;
  officeHolidays: number;
  otherLeave: number;
  totalAllocatedHours: number;
  availableHours: number;
  utilizationRate: number;
}

export interface TeamUtilizationSummary {
  totalTeamMembers: number;
  totalCapacity: number;
  totalAllocatedHours: number;
  totalAvailableHours: number;
  teamUtilizationRate: number;
  underUtilizedMembers: MemberUtilizationData[];
  fullyUtilizedMembers: MemberUtilizationData[];
  overUtilizedMembers: MemberUtilizationData[];
}

export class UtilizationCalculationService {
  /**
   * Calculate utilization data for a single member
   */
  static calculateMemberUtilization(
    member: any,
    projectHours: number = 0,
    annualLeave: number = 0,
    officeHolidays: number = 0,
    otherLeave: number = 0,
    defaultCapacity: number = 40
  ): MemberUtilizationData {
    const weeklyCapacity = member.weekly_capacity || defaultCapacity;
    const totalAllocatedHours = projectHours + annualLeave + officeHolidays + otherLeave;
    const availableHours = Math.max(0, weeklyCapacity - totalAllocatedHours);
    const utilizationRate = weeklyCapacity > 0 ? Math.round((totalAllocatedHours / weeklyCapacity) * 100) : 0;

    return {
      id: member.id,
      weeklyCapacity,
      projectHours,
      annualLeave,
      officeHolidays,
      otherLeave,
      totalAllocatedHours,
      availableHours,
      utilizationRate
    };
  }

  /**
   * Calculate team utilization summary
   */
  static calculateTeamUtilization(memberUtilizations: MemberUtilizationData[]): TeamUtilizationSummary {
    const totalTeamMembers = memberUtilizations.length;
    const totalCapacity = memberUtilizations.reduce((sum, member) => sum + member.weeklyCapacity, 0);
    const totalAllocatedHours = memberUtilizations.reduce((sum, member) => sum + member.totalAllocatedHours, 0);
    const totalAvailableHours = Math.max(0, totalCapacity - totalAllocatedHours);
    const teamUtilizationRate = totalCapacity > 0 ? Math.round((totalAllocatedHours / totalCapacity) * 100) : 0;

    // Categorize members by utilization
    const underUtilizedMembers = memberUtilizations.filter(member => member.utilizationRate < 70);
    const fullyUtilizedMembers = memberUtilizations.filter(member => member.utilizationRate >= 70 && member.utilizationRate <= 100);
    const overUtilizedMembers = memberUtilizations.filter(member => member.utilizationRate > 100);

    return {
      totalTeamMembers,
      totalCapacity,
      totalAllocatedHours,
      totalAvailableHours,
      teamUtilizationRate,
      underUtilizedMembers,
      fullyUtilizedMembers,
      overUtilizedMembers
    };
  }

  /**
   * Get utilization color based on rate
   */
  static getUtilizationColor(utilizationRate: number): string {
    if (utilizationRate <= 0) return 'blue';    // No utilization
    if (utilizationRate < 70) return 'orange';  // Under-utilized
    if (utilizationRate <= 85) return 'green';  // Optimal
    if (utilizationRate <= 100) return 'yellow'; // High but acceptable
    return 'red'; // Over-utilized
  }

  /**
   * Get utilization badge text
   */
  static getUtilizationBadgeText(utilizationRate: number): string {
    if (utilizationRate <= 0) return 'Available';
    if (utilizationRate < 70) return 'Under-utilized';
    if (utilizationRate <= 85) return 'Optimal';
    if (utilizationRate <= 100) return 'High Load';
    return 'Over-allocated';
  }

  /**
   * Get available hours color based on amount
   */
  static getAvailableHoursColor(availableHours: number): string {
    if (availableHours <= 0) return 'orange';   // Fully booked
    if (availableHours <= 5) return 'yellow';   // Low availability
    if (availableHours <= 10) return 'green';   // Good availability
    return 'blue'; // High availability
  }

  /**
   * Get available hours badge text
   */
  static getAvailableHoursBadgeText(availableHours: number): string {
    if (availableHours <= 0) return 'Fully Booked';
    if (availableHours <= 5) return 'Low Availability';
    if (availableHours <= 10) return 'Available';
    return 'Highly Available';
  }

  /**
   * Calculate utilization for annual leave period
   */
  static calculateAnnualLeaveUtilization(
    teamMembers: any[],
    selectedMonth: Date,
    leaveData: Record<string, Record<string, number>>
  ): TeamUtilizationSummary {
    const memberUtilizations: MemberUtilizationData[] = teamMembers.map(member => {
      const memberLeaveData = leaveData[member.id] || {};
      const totalLeaveHours = Object.values(memberLeaveData).reduce((sum, hours) => sum + hours, 0);
      
      // For annual leave, we calculate based on working days in the month
      const weeklyCapacity = member.weekly_capacity || 40;
      const monthlyCapacity = weeklyCapacity * 4; // Approximate monthly capacity
      
      return this.calculateMemberUtilization(
        member,
        0, // No project hours in annual leave view
        totalLeaveHours,
        0, // No office holidays in this calculation
        0  // No other leave in this calculation
      );
    });

    return this.calculateTeamUtilization(memberUtilizations);
  }
}
