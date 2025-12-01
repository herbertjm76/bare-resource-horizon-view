import { ProjectDisplayPreference } from '@/hooks/useAppSettings';

/**
 * Get the primary display text for a project based on company preferences
 */
export const getProjectDisplayName = (
  project: { code?: string; name?: string } | null | undefined,
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
 */
export const getProjectSecondaryText = (
  project: { code?: string; name?: string } | null | undefined,
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
 */
export const getProjectFullDisplay = (
  project: { code?: string; name?: string } | null | undefined,
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
