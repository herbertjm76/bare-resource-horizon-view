
import { useMemo } from 'react';

interface Project {
  id: string;
  name?: string;
  code?: string;
  office?: {
    name?: string;
  };
  country?: string;
  project_manager?: {
    id: string;
  };
  [key: string]: any;
}

interface ProjectFilters {
  office: string;
  country: string;
  manager: string;
  searchTerm?: string;
}

export const useFilteredProjects = (
  projects: Project[],
  filters: ProjectFilters,
  officeStages: any[] = []
) => {
  return useMemo(() => {
    // Filter projects based on criteria
    const filtered = projects.filter(project => {
      if (filters.office !== "all" && project.office?.name !== filters.office) return false;
      if (filters.country !== "all" && project.country !== filters.country) return false;
      if (filters.manager !== "all" && project.project_manager?.id !== filters.manager) return false;

      // Filter by search term if present
      if (filters.searchTerm && filters.searchTerm.trim() !== '') {
        const searchLower = filters.searchTerm.toLowerCase().trim();
        const projectNameMatch = project.name?.toLowerCase().includes(searchLower);
        const projectCodeMatch = project.code?.toLowerCase().includes(searchLower);
        if (!projectNameMatch && !projectCodeMatch) return false;
      }
      return true;
    });

    // Enhance projects with office stages data
    return filtered.map(project => {
      return {
        ...project,
        officeStages: officeStages || []
      };
    });
  }, [projects, filters, officeStages]);
};
