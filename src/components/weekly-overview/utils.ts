
/**
 * Formats a number to have 0 decimal places
 */
export const formatNumber = (num: number): string => {
  return num.toFixed(0);
};

/**
 * Calculates the utilization percentage
 */
export const calculateUtilization = (allocated: number, capacity: number): number => {
  if (capacity === 0) return 0;
  return (allocated / capacity) * 100;
};

/**
 * Calculate capacity based on resourced hours
 */
export const calculateCapacity = (resourcedHours: number): number => {
  return Math.max(0, 40 - resourcedHours);
};

/**
 * Convert an array of project names to a displayable string
 */
export const formatProjects = (projects: string[]): string => {
  if (!projects || projects.length === 0) return "None";
  return projects.join(", ");
};

// Add any other utility functions here
