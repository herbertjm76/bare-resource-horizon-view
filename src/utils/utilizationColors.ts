/**
 * STANDARDIZED utilization color utilities
 * Used across the application for consistent color coding of utilization percentages
 * 
 * Color scheme:
 * - Red (>100%): Over-allocated
 * - Green (80-100%): Optimal utilization
 * - Yellow (50-79%): Moderate utilization
 * - Orange (<50%): Underutilized
 * - Gray (0%): No allocation
 */

export interface UtilizationColors {
  background: string;
  text: string;
}

/**
 * Get background color based on utilization percentage
 * @param percentage - Utilization percentage (0-100+)
 * @returns Background color string
 */
export const getUtilizationBgColor = (percentage: number): string => {
  if (percentage === 0) return '#f3f4f6'; // gray-100
  if (percentage > 100) return '#fecaca'; // red-200
  if (percentage >= 80) return '#bbf7d0'; // green-200
  if (percentage >= 50) return '#fef08a'; // yellow-200
  return '#fed7aa'; // orange-200
};

/**
 * Get solid background color for badges/cells with white text
 * @param percentage - Utilization percentage (0-100+)
 * @returns Solid background color string
 */
export const getUtilizationSolidBgColor = (percentage: number): string => {
  if (percentage === 0) return '#f3f4f6'; // gray-100
  if (percentage > 100) return '#ef4444'; // red-500
  if (percentage >= 80) return '#22c55e'; // green-500
  if (percentage >= 50) return '#eab308'; // yellow-500
  return '#f97316'; // orange-500
};

/**
 * Get text color based on utilization percentage
 * For use with light/pastel backgrounds
 * @param percentage - Utilization percentage (0-100+)
 * @returns Text color string
 */
export const getUtilizationTextColor = (percentage: number): string => {
  if (percentage === 0) return '#9ca3af'; // gray-400
  if (percentage > 100) return '#b91c1c'; // red-700
  if (percentage >= 80) return '#15803d'; // green-700
  if (percentage >= 50) return '#a16207'; // yellow-700
  return '#c2410c'; // orange-700
};

/**
 * Get text color for solid backgrounds (white for visibility)
 * @param percentage - Utilization percentage (0-100+)
 * @returns Text color string
 */
export const getUtilizationSolidTextColor = (percentage: number): string => {
  if (percentage === 0) return '#9ca3af'; // gray-400
  return '#ffffff'; // white for all colored backgrounds
};

/**
 * Get all utilization colors at once
 * @param percentage - Utilization percentage (0-100+)
 * @param solid - Whether to use solid (badge-style) or pastel colors
 * @returns Object with background and text colors
 */
export const getUtilizationColors = (percentage: number, solid: boolean = false): UtilizationColors => {
  return {
    background: solid ? getUtilizationSolidBgColor(percentage) : getUtilizationBgColor(percentage),
    text: solid ? getUtilizationSolidTextColor(percentage) : getUtilizationTextColor(percentage)
  };
};

/**
 * Calculate utilization percentage from hours and capacity
 * @param hours - Total hours (project + leave)
 * @param capacity - Weekly capacity in hours
 * @returns Utilization percentage
 */
export const calculateUtilization = (hours: number, capacity: number): number => {
  if (capacity <= 0) return 0;
  return Math.round((hours / capacity) * 100);
};
