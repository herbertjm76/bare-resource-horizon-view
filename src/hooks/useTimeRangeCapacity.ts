import { useMemo } from 'react';
import { TimeRange } from '@/components/dashboard/TimeRangeSelector';
import { useAppSettings } from './useAppSettings';

export interface TimeRangeCapacityData {
  // Multiplier for the time range (how many weeks)
  weekMultiplier: number;
  // Total hours capacity for the time range (team or individual)
  getTotalCapacity: (weeklyCapacity: number) => number;
  // Label for the time range
  label: string;
  // Short label
  shortLabel: string;
  // Number of weeks in the range
  weeksInRange: number;
}

/**
 * Hook to get time-range-aware capacity calculations
 * Provides consistent multipliers and capacity calculations across the dashboard
 */
export const useTimeRangeCapacity = (selectedTimeRange: TimeRange): TimeRangeCapacityData => {
  const { workWeekHours } = useAppSettings();

  return useMemo(() => {
    let weekMultiplier: number;
    let label: string;
    let shortLabel: string;

    switch (selectedTimeRange) {
      case 'week':
        weekMultiplier = 1;
        label = 'This Week';
        shortLabel = 'week';
        break;
      case 'month':
        weekMultiplier = 4; // ~4 weeks in a month
        label = 'This Month';
        shortLabel = 'month';
        break;
      case '3months':
        weekMultiplier = 13; // ~13 weeks in a quarter
        label = 'This Quarter';
        shortLabel = 'quarter';
        break;
      default:
        weekMultiplier = 4;
        label = 'This Month';
        shortLabel = 'month';
    }

    return {
      weekMultiplier,
      getTotalCapacity: (weeklyCapacity: number) => weeklyCapacity * weekMultiplier,
      label,
      shortLabel,
      weeksInRange: weekMultiplier
    };
  }, [selectedTimeRange]);
};

/**
 * Get the week multiplier for a time range without using the hook
 * Useful for utility functions
 */
export const getWeekMultiplier = (selectedTimeRange: TimeRange): number => {
  switch (selectedTimeRange) {
    case 'week':
      return 1;
    case 'month':
      return 4;
    case '3months':
      return 13;
    default:
      return 4;
  }
};

/**
 * Get time range label
 */
export const getTimeRangeLabel = (selectedTimeRange: TimeRange): string => {
  switch (selectedTimeRange) {
    case 'week':
      return 'This Week';
    case 'month':
      return 'This Month';
    case '3months':
      return 'This Quarter';
    default:
      return 'This Month';
  }
};
