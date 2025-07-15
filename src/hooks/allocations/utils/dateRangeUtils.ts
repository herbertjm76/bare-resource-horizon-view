import { DateRangeCalculationService } from '@/services/DateRangeCalculationService';
import { DateRange } from '@/types/dateRange';

// Re-export the centralized service methods for backward compatibility
export const getStandardizedDateRange = (selectedDate: Date, periodToShow?: number): DateRange => {
  return DateRangeCalculationService.getStandardizedDateRange(selectedDate, { periodToShow });
};

export const generateWeekKeys = DateRangeCalculationService.generateWeekKeys;
export const dateRangesOverlap = DateRangeCalculationService.dateRangesOverlap;

// Re-export the DateRange type for backward compatibility
export type { DateRange };