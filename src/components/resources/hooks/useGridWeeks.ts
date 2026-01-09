import { useMemo } from 'react';
import { format, addDays } from 'date-fns';
import { logger } from '@/utils/logger';
import { toUTCDateKey, parseUTCDateKey } from '@/utils/dateKey';

export interface WeekInfo {
  weekStartDate: Date; // midnight UTC
  weekEndDate: Date; // end of day UTC (represented as date key + 6)
  weekLabel: string; // e.g., "Jan 1-7"
  monthLabel: string; // e.g., "Jan"
  weekNumber: number; // Week number in the year
  isPreviousWeek: boolean;
}

interface DisplayOptions {
  weekStartsOnSunday: boolean;
  weekStartsOnSaturday?: boolean;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const getWeekStartsOn = (opts: DisplayOptions): 0 | 1 | 6 => {
  return opts.weekStartsOnSaturday ? 6 : opts.weekStartsOnSunday ? 0 : 1;
};

const startOfWeekUTC = (date: Date, weekStartsOn: 0 | 1 | 6): Date => {
  // Anchor to midnight UTC first
  const anchored = parseUTCDateKey(toUTCDateKey(date));
  const dow = anchored.getUTCDay();

  let diff = dow - weekStartsOn;
  if (diff < 0) diff += 7;

  return new Date(anchored.getTime() - diff * MS_PER_DAY);
};

export const useGridWeeks = (
  startDate: Date,
  periodToShow: number, // Number of weeks to show
  displayOptions: DisplayOptions
): WeekInfo[] => {
  return useMemo(() => {
    const isMobileOrTablet = typeof window !== 'undefined' && window.innerWidth <= 1024;
    const weekStartsOn = getWeekStartsOn(displayOptions);

    // Week starts are computed in UTC to match allocation_date keys.
    const adjustedStartDate = startOfWeekUTC(startDate, weekStartsOn);

    const previousWeekStartDate = isMobileOrTablet
      ? adjustedStartDate
      : addDays(adjustedStartDate, -7);

    const totalWeeks = (isMobileOrTablet ? 0 : 1) + periodToShow;
    const allWeeks: Date[] = Array.from({ length: totalWeeks }).map((_, idx) =>
      addDays(previousWeekStartDate, idx * 7)
    );

    logger.debug('Grid weeks debug:', {
      weekStartsOn,
      originalStartDate: startDate,
      adjustedStartDate,
      totalWeeks: allWeeks.length,
      periodToShow,
    });

    return allWeeks.map((weekStart) => {
      const weekEnd = addDays(weekStart, 6);
      const isPreviousWeek = weekStart < adjustedStartDate;

      const startDay = format(weekStart, 'd');
      const endDay = format(weekEnd, 'd');
      const startMonth = format(weekStart, 'MMM');
      const endMonth = format(weekEnd, 'MMM');

      const weekLabel = startMonth === endMonth
        ? `${startMonth} ${startDay}-${endDay}`
        : `${startMonth} ${startDay}-${endMonth} ${endDay}`;

      const weekNumber = parseInt(format(weekStart, 'w'), 10);

      return {
        weekStartDate: weekStart,
        weekEndDate: weekEnd,
        weekLabel,
        monthLabel: startMonth,
        weekNumber,
        isPreviousWeek,
      };
    });
  }, [startDate, periodToShow, displayOptions.weekStartsOnSunday, displayOptions.weekStartsOnSaturday]);
};

