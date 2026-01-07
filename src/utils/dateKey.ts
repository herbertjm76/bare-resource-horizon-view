/**
 * Canonical UTC date key utility.
 * Converts a Date to YYYY-MM-DD string using UTC to avoid timezone drift.
 * Use this everywhere for:
 * - allocation_date values stored in the database
 * - query range boundaries (rangeStart, rangeEnd)
 * - weekKey for aggregation and rendering
 */

const pad2 = (n: number): string => n.toString().padStart(2, '0');

/**
 * Convert a Date to a UTC-based YYYY-MM-DD string.
 * This ensures consistent date keys regardless of user timezone.
 */
export const toUTCDateKey = (date: Date): string => {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
};

/**
 * Parse a YYYY-MM-DD string as a UTC date (midnight UTC).
 * Use this when reading allocation_date from the database.
 */
export const parseUTCDateKey = (dateKey: string): Date => {
  return new Date(dateKey + 'T00:00:00Z');
};
