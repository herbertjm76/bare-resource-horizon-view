import type { WeekStartDay } from '@/hooks/useAppSettings';
import { toUTCDateKey, parseUTCDateKey } from '@/utils/dateKey';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const weekStartDayToDow = (weekStartDay: WeekStartDay): 0 | 1 | 6 => {
  return weekStartDay === 'Sunday' ? 0 : weekStartDay === 'Saturday' ? 6 : 1;
};

/**
 * CRITICAL: Normalize any date to the company's week start day.
 *
 * IMPORTANT:
 * - This implementation is **UTC-based**.
 * - We intentionally do NOT use date-fns startOfWeek here because it is local-timezone based and
 *   can shift date keys (e.g. 2026-01-05 -> 2026-01-04) depending on the viewer's timezone.
 *
 * @param dateInput - Date object or YYYY-MM-DD string
 * @param weekStartDay - Company's week start preference (REQUIRED)
 * @returns YYYY-MM-DD string for the week start (UTC date key)
 */
export function normalizeToWeekStart(dateInput: Date | string, weekStartDay: WeekStartDay): string {
  const date = typeof dateInput === 'string'
    ? parseUTCDateKey(dateInput.split('T')[0])
    : parseUTCDateKey(toUTCDateKey(dateInput));

  const targetDow = weekStartDayToDow(weekStartDay);
  const currentDow = date.getUTCDay();

  let diff = currentDow - targetDow;
  if (diff < 0) diff += 7;

  const weekStart = new Date(date.getTime() - diff * MS_PER_DAY);
  return toUTCDateKey(weekStart);
}

/**
 * Get the week start Date object (midnight UTC) based on company preference.
 */
export function getWeekStartDate(date: Date, weekStartDay: WeekStartDay): Date {
  return parseUTCDateKey(normalizeToWeekStart(date, weekStartDay));
}

/**
 * Validate that a date matches the expected week start day.
 */
export function assertIsWeekStart(dateKey: string, weekStartDay: WeekStartDay, context?: string): void {
  const date = parseUTCDateKey(dateKey);
  const dayOfWeek = date.getUTCDay();

  const expectedDay = weekStartDayToDow(weekStartDay);

  if (dayOfWeek !== expectedDay) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const message = `CRITICAL: allocation_date should be ${weekStartDay} but got ${days[dayOfWeek]} (${dateKey})${context ? ` in ${context}` : ''}`;
    console.warn(message);

    if (process.env.NODE_ENV === 'development') {
      console.error('⚠️ Week start mismatch detected. Ensure week keys are produced via normalizeToWeekStart()');
    }
  }
}

