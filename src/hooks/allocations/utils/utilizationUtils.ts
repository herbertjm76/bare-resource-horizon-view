
/**
 * Determine if a resource is overutilized (exceeding standard capacity)
 * @param weeklyHours Hours allocated for a week
 * @param standardCapacity Standard weekly capacity (REQUIRED - use workWeekHours from useAppSettings)
 * @returns Boolean indicating if resource is overutilized
 */
export const isResourceOverutilized = (
  weeklyHours: number, 
  standardCapacity: number
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
  if (utilization > 100) {
    return { status: 'overallocated', color: '#EF4444' }; // Red - over-allocated
  } else if (utilization >= 80) {
    return { status: 'optimal', color: '#22c55e' }; // Green - optimal (80-100%)
  } else if (utilization >= 50) {
    return { status: 'high', color: '#eab308' }; // Yellow - moderate (50-79%)
  } else if (utilization > 0) {
    return { status: 'low', color: '#f97316' }; // Orange - underutilized (<50%)
  } else {
    return { status: 'low', color: '#9CA3AF' }; // Gray - no allocation
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
 * Get allocation warning status based on TOTAL person allocation across all projects
 * This checks if adding/editing a project allocation would exceed thresholds for the person's total workload
 * 
 * @param currentProjectHours - Hours for the project being edited
 * @param otherProjectsHours - Sum of hours from all OTHER projects for this person/week
 * @param leaveHours - Total leave hours for this person/week
 * @param capacity - Weekly capacity (from workWeekHours setting)
 * @param displayPreference - 'hours' or 'percentage' for message formatting
 * @param warningThreshold - Percentage threshold for yellow warning (default 150)
 * @param dangerThreshold - Percentage threshold for red danger (default 180)
 * @param maxLimit - Maximum allowed percentage (default 200)
 */
export const getTotalAllocationWarningStatus = (
  currentProjectHours: number,
  otherProjectsHours: number,
  leaveHours: number,
  capacity: number,
  displayPreference: 'hours' | 'percentage' = 'hours',
  warningThreshold: number = 150,
  dangerThreshold: number = 180,
  maxLimit: number = 200
): {
  level: 'normal' | 'warning' | 'danger' | 'exceeded';
  borderClass: string;
  bgClass: string;
  textClass: string;
  message: string;
  totalHours: number;
  totalPercentage: number;
} => {
  const totalHours = currentProjectHours + otherProjectsHours + leaveHours;
  const totalPercentage = capacity > 0 ? (totalHours / capacity) * 100 : 0;
  const roundedPercentage = Math.round(totalPercentage);
  
  const formatMessage = (prefix: string): string => {
    if (displayPreference === 'percentage') {
      return `${prefix} ${roundedPercentage}% of capacity`;
    }
    return `${prefix} ${Math.round(totalHours)}h of ${Math.round(capacity)}h capacity`;
  };
  
  if (totalPercentage > maxLimit) {
    return { 
      level: 'exceeded', 
      borderClass: 'border-destructive',
      bgClass: 'bg-destructive/10',
      textClass: 'text-destructive',
      message: displayPreference === 'percentage'
        ? `Total allocation exceeds ${maxLimit}% (${roundedPercentage}%)`
        : `Total allocation exceeds limit (${Math.round(totalHours)}h of ${Math.round(capacity)}h, ${roundedPercentage}%)`,
      totalHours,
      totalPercentage
    };
  } else if (totalPercentage >= dangerThreshold) {
    return { 
      level: 'danger', 
      borderClass: 'border-destructive/70',
      bgClass: 'bg-destructive/5',
      textClass: 'text-destructive',
      message: formatMessage('Total allocation is at'),
      totalHours,
      totalPercentage
    };
  } else if (totalPercentage >= warningThreshold) {
    return { 
      level: 'warning', 
      borderClass: 'border-amber-500',
      bgClass: 'bg-amber-500/5',
      textClass: 'text-amber-600',
      message: formatMessage('Total allocation is at'),
      totalHours,
      totalPercentage
    };
  }
  
  return { 
    level: 'normal', 
    borderClass: 'border-border',
    bgClass: '',
    textClass: '',
    message: '',
    totalHours,
    totalPercentage
  };
};

/**
 * Calculate appropriate capacity for a resource based on their contract or role
 * @param resourceId Resource ID
 * @param resourceType Type of resource (full-time, part-time, contractor, etc.)
 * @param baseCapacity Base capacity to use (REQUIRED - use workWeekHours from useAppSettings)
 * @returns Calculated capacity
 */
export const calculateResourceCapacity = (
  resourceId: string, 
  resourceType: string = 'full-time',
  baseCapacity: number
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
