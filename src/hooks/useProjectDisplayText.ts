import { useAppSettings, ProjectDisplayPreference } from '@/hooks/useAppSettings';

interface Project {
  id: string;
  code: string;
  name: string;
}

/**
 * Returns the display text for a project based on user preference
 */
export const getProjectDisplayText = (
  project: Project,
  preference: ProjectDisplayPreference
): string => {
  return preference === 'name' ? project.name : project.code;
};

/**
 * Hook that returns a function to get project display text based on settings
 */
export const useProjectDisplayText = () => {
  const { projectDisplayPreference } = useAppSettings();
  
  return (project: Project): string => {
    return getProjectDisplayText(project, projectDisplayPreference);
  };
};
