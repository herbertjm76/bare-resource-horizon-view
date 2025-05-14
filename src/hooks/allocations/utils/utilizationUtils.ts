
/**
 * Determine if a resource is overutilized (exceeding standard capacity)
 * @param weeklyHours Hours allocated for a week
 * @param standardCapacity Standard weekly capacity (default: 40 hours)
 * @returns Boolean indicating if resource is overutilized
 */
export const isResourceOverutilized = (
  weeklyHours: number, 
  standardCapacity: number = 40
): boolean => {
  return weeklyHours > standardCapacity;
};

/**
 * Calculate utilization percentage
 * @param allocatedHours Hours allocated
 * @param capacity Total capacity
 * @returns Utilization percentage
 */
export const calculateUtilizationPercentage = (
  allocatedHours: number, 
  capacity: number
): number => {
  if (capacity <= 0) return 0;
  return Math.round((allocatedHours / capacity) * 100);
};

/**
 * Get utilization status and corresponding color
 * @param utilization Utilization percentage
 * @returns Object with status and color
 */
export const getUtilizationStatus = (utilization: number): { 
  status: 'low' | 'optimal' | 'high' | 'overallocated'; 
  color: string;
} => {
  if (utilization <= 30) {
    return { status: 'low', color: '#9CA3AF' }; // Gray
  } else if (utilization <= 80) {
    return { status: 'optimal', color: '#10B981' }; // Green
  } else if (utilization <= 100) {
    return { status: 'high', color: '#F59E0B' }; // Amber
  } else {
    return { status: 'overallocated', color: '#EF4444' }; // Red
  }
};

/**
 * Format a utilization percentage for display
 * @param percentage Utilization percentage
 * @returns Formatted string
 */
export const formatUtilization = (percentage: number): string => {
  return `${Math.round(percentage)}%`;
};

/**
 * Calculate appropriate capacity for a resource based on their contract or role
 * @param resourceId Resource ID
 * @param resourceType Type of resource (full-time, part-time, contractor, etc.)
 * @param baseCapacity Base capacity to use (default: 40)
 * @returns Calculated capacity
 */
export const calculateResourceCapacity = (
  resourceId: string, 
  resourceType: string = 'full-time',
  baseCapacity: number = 40
): number => {
  switch(resourceType) {
    case 'part-time':
      return baseCapacity * 0.5;
    case 'contractor':
      return baseCapacity * 0.8;
    case 'full-time':
    default:
      return baseCapacity;
  }
};
