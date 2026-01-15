
import React from 'react';
import { WorkloadStyleResourceGrid } from './WorkloadStyleResourceGrid';
import { startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { useProjects } from '@/hooks/useProjects';
import { useFilteredProjects } from '../hooks/useFilteredProjects';
import { useGridWeeks } from '../hooks/useGridWeeks';
import { GridLoadingState } from '../grid/GridLoadingState';
import { GridEmptyState } from '../grid/GridEmptyState';

interface MemberFilters {
  practiceArea: string;
  department: string;
  location: string;
  searchTerm: string;
}

interface ModernResourceGridProps {
  startDate: Date;
  periodToShow: number;
  sortBy?: 'name' | 'code' | 'status' | 'created';
  sortDirection?: 'asc' | 'desc';
  // When provided, avoids refetching projects and prevents repeated "failed loading projects" toasts
  projects?: any[];
  filters: any;
  displayOptions: any;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
  expandedProjects: string[];
  totalProjects: number;
  onToggleProjectExpand: (projectId: string) => void;
  memberFilters?: MemberFilters;
  // External loading state (when projects passed from parent)
  isLoading?: boolean;
  // Pinned items support
  pinnedIds?: string[];
  onTogglePin?: (projectId: string) => void;
}

export const ModernResourceGrid: React.FC<ModernResourceGridProps> = ({
  startDate,
  periodToShow,
  sortBy = 'created',
  sortDirection = 'asc',
  projects: projectsProp,
  filters,
  displayOptions,
  onExpandAll,
  onCollapseAll,
  expandedProjects,
  totalProjects,
  onToggleProjectExpand,
  memberFilters,
  isLoading: externalIsLoading,
  pinnedIds,
  onTogglePin
}) => {
  const shouldFetchProjects = !projectsProp;
  const { projects: fetchedProjects, isLoading: isLoadingProjects } = useProjects(sortBy, sortDirection, {
    enabled: shouldFetchProjects
  });
  const projects = projectsProp ?? fetchedProjects;

  // Stable cache ref to prevent flicker during transient loading states
  const lastValidProjectsRef = React.useRef<any[]>([]);

  // Project-level filtering driven by the "filter row" chips (department in Resource Scheduling).
  // This is intentionally separate from memberFilters filtering (which happens within each project row).
  const projectsFilteredByDepartment = React.useMemo(() => {
    // If projects is null/undefined during a transient state, return cached data
    if (!projects || projects.length === 0) {
      // Only return cached data if we're in a transient loading state
      if (isLoadingProjects || externalIsLoading) {
        return lastValidProjectsRef.current;
      }
      return projects ?? [];
    }
    
    const selected = memberFilters?.department;
    if (!selected || selected === 'all') {
      lastValidProjectsRef.current = projects;
      return projects;
    }

    const normalize = (v: unknown) => String(v ?? '').trim().toLowerCase();
    const selectedNorm = normalize(selected);

    // Use EXACT matching on department name (case-insensitive, trimmed).
    // Previous loose matching with includes() caused false positives 
    // (e.g., "Hospitality" matching projects with "Hospital" in name).
    const result = projects.filter((p: any) => {
      const deptNorm = normalize(p?.department);
      return deptNorm === selectedNorm;
    });
    
    lastValidProjectsRef.current = result;
    return result;
  }, [projects, memberFilters?.department, isLoadingProjects, externalIsLoading]);

  const filteredProjects = useFilteredProjects(projectsFilteredByDepartment || [], filters, [], pinnedIds || []);
  const weeks = useGridWeeks(startDate, periodToShow, displayOptions);

  // Debug: see why results go empty after a brief render (DEV only)
  React.useEffect(() => {
    if (!import.meta.env.DEV) return;
    // eslint-disable-next-line no-console
    console.log('[ModernResourceGrid] pipeline', {
      memberDepartment: memberFilters?.department,
      isLoadingProjects,
      externalIsLoading,
      projectsCount: projects?.length ?? 0,
      deptFilteredCount: projectsFilteredByDepartment?.length ?? 0,
      finalFilteredCount: filteredProjects?.length ?? 0,
      statusFilter: (filters as any)?.status,
      searchTerm: (filters as any)?.searchTerm,
    });
  }, [
    memberFilters?.department,
    isLoadingProjects,
    externalIsLoading,
    projects,
    projectsFilteredByDepartment,
    filteredProjects,
    filters,
  ]);

  // On tablet and mobile, only show a single week column (prefer THIS WEEK)
  const displayedWeeks = React.useMemo(() => {
    if (!weeks || weeks.length === 0) return weeks;

    if (typeof window === 'undefined') return weeks;
    const isMobileOrTablet = window.innerWidth <= 1024;
    if (!isMobileOrTablet) return weeks;

    const today = startOfDay(new Date());

    const currentWeek = weeks.find((week) =>
      isWithinInterval(today, {
        start: startOfDay(week.weekStartDate),
        end: endOfDay(week.weekEndDate)
      })
    );

    if (currentWeek) {
      return [currentWeek];
    }

    // Fallback: still show only the first available week to keep grid compact
    return weeks.length > 0 ? [weeks[0]] : weeks;
  }, [weeks]);

  // Show loading state only when we truly have no data yet (prevents flicker during background refetches)
  if ((isLoadingProjects || externalIsLoading) && (!projects || projects.length === 0)) {
    return <GridLoadingState />;
  }

  // Only show empty state if we're truly done loading and have no projects
  if (!filteredProjects?.length) {
    return <GridEmptyState />;
  }

  return (
    <WorkloadStyleResourceGrid
      projects={filteredProjects}
      weeks={displayedWeeks}
      expandedProjects={expandedProjects}
      onToggleProjectExpand={onToggleProjectExpand}
      selectedDate={startDate}
      periodToShow={periodToShow}
      memberFilters={memberFilters}
      pinnedIds={pinnedIds}
      onTogglePin={onTogglePin}
    />
  );
};
