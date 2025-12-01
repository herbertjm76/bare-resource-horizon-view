import { useCompany } from '@/context/CompanyContext';

export type DisplayPreference = 'hours' | 'percentage';
export type ProjectDisplayPreference = 'code' | 'name';
export type WeekStartDay = 'Monday' | 'Sunday' | 'Saturday';

export interface AppSettings {
  workWeekHours: number;
  displayPreference: DisplayPreference;
  startOfWorkWeek: WeekStartDay;
  hideFinancials: boolean;
  projectDisplayPreference: ProjectDisplayPreference;
}

/**
 * Hook to access application-wide settings from the company record
 */
export const useAppSettings = (): AppSettings => {
  const { company } = useCompany();

  return {
    workWeekHours: company?.work_week_hours || 40,
    displayPreference: (company?.use_hours_or_percentage as DisplayPreference) || 'hours',
    startOfWorkWeek: (company?.start_of_work_week as WeekStartDay) || 'Monday',
    hideFinancials: company?.opt_out_financials || false,
    projectDisplayPreference: (company?.project_display_preference as ProjectDisplayPreference) || 'code',
  };
};
