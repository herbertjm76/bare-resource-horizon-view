/**
 * @fileoverview Application settings hook
 * 
 * Provides access to company-wide application settings that affect
 * how data is displayed and calculated throughout the app.
 * 
 * @module hooks/useAppSettings
 * 
 * @example
 * ```ts
 * import { useAppSettings } from '@/hooks/useAppSettings';
 * 
 * function MyComponent() {
 *   const { 
 *     workWeekHours,
 *     displayPreference,
 *     hideFinancials 
 *   } = useAppSettings();
 *   
 *   // Use settings to format display
 *   const formatted = displayPreference === 'hours' 
 *     ? `${hours}h` 
 *     : `${(hours / workWeekHours * 100).toFixed(0)}%`;
 * }
 * ```
 */

import { useMemo } from 'react';
import { useCompany } from '@/context/CompanyContext';

/**
 * Display preference for allocation values
 * - 'hours': Show allocations in hours (e.g., "20h")
 * - 'percentage': Show allocations as percentage of capacity (e.g., "50%")
 */
export type DisplayPreference = 'hours' | 'percentage';

/**
 * Display preference for project identifiers
 * - 'code': Show project code as primary (e.g., "PRJ-001")
 * - 'name': Show project name as primary (e.g., "Website Redesign")
 */
export type ProjectDisplayPreference = 'code' | 'name';

/**
 * First day of the work week
 * Affects week calculations and calendar displays
 */
export type WeekStartDay = 'Monday' | 'Sunday' | 'Saturday';

/**
 * Application-wide settings derived from company configuration
 */
export interface AppSettings {
  /** Standard work week hours for the company (default: 40) */
  workWeekHours: number;
  
  /** How to display allocation values (hours or percentage) */
  displayPreference: DisplayPreference;
  
  /** First day of the work week */
  startOfWorkWeek: WeekStartDay;
  
  /** Whether to hide financial information throughout the app */
  hideFinancials: boolean;
  
  /** How to display project identifiers (code or name first) */
  projectDisplayPreference: ProjectDisplayPreference;
  
  /** 
   * Allocation percentage that triggers warning state (yellow)
   * @default 150
   */
  allocationWarningThreshold: number;
  
  /** 
   * Allocation percentage that triggers danger state (red)
   * @default 180
   */
  allocationDangerThreshold: number;
  
  /** 
   * Maximum allowed allocation percentage
   * @default 200
   */
  allocationMaxLimit: number;
}

/**
 * Hook to access application-wide settings from the company record
 * 
 * Settings are derived from the company's configuration in the database.
 * All settings have sensible defaults if the company record is not available
 * or specific fields are not set.
 * 
 * @returns {AppSettings} Current application settings
 * 
 * @example
 * ```ts
 * const { workWeekHours, displayPreference } = useAppSettings();
 * 
 * // Calculate utilization
 * const utilization = (allocatedHours / workWeekHours) * 100;
 * 
 * // Format based on preference
 * const display = displayPreference === 'hours' 
 *   ? `${allocatedHours}h` 
 *   : `${utilization.toFixed(0)}%`;
 * ```
 */
export const useAppSettings = (): AppSettings => {
  const { company } = useCompany();

  return useMemo(() => ({
    workWeekHours: company?.work_week_hours || 40,
    displayPreference: (company?.use_hours_or_percentage as DisplayPreference) || 'hours',
    startOfWorkWeek: (company?.start_of_work_week as WeekStartDay) || 'Monday',
    hideFinancials: company?.opt_out_financials === true,
    projectDisplayPreference: (company?.project_display_preference as ProjectDisplayPreference) || 'code',
    allocationWarningThreshold: company?.allocation_warning_threshold || 150,
    allocationDangerThreshold: company?.allocation_danger_threshold || 180,
    allocationMaxLimit: (company as any)?.allocation_max_limit || 200,
  }), [company]);
};
