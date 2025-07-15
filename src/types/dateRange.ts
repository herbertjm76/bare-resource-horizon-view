export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface WeekInfo {
  date: Date;
  key: string;
}

export interface DateRangeOptions {
  periodToShow?: number;
  weekStartsOnSunday?: boolean;
}