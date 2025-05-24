
import { useMemo } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';

export const useProjectResourcingData = () => {
  // Get project data
  const { projects, isLoading: isLoadingProjects } = useProjects();
  
  // Get team members data - passing true to include inactive members
  const { teamMembers, isLoading: isLoadingMembers } = useTeamMembersData(true);
  
  // Extract unique offices, countries, and managers for filters
  const officeOptions = useMemo(() => {
    return [...new Set(projects.map(p => p.office?.name).filter(Boolean))];
  }, [projects]);
  
  const countryOptions = useMemo(() => {
    return [...new Set(projects.map(p => p.country).filter(Boolean))];
  }, [projects]);
  
  const managers = useMemo(() => {
    return projects.reduce((acc, project) => {
      if (project.project_manager && !acc.some(m => m.id === project.project_manager.id)) {
        acc.push({
          id: project.project_manager.id,
          name: `${project.project_manager.first_name || ''} ${project.project_manager.last_name || ''}`.trim()
        });
      }
      return acc;
    }, [] as Array<{id: string, name: string}>);
  }, [projects]);

  return {
    projects,
    teamMembers,
    isLoadingProjects,
    isLoadingMembers,
    officeOptions,
    countryOptions,
    managers
  };
};
