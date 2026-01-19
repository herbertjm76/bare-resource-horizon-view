import { getProjectAbbreviation, getProjectTooltip } from '@/utils/projectDisplay';

interface Project {
  id: string;
  code: string;
  name: string;
  abbreviation?: string | null;
}

/**
 * Returns the display text for a project (abbreviation first, then name fallback)
 */
export const getProjectDisplayText = (project: Project): string => {
  return getProjectAbbreviation(project);
};

/**
 * Returns the tooltip text for a project (code - full name)
 */
export const getProjectTooltipText = (project: Project): string => {
  return getProjectTooltip(project);
};

/**
 * Hook that returns functions to get project display text
 */
export const useProjectDisplayText = () => {
  return {
    getDisplayText: (project: Project): string => getProjectDisplayText(project),
    getTooltipText: (project: Project): string => getProjectTooltipText(project),
  };
};
