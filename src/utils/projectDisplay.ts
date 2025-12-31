/**
 * @fileoverview Project display utilities
 * 
 * Utilities for formatting project display text based on company preferences.
 * Companies can choose to display projects by code or name as the primary identifier.
 * 
 * @module utils/projectDisplay
 * 
 * @example
 * ```ts
 * import { getProjectDisplayName, getProjectFullDisplay } from '@/utils/projectDisplay';
 * import { useAppSettings } from '@/hooks/useAppSettings';
 * 
 * const { projectDisplayPreference } = useAppSettings();
 * const project = { code: 'PRJ-001', name: 'Website Redesign' };
 * 
 * // Primary display based on preference
 * getProjectDisplayName(project, 'code'); // 'PRJ-001'
 * getProjectDisplayName(project, 'name'); // 'Website Redesign'
 * 
 * // Full display with both values
 * getProjectFullDisplay(project, 'code'); // 'PRJ-001 - Website Redesign'
 * ```
 */

import { ProjectDisplayPreference } from '@/hooks/useAppSettings';

/**
 * Project data structure for display utilities
 */
interface ProjectDisplayData {
  /** Project code (e.g., 'PRJ-001') */
  code?: string;
  /** Project name (e.g., 'Website Redesign') */
  name?: string;
}

/**
 * Get the primary display text for a project based on company preferences
 * 
 * @param project - Project object with code and/or name
 * @param preference - Company's display preference ('code' or 'name')
 * @returns The primary display string, or empty string if project is null/undefined
 * 
 * @example
 * ```ts
 * getProjectDisplayName({ code: 'PRJ-001', name: 'Redesign' }, 'code');
 * // Returns: 'PRJ-001'
 * 
 * getProjectDisplayName({ code: 'PRJ-001', name: 'Redesign' }, 'name');
 * // Returns: 'Redesign'
 * ```
 */
export const getProjectDisplayName = (
  project: ProjectDisplayData | null | undefined,
  preference: ProjectDisplayPreference
): string => {
  if (!project) return '';
  
  if (preference === 'name') {
    return project.name || project.code || '';
  }
  
  return project.code || project.name || '';
};

/**
 * Get the secondary display text for a project based on company preferences
 * 
 * Returns the opposite of what getProjectDisplayName returns.
 * If preference is 'name', returns code. If preference is 'code', returns name.
 * 
 * @param project - Project object with code and/or name
 * @param preference - Company's display preference ('code' or 'name')
 * @returns The secondary display string, or empty string if not available
 * 
 * @example
 * ```ts
 * getProjectSecondaryText({ code: 'PRJ-001', name: 'Redesign' }, 'name');
 * // Returns: 'PRJ-001' (code is secondary when name is primary)
 * ```
 */
export const getProjectSecondaryText = (
  project: ProjectDisplayData | null | undefined,
  preference: ProjectDisplayPreference
): string => {
  if (!project) return '';
  
  if (preference === 'name') {
    return project.code || '';
  }
  
  return project.name || '';
};

/**
 * Get full display text with both code and name
 * 
 * Combines primary and secondary text with a separator.
 * Order depends on preference: primary first, secondary in parentheses or after dash.
 * 
 * @param project - Project object with code and/or name
 * @param preference - Company's display preference ('code' or 'name')
 * @returns Combined display string (e.g., 'PRJ-001 - Website Redesign')
 * 
 * @example
 * ```ts
 * getProjectFullDisplay({ code: 'PRJ-001', name: 'Redesign' }, 'code');
 * // Returns: 'PRJ-001 - Redesign'
 * 
 * getProjectFullDisplay({ code: 'PRJ-001' }, 'code');
 * // Returns: 'PRJ-001' (no secondary text)
 * ```
 */
export const getProjectFullDisplay = (
  project: ProjectDisplayData | null | undefined,
  preference: ProjectDisplayPreference
): string => {
  if (!project) return '';
  
  const primary = getProjectDisplayName(project, preference);
  const secondary = getProjectSecondaryText(project, preference);
  
  if (primary && secondary) {
    return `${primary} - ${secondary}`;
  }
  
  return primary || secondary;
};
