
import { ViewOption } from '@/components/resources/filters/ViewSelector';

export const viewOptionToPeriod = (view: ViewOption): number => {
  switch (view) {
    case '1-month':
      return 1; // 1 month
    case '3-months':
      return 3; // 3 months
    case '12-months':
      return 12; // 12 months
    default:
      return 3; // Default to 3 months
  }
};

export const periodToViewOption = (period: number): ViewOption => {
  if (period <= 1) return '1-month';
  if (period <= 3) return '3-months';
  return '12-months';
};
