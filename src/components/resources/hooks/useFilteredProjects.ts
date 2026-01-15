
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
  status: string;
  searchTerm?: string;
}

export const useFilteredProjects = (
  projects: Project[],
  filters: ProjectFilters,
  officeStages: any[] = [],
  pinnedIds: string[] = []
) => {
  return useMemo(() => {
    // Filter projects based on criteria
    const filtered = projects.filter(project => {
      if (filters.office !== "all" && project.office?.name !== filters.office) return false;
      if (filters.country !== "all" && project.country !== filters.country) return false;
      if (filters.manager !== "all" && project.project_manager?.id !== filters.manager) return false;
      if (filters.status !== "all" && project.status !== filters.status) return false;

      // Filter by search term if present
      if (filters.searchTerm && filters.searchTerm.trim() !== '') {
        const searchLower = filters.searchTerm.toLowerCase().trim();
        const projectNameMatch = project.name?.toLowerCase().includes(searchLower);
        const projectCodeMatch = project.code?.toLowerCase().includes(searchLower);
        if (!projectNameMatch && !projectCodeMatch) return false;
      }
      return true;
    });

    // Enhance projects with office stages data and pinned status
    const enhanced = filtered.map(project => {
      return {
        ...project,
        officeStages: officeStages || [],
        isPinned: pinnedIds.includes(project.id)
      };
    });

    // Sort with pinned items first
    if (pinnedIds.length > 0) {
      enhanced.sort((a, b) => {
        const aIsPinned = pinnedIds.includes(a.id);
        const bIsPinned = pinnedIds.includes(b.id);
        if (aIsPinned && !bIsPinned) return -1;
        if (!aIsPinned && bIsPinned) return 1;
        // Maintain pin order based on pinnedIds array order
        if (aIsPinned && bIsPinned) {
          return pinnedIds.indexOf(a.id) - pinnedIds.indexOf(b.id);
        }
        return 0;
      });
    }

    return enhanced;
  }, [projects, filters, officeStages, pinnedIds]);
};

