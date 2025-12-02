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

  console.log('useAppSettings: company settings =', {
    work_week_hours: company?.work_week_hours,
    use_hours_or_percentage: company?.use_hours_or_percentage,
    start_of_work_week: company?.start_of_work_week,
    opt_out_financials: company?.opt_out_financials,
    project_display_preference: company?.project_display_preference,
  });

  return {
    workWeekHours: company?.work_week_hours || 40,
    displayPreference: (company?.use_hours_or_percentage as DisplayPreference) || 'hours',
    startOfWorkWeek: (company?.start_of_work_week as WeekStartDay) || 'Monday',
    hideFinancials: company?.opt_out_financials === true,
    projectDisplayPreference: (company?.project_display_preference as ProjectDisplayPreference) || 'code',
  };
};
