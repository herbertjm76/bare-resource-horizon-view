import type { DisplayPreference } from '@/hooks/useAppSettings';

/**
 * Canonical capacity used for allocation % <-> hours conversions.
 *
 * Key rule (per product behavior):
 * - If the app is in percentage mode, a user typing "5" means 5% of the COMPANY work week,
 *   not 5% of an individual member's custom capacity.
 * - If the app is in hours mode, hours are literal; we still use member capacity for
 *   validation/formatting when needed.
 */
export const getAllocationCapacity = (params: {
  displayPreference: DisplayPreference;
  workWeekHours?: number | null;
  memberWeeklyCapacity?: number | null;
  memberCapacityFallback?: number | null;
}): number => {
  const companyCapacity = params.workWeekHours ?? 40;

  if (params.displayPreference === 'percentage') {
    return companyCapacity;
  }

  return params.memberWeeklyCapacity ?? params.memberCapacityFallback ?? companyCapacity;
};
