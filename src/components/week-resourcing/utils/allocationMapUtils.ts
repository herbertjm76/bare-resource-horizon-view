
import { logger } from '@/utils/logger';

/**
 * Utility functions for creating and managing allocation maps from comprehensive weekly allocations
 */

/**
 * Create allocation map from comprehensive weekly allocations
 * This function properly sums up all daily allocations for each member-project combination
 */
export const createAllocationMap = (comprehensiveWeeklyAllocations: any[]): Map<string, number> => {
  const allocationMap = new Map<string, number>();
  
  if (!comprehensiveWeeklyAllocations || comprehensiveWeeklyAllocations.length === 0) {
    logger.debug('No comprehensive weekly allocations provided to createAllocationMap');
    return allocationMap;
  }

  logger.debug('DEBUG createAllocationMap - Creating allocation map from comprehensive allocations:', comprehensiveWeeklyAllocations.length);
  logger.debug('DEBUG createAllocationMap - Raw comprehensive allocations:', comprehensiveWeeklyAllocations);

  comprehensiveWeeklyAllocations.forEach(allocation => {
    const memberId = allocation.resource_id;
    const projectId = allocation.project_id;
    const key = `${memberId}:${projectId}`;
    
    // Sum up ALL daily allocations for this member-project combination
    let totalHours = 0;
    
    // Check if this allocation has daily_breakdown data
    if (allocation.daily_breakdown && Array.isArray(allocation.daily_breakdown)) {
      allocation.daily_breakdown.forEach((day: any) => {
        const dayHours = parseFloat(day.hours) || 0;
        totalHours += dayHours;
      });
      logger.debug(`Allocation ${key}: Summed ${totalHours}h from daily breakdown (${allocation.daily_breakdown.length} days)`);
    } else {
      // Fallback to the hours field if no daily breakdown
      totalHours = parseFloat(allocation.hours) || 0;
      logger.debug(`Allocation ${key}: Using direct hours value ${totalHours}h`);
    }
    
    // Add to existing allocation if key already exists
    const existingHours = allocationMap.get(key) || 0;
    const newTotal = existingHours + totalHours;
    allocationMap.set(key, newTotal);
    
    logger.debug(`Allocation map updated: ${key} = ${newTotal}h (was ${existingHours}h, added ${totalHours}h)`);
  });

  logger.debug(`Final allocation map created with ${allocationMap.size} entries:`, Array.from(allocationMap.entries()));
  return allocationMap;
};

/**
 * Calculate member weekly totals from comprehensive allocations
 * This properly accounts for all daily allocations across all projects
 */
export const calculateMemberWeeklyTotals = (
  comprehensiveWeeklyAllocations: any[],
  weekStartDateString: string,
  allMembers: any[]
): Map<string, number> => {
  const memberTotals = new Map<string, number>();
  
  // Initialize all members with 0 hours
  allMembers.forEach(member => {
    memberTotals.set(member.id, 0);
  });

  if (!comprehensiveWeeklyAllocations || comprehensiveWeeklyAllocations.length === 0) {
    logger.debug('No comprehensive allocations for member totals calculation');
    return memberTotals;
  }

  logger.debug('Calculating member weekly totals from comprehensive allocations:', comprehensiveWeeklyAllocations.length);

  // Group allocations by member and sum up their total hours
  const memberAllocations = new Map<string, number>();
  
  comprehensiveWeeklyAllocations.forEach(allocation => {
    const memberId = allocation.resource_id;
    
    // Calculate total hours for this allocation
    let totalHours = 0;
    if (allocation.daily_breakdown && Array.isArray(allocation.daily_breakdown)) {
      allocation.daily_breakdown.forEach((day: any) => {
        const dayHours = parseFloat(day.hours) || 0;
        totalHours += dayHours;
      });
    } else {
      totalHours = parseFloat(allocation.hours) || 0;
    }
    
    // Add to member's total
    const existingTotal = memberAllocations.get(memberId) || 0;
    memberAllocations.set(memberId, existingTotal + totalHours);
  });

  // Update the final member totals
  memberAllocations.forEach((totalHours, memberId) => {
    memberTotals.set(memberId, totalHours);
    logger.debug(`Member ${memberId} total weekly hours: ${totalHours}h`);
  });

  logger.debug(`Member weekly totals calculated for ${memberTotals.size} members`);
  return memberTotals;
};
