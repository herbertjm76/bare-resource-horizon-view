
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
 * Get allocation warning status for input fields
 * @param percentage Allocation percentage (based on capacity)
 * @param warningThreshold Percentage threshold for yellow warning (default 150)
 * @param dangerThreshold Percentage threshold for red danger (default 180)
 * @returns Object with warning level and color classes
 */
export const getAllocationWarningStatus = (
  percentage: number,
  warningThreshold: number = 150,
  dangerThreshold: number = 180
): {
  level: 'normal' | 'warning' | 'danger' | 'exceeded';
  borderClass: string;
  bgClass: string;
  textClass: string;
  message: string;
} => {
  const roundedPercentage = Math.round(percentage);
  if (percentage > 200) {
    return { 
      level: 'exceeded', 
      borderClass: 'border-destructive',
      bgClass: 'bg-destructive/10',
      textClass: 'text-destructive',
      message: `Allocation exceeds 200% of capacity (${roundedPercentage}%)`
    };
  } else if (percentage >= dangerThreshold) {
    return { 
      level: 'danger', 
      borderClass: 'border-destructive/70',
      bgClass: 'bg-destructive/5',
      textClass: 'text-destructive',
      message: `Allocation is at ${roundedPercentage}% of capacity`
    };
  } else if (percentage >= warningThreshold) {
    return { 
      level: 'warning', 
      borderClass: 'border-amber-500',
      bgClass: 'bg-amber-500/5',
      textClass: 'text-amber-600',
      message: `Allocation is at ${roundedPercentage}% of capacity`
    };
  }
  return { 
    level: 'normal', 
    borderClass: 'border-border',
    bgClass: '',
    textClass: '',
    message: ''
  };
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
