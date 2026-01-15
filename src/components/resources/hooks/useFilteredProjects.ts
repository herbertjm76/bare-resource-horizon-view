
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

const applyFilters = (project: Project, filters: ProjectFilters): boolean => {
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
};

export const useFilteredProjects = (
  projects: Project[],
  filters: ProjectFilters,
  officeStages: any[] = [],
  pinnedIds: string[] = []
) => {
  return useMemo(() => {
    // Separate pinned vs non-pinned projects
    // Pinned projects ALWAYS show regardless of filters
    const pinnedProjects = projects.filter(p => pinnedIds.includes(p.id));
    const unpinnedProjects = projects.filter(p => !pinnedIds.includes(p.id));

    // Apply filters ONLY to unpinned projects
    const filteredUnpinned = unpinnedProjects.filter(project => applyFilters(project, filters));

    // Sort pinned by their display order in pinnedIds array
    pinnedProjects.sort((a, b) => {
      return pinnedIds.indexOf(a.id) - pinnedIds.indexOf(b.id);
    });

    // Enhance pinned projects
    const enhancedPinned = pinnedProjects.map(project => ({
      ...project,
      officeStages: officeStages || [],
      isPinned: true
    }));

    // Enhance filtered unpinned projects
    const enhancedFiltered = filteredUnpinned.map(project => ({
      ...project,
      officeStages: officeStages || [],
      isPinned: false
    }));

    // Return pinned first, then filtered unpinned
    return [...enhancedPinned, ...enhancedFiltered];
  }, [projects, filters, officeStages, pinnedIds]);
};
