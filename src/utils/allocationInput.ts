/**
 * ALLOCATION INPUT RULEBOOK
 * 
 * This is the SINGLE SOURCE OF TRUTH for parsing and validating allocation input values.
 * All allocation input components MUST use these utilities to ensure consistent behavior.
 * 
 * The fundamental rule:
 * - User sees display values (hours or %)
 * - Database stores hours only
 * - This module handles all conversions to/from hours
 * 
 * DO NOT implement custom parsing logic in components.
 * Always use this module instead.
 */

import type { DisplayPreference } from '@/hooks/useAppSettings';

/**
 * Round to at most 2 decimal places, removing trailing zeros.
 */
const roundHours = (hours: number): number => {
  return Math.round(hours * 100) / 100;
};

/**
 * Parse a user's input string and convert to hours for storage.
 * 
 * @param inputString - Raw input from user (e.g., "10", "25.5", "")
 * @param capacity - Weekly capacity in hours
 * @param displayPreference - Whether user entered hours or percentage
 * @returns Hours value for storage (rounded to 2 decimals)
 */
export const parseInputToHours = (
  inputString: string,
  capacity: number,
  displayPreference: DisplayPreference
): number => {
  const trimmed = inputString.trim();
  if (trimmed === '' || trimmed === '-') return 0;
  
  const numValue = parseFloat(trimmed);
  if (!Number.isFinite(numValue) || numValue < 0) return 0;
  
  if (displayPreference === 'percentage') {
    // Input is a percentage, convert to hours
    // e.g., 25% of 40h capacity = 10h
    return roundHours((numValue / 100) * capacity);
  }
  
  // Input is already hours
  return roundHours(numValue);
};

/**
 * Convert hours (from DB) to display string for input fields.
 * 
 * @param hours - Hours from database
 * @param capacity - Weekly capacity in hours
 * @param displayPreference - How to display (hours or percentage)
 * @returns Display string without suffix
 */
export const hoursToInputDisplay = (
  hours: number,
  capacity: number,
  displayPreference: DisplayPreference
): string => {
  if (hours <= 0) return '';
  
  if (displayPreference === 'percentage') {
    if (capacity <= 0) return '0';
    const pct = (hours / capacity) * 100;
    // Remove unnecessary decimals (e.g., 25.0 -> 25)
    const formatted = pct % 1 === 0 ? pct.toString() : pct.toFixed(1);
    return formatted;
  }
  
  // Hours mode
  const formatted = hours % 1 === 0 ? hours.toString() : hours.toFixed(1);
  return formatted;
};

/**
 * Format hours for display WITH suffix (for labels, not inputs).
 * 
 * @param hours - Hours from database
 * @param capacity - Weekly capacity in hours
 * @param displayPreference - How to display (hours or percentage)
 * @returns Formatted string with suffix (e.g., "25%" or "10h")
 */
export const formatHoursForDisplay = (
  hours: number,
  capacity: number,
  displayPreference: DisplayPreference
): string => {
  const value = hoursToInputDisplay(hours, capacity, displayPreference);
  if (!value || value === '') return displayPreference === 'percentage' ? '0%' : '0h';
  
  return displayPreference === 'percentage' ? `${value}%` : `${value}h`;
};

/**
 * Validate that a parsed hours value is within acceptable limits.
 * 
 * @param hours - Hours value to validate
 * @param capacity - Weekly capacity
 * @param maxLimitPercent - Maximum allowed percentage (e.g., 200)
 * @returns Object with isValid and error message if invalid
 */
export const validateAllocationHours = (
  hours: number,
  capacity: number,
  maxLimitPercent: number = 200
): { isValid: boolean; error?: string } => {
  if (!Number.isFinite(hours) || hours < 0) {
    return { isValid: false, error: 'Please enter a valid positive number' };
  }
  
  const percentage = capacity > 0 ? (hours / capacity) * 100 : 0;
  if (percentage > maxLimitPercent) {
    return { 
      isValid: false, 
      error: `Allocation cannot exceed ${maxLimitPercent}%` 
    };
  }
  
  return { isValid: true };
};

/**
 * Validate total allocation including other projects and leave.
 * 
 * @param currentProjectHours - Hours for the project being edited
 * @param otherProjectsHours - Hours from other projects
 * @param leaveHours - Leave hours
 * @param capacity - Weekly capacity
 * @param maxLimitPercent - Maximum allowed percentage (e.g., 200)
 * @returns Object with isValid and error message if invalid
 */
export const validateTotalAllocation = (
  currentProjectHours: number,
  otherProjectsHours: number,
  leaveHours: number,
  capacity: number,
  maxLimitPercent: number = 200
): { isValid: boolean; error?: string; totalHours: number; totalPercent: number } => {
  const totalHours = currentProjectHours + otherProjectsHours + leaveHours;
  const totalPercent = capacity > 0 ? (totalHours / capacity) * 100 : 0;
  
  if (totalPercent > maxLimitPercent) {
    return { 
      isValid: false, 
      error: `Total allocation cannot exceed ${maxLimitPercent}%`,
      totalHours,
      totalPercent
    };
  }
  
  return { isValid: true, totalHours, totalPercent };
};

/**
 * Get input configuration for number inputs.
 * 
 * @param displayPreference - Hours or percentage mode
 * @param capacity - Weekly capacity (used for max calculation in hours mode)
 * @returns Input configuration object
 */
export const getAllocationInputConfig = (
  displayPreference: DisplayPreference,
  capacity: number = 40
): {
  step: number;
  min: number;
  max: number;
  placeholder: string;
} => {
  if (displayPreference === 'percentage') {
    return {
      step: 1,
      min: 0,
      max: 300, // Allow up to 300% for overtime scenarios
      placeholder: '0'
    };
  }
  
  return {
    step: 0.5,
    min: 0,
    max: Math.ceil(capacity * 3), // Allow up to 3x capacity
    placeholder: '0'
  };
};

/**
 * Round-trip test utility: hours -> display -> parse -> hours should equal original.
 * Used in tests to verify consistency.
 * 
 * @param hours - Original hours value
 * @param capacity - Weekly capacity
 * @param displayPreference - Display mode
 * @returns Whether round-trip produces same value (within tolerance)
 */
export const verifyRoundTrip = (
  hours: number,
  capacity: number,
  displayPreference: DisplayPreference
): boolean => {
  const display = hoursToInputDisplay(hours, capacity, displayPreference);
  const parsed = parseInputToHours(display, capacity, displayPreference);
  // Allow small floating point tolerance
  return Math.abs(hours - parsed) < 0.01;
};
