
/**
 * STANDARDIZED utilization calculations for the Weekly Overview
 * This ensures consistency across ALL components in the weekly resource view
 * 
 * IMPORTANT: All components MUST use these functions to ensure consistent calculations
 */

/**
 * Calculate total PROJECT hours for a member from the allocation map
 * This is the ONLY function that should be used to calculate member project hours
 */
export const calculateMemberProjectHours = (
  memberId: string, 
  allocationMap: Map<string, number>
): number => {
  let totalHours = 0;
  
  console.log(`DEBUG calculateMemberProjectHours for ${memberId} - AllocationMap size:`, allocationMap.size);
  console.log(`DEBUG calculateMemberProjectHours for ${memberId} - Full allocation map:`, Array.from(allocationMap.entries()));
  
  allocationMap.forEach((hours, key) => {
    const [resourceId] = key.split(':');
    console.log(`DEBUG checking allocation entry: ${key} -> ${hours}h, matches member: ${resourceId === memberId}`);
    if (resourceId === memberId) {
      totalHours += hours;
      console.log(`DEBUG added ${hours}h to total for ${memberId}, new total: ${totalHours}h`);
    }
  });
  
  console.log(`STANDARDIZED calculateMemberProjectHours for ${memberId}:`, {
    totalProjectHours: totalHours,
    allocationEntries: Array.from(allocationMap.entries()).filter(([key]) => key.startsWith(memberId))
  });
  
  return totalHours;
};

/**
 * Calculate utilization percentage (PROJECT hours + LEAVE hours)
 * This is the ONLY function that should be used to calculate utilization percentage
 * @param projectHours - Total project hours for the week
 * @param weeklyCapacity - Weekly capacity (default 40 hours)
 * @param leaveHours - Optional total leave hours (annual + holiday + other)
 * @returns Utilization percentage (0-100+)
 */
export const calculateUtilizationPercentage = (
  projectHours: number,
  weeklyCapacity: number = 40,
  leaveHours: number = 0
): number => {
  if (weeklyCapacity <= 0) return 0;
  const totalHours = projectHours + leaveHours;
  const percentage = Math.round((totalHours / weeklyCapacity) * 100);
  
  console.log(`STANDARDIZED calculateUtilizationPercentage:`, {
    projectHours,
    leaveHours,
    totalHours,
    weeklyCapacity,
    calculatedPercentage: percentage,
    formula: `(${projectHours} + ${leaveHours}) / ${weeklyCapacity} * 100 = ${percentage}%`
  });
  
  return percentage;
};

/**
 * Get utilization status color based on percentage
 */
export const getUtilizationColor = (utilizationPercentage: number): string => {
  if (utilizationPercentage > 100) return 'text-red-600';
  if (utilizationPercentage > 80) return 'text-orange-600';
  return 'text-green-600';
};

/**
 * Count unique projects a member is allocated to
 */
export const calculateMemberProjectCount = (
  memberId: string,
  allocationMap: Map<string, number>
): number => {
  const projectSet = new Set<string>();
  
  allocationMap.forEach((hours, key) => {
    const [resourceId, projectId] = key.split(':');
    if (resourceId === memberId && hours > 0) {
      projectSet.add(projectId);
    }
  });
  
  return projectSet.size;
};

/**
 * STANDARDIZED calculation for capacity display
 * Returns both project hours and capacity for consistent display
 * Now includes leave hours in utilization calculation
 */
export const calculateCapacityDisplay = (
  memberId: string,
  allocationMap: Map<string, number>,
  weeklyCapacity: number = 40,
  leaveHours: number = 0
): { projectHours: number; capacity: number; utilizationPercentage: number; totalHours: number } => {
  const projectHours = calculateMemberProjectHours(memberId, allocationMap);
  const totalHours = projectHours + leaveHours;
  const utilizationPercentage = calculateUtilizationPercentage(projectHours, weeklyCapacity, leaveHours);
  
  console.log(`STANDARDIZED calculateCapacityDisplay for ${memberId}:`, {
    projectHours,
    leaveHours,
    totalHours,
    capacity: weeklyCapacity,
    utilizationPercentage,
    display: `(${projectHours}h + ${leaveHours}h leave) / ${weeklyCapacity}h = ${utilizationPercentage}%`
  });
  
  return {
    projectHours,
    capacity: weeklyCapacity,
    utilizationPercentage,
    totalHours
  };
};
