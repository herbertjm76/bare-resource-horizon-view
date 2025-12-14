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
  allocationWarningThreshold: number;
  allocationDangerThreshold: number;
  allocationMaxLimit: number;
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
    hideFinancials: company?.opt_out_financials === true,
    projectDisplayPreference: (company?.project_display_preference as ProjectDisplayPreference) || 'code',
    allocationWarningThreshold: company?.allocation_warning_threshold || 150,
    allocationDangerThreshold: company?.allocation_danger_threshold || 180,
    allocationMaxLimit: (company as any)?.allocation_max_limit || 200,
  };
};
