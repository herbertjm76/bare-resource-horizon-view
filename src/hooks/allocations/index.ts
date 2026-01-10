
export * from './types';
export * from './utils';
export * from './api';
export * from './useResourceAllocationsDB';
export * from './useDateRangeAllocations';
export * from './useFetchAllocations';
export * from './utils/dateRangeUtils';
export * from './utils/fetchUtils';
export * from './utils/processingUtils';

// Re-export the canonical allocation week utilities (RULEBOOK)
export {
  getAllocationWeekKey,
  getWeekRange,
  generateWeekKeysForPeriod,
  buildAllocationQueryRange,
  buildAllocationQueryRangeSymmetric,
  assertValidWeekKey,
  compareWeekKeys,
  isWeekKeyInRange,
  getCurrentWeekKey,
  toUTCDateKey,
  parseUTCDateKey,
  getWeekStartDate,
  type WeekStartDay
} from '@/utils/allocationWeek';

// Legacy exports for backward compatibility (prefer allocationWeek utilities)
export { normalizeToWeekStart, assertIsWeekStart } from '@/utils/weekNormalization';
