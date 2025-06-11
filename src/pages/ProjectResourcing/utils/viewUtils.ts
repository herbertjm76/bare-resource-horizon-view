
import { ViewOption } from '@/components/resources/filters/ViewSelector';

export const viewOptionToPeriod = (view: ViewOption): number => {
  switch (view) {
    case '1-month':
      return 4; // 4 weeks
    case '3-months':
      return 12; // 12 weeks
    case '12-months':
      return 52; // 52 weeks
    default:
      return 4;
  }
};

export const periodToViewOption = (period: number): ViewOption => {
  if (period <= 4) return '1-month';
  if (period <= 12) return '3-months';
  return '12-months';
};
