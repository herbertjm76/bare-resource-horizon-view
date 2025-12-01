import { DisplayPreference } from '@/hooks/useAppSettings';

/**
 * Format hours/percentage based on display preference
 */
export const formatAllocation = (
  hours: number,
  capacity: number,
  displayPreference: DisplayPreference
): string => {
  if (displayPreference === 'percentage') {
    const percentage = (hours / capacity) * 100;
    return `${Math.round(percentage)}%`;
  }
  
  return `${hours}h`;
};

/**
 * Format utilization based on display preference
 */
export const formatUtilization = (
  utilization: number,
  displayPreference: DisplayPreference
): string => {
  if (displayPreference === 'percentage') {
    return `${Math.round(utilization)}%`;
  }
  
  // If showing hours preference, still show utilization as percentage since it's a ratio
  return `${Math.round(utilization)}%`;
};

/**
 * Get the label for allocation inputs based on display preference
 */
export const getAllocationLabel = (displayPreference: DisplayPreference): string => {
  return displayPreference === 'hours' ? 'Hours' : 'Percentage';
};

/**
 * Get the placeholder for allocation inputs based on display preference
 */
export const getAllocationPlaceholder = (displayPreference: DisplayPreference): string => {
  return displayPreference === 'hours' ? 'Enter hours' : 'Enter percentage (0-100)';
};

/**
 * Convert display value to hours based on preference
 */
export const convertToHours = (
  value: number,
  capacity: number,
  displayPreference: DisplayPreference
): number => {
  if (displayPreference === 'percentage') {
    return (value / 100) * capacity;
  }
  
  return value;
};

/**
 * Convert hours to display value based on preference
 */
export const convertFromHours = (
  hours: number,
  capacity: number,
  displayPreference: DisplayPreference
): number => {
  if (displayPreference === 'percentage') {
    return (hours / capacity) * 100;
  }
  
  return hours;
};
