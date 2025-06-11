
import { ViewOption } from '@/components/resources/filters/ViewSelector';

export const viewOptionToPeriod = (view: ViewOption): number => {
  switch (view) {
    case '1-month':
      return 4; // 4 weeks = approximately 1 month
    case '3-months':
      return 12; // 12 weeks = approximately 3 months
    case '12-months':
      return 52; // 52 weeks = 1 year
    default:
      return 12; // Default to 3 months
  }
};

export const periodToViewOption = (period: number): ViewOption => {
  if (period <= 4) return '1-month';
  if (period <= 12) return '3-months';
  return '12-months';
};
