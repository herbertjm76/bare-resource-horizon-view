
import { createAllocationMap as createAllocationMapUtil, calculateMemberWeeklyTotals as calculateMemberWeeklyTotalsUtil } from '../utils/allocationMapUtils';
import { logger } from '@/utils/logger';

/**
 * Create allocation map from comprehensive weekly allocations
 * Updated to properly handle daily breakdown data
 */
export const createAllocationMap = (comprehensiveWeeklyAllocations: any[]): Map<string, number> => {
  return createAllocationMapUtil(comprehensiveWeeklyAllocations);
};

/**
 * Calculate member weekly totals from comprehensive allocations
 * Updated to properly handle daily breakdown data
 */
export const calculateMemberWeeklyTotals = (
  comprehensiveWeeklyAllocations: any[],
  weekStartDateString: string,
  allMembers: any[]
): Map<string, number> => {
  return calculateMemberWeeklyTotalsUtil(comprehensiveWeeklyAllocations, weekStartDateString, allMembers);
};

/**
 * Create member total function
 * This function uses the member weekly totals calculated from comprehensive allocations
 */
export const createMemberTotalFunction = (
  memberWeeklyTotals: Map<string, number>,
  comprehensiveWeeklyAllocations: any[]
) => {
  return (memberId: string): number => {
    const total = memberWeeklyTotals.get(memberId) || 0;
    logger.log(`getMemberTotal for ${memberId}: ${total}h`);
    return total;
  };
};

/**
 * Create project count function
 * Count unique projects a member is allocated to
 */
export const createProjectCountFunction = (comprehensiveWeeklyAllocations: any[]) => {
  return (memberId: string): number => {
    const projectSet = new Set<string>();
    
    comprehensiveWeeklyAllocations.forEach(allocation => {
      if (allocation.resource_id === memberId) {
        // Only count if there are actual hours allocated
        let hasHours = false;
        if (allocation.daily_breakdown && Array.isArray(allocation.daily_breakdown)) {
          hasHours = allocation.daily_breakdown.some((day: any) => parseFloat(day.hours) > 0);
        } else {
          hasHours = parseFloat(allocation.hours) > 0;
        }
        
        if (hasHours) {
          projectSet.add(allocation.project_id);
        }
      }
    });
    
    const count = projectSet.size;
    logger.log(`getProjectCount for ${memberId}: ${count} projects`);
    return count;
  };
};

/**
 * Create weekly leave function
 * This returns leave data for a specific member for the week
 */
export const createWeeklyLeaveFunction = (weeklyLeaveDetails: any) => {
  return (memberId: string): Array<{ date: string; hours: number }> => {
    const memberLeave = weeklyLeaveDetails?.[memberId] || {};
    const leaveDays: Array<{ date: string; hours: number }> = [];
    
    Object.entries(memberLeave).forEach(([date, hours]) => {
      if (parseFloat(hours as string) > 0) {
        leaveDays.push({ date, hours: parseFloat(hours as string) });
      }
    });
    
    return leaveDays;
  };
};
