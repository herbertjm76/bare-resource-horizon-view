import type { DisplayPreference } from '@/hooks/useAppSettings';

/**
 * Format allocation value as hours or percentage based on company preference
 * 
 * @param hours The number of hours allocated
 * @param capacity The weekly capacity (for percentage calculation)
 * @param displayPreference The company's display preference ('hours' or 'percentage')
 * @param showSuffix Whether to show 'h' or '%' suffix (default: true)
 * @returns Formatted string
 */
export const formatAllocationValue = (
  hours: number,
  capacity: number,
  displayPreference: DisplayPreference,
  showSuffix: boolean = true
): string => {
  if (displayPreference === 'percentage') {
    if (capacity <= 0) return showSuffix ? '0%' : '0';
    const percentage = (hours / capacity) * 100;
    const formattedPercentage = percentage % 1 === 0 ? percentage.toString() : percentage.toFixed(1);
    return showSuffix ? `${formattedPercentage}%` : formattedPercentage;
  }
  
  // Default to hours
  const formattedHours = hours % 1 === 0 ? hours.toString() : hours.toFixed(1);
  return showSuffix ? `${formattedHours}h` : formattedHours;
};

/**
 * Format allocation value showing both primary and secondary format
 * Primary is based on displayPreference, secondary is shown in parenthesis
 * e.g., "50% (20h)" or "20h (50%)"
 * 
 * @param hours The number of hours allocated
 * @param capacity The weekly capacity (for percentage calculation)
 * @param displayPreference The company's display preference ('hours' or 'percentage')
 * @returns Formatted string with both formats
 */
export const formatDualAllocationValue = (
  hours: number,
  capacity: number,
  displayPreference: DisplayPreference
): string => {
  if (capacity <= 0) return displayPreference === 'percentage' ? '0% (0h)' : '0h (0%)';
  
  const percentage = (hours / capacity) * 100;
  const formattedPercentage = percentage % 1 === 0 ? percentage.toString() : percentage.toFixed(1);
  const formattedHours = hours % 1 === 0 ? hours.toString() : hours.toFixed(1);
  
  if (displayPreference === 'percentage') {
    return `${formattedPercentage}% (${formattedHours}h)`;
  }
  
  return `${formattedHours}h (${formattedPercentage}%)`;
};

/**
 * Get input configuration based on display preference
 * Returns step, min, max, and unit label for inputs
 */
export const getInputConfig = (displayPreference: DisplayPreference) => {
  if (displayPreference === 'percentage') {
    return {
      step: 5,
      min: 0,
      max: 200, // Allow over 100% for overtime
      unit: '%',
      placeholder: '0'
    };
  }
  return {
    step: 0.5,
    min: 0,
    max: 168, // Max hours in a week
    unit: 'h',
    placeholder: '0'
  };
};

/**
 * Convert input value to hours based on display preference
 */
export const convertInputToHours = (
  inputValue: number,
  capacity: number,
  displayPreference: DisplayPreference
): number => {
  if (displayPreference === 'percentage') {
    return (inputValue / 100) * capacity;
  }
  return inputValue;
};

/**
 * Convert hours to input value based on display preference
 */
export const convertHoursToInputValue = (
  hours: number,
  capacity: number,
  displayPreference: DisplayPreference
): number => {
  if (displayPreference === 'percentage') {
    return capacity > 0 ? (hours / capacity) * 100 : 0;
  }
  return hours;
};

/**
 * Format capacity value based on display preference
 * 
 * @param capacity The capacity in hours
 * @param displayPreference The company's display preference
 * @returns Formatted string
 */
export const formatCapacityValue = (
  capacity: number,
  displayPreference: DisplayPreference
): string => {
  if (displayPreference === 'percentage') {
    return '100%';
  }
  return `${capacity}h`;
};

/**
 * Format available/remaining value based on display preference
 * 
 * @param availableHours Available hours remaining
 * @param capacity The weekly capacity
 * @param displayPreference The company's display preference
 * @returns Formatted string
 */
export const formatAvailableValue = (
  availableHours: number,
  capacity: number,
  displayPreference: DisplayPreference
): string => {
  if (displayPreference === 'percentage') {
    if (capacity <= 0) return '0%';
    const percentage = (availableHours / capacity) * 100;
    const formattedPercentage = percentage % 1 === 0 ? percentage.toString() : percentage.toFixed(1);
    return `${formattedPercentage}%`;
  }
  
  const formattedHours = availableHours % 1 === 0 ? availableHours.toString() : availableHours.toFixed(1);
  return `${formattedHours}h`;
};

/**
 * Get the label for capacity (e.g., "of 40h" or "of 100%")
 * 
 * @param capacity The capacity in hours
 * @param displayPreference The company's display preference
 * @returns Formatted label string
 */
export const getCapacityLabel = (
  capacity: number,
  displayPreference: DisplayPreference
): string => {
  if (displayPreference === 'percentage') {
    return 'of 100%';
  }
  return `of ${capacity}h`;
};

/**
 * Format utilization summary (e.g., "32h of 40h" or "80% of 100%")
 * 
 * @param usedHours Hours used
 * @param capacity Total capacity
 * @param displayPreference Display preference
 * @returns Formatted string
 */
export const formatUtilizationSummary = (
  usedHours: number,
  capacity: number,
  displayPreference: DisplayPreference
): string => {
  const used = formatAllocationValue(usedHours, capacity, displayPreference);
  const total = formatCapacityValue(capacity, displayPreference);
  return `${used} of ${total}`;
};
