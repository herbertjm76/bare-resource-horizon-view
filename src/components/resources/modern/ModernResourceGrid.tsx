
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
  memberFilters
}) => {
  const shouldFetchProjects = !projectsProp;
  const { projects: fetchedProjects, isLoading: isLoadingProjects } = useProjects(sortBy, sortDirection, {
    enabled: shouldFetchProjects
  });
  const projects = projectsProp ?? fetchedProjects;

  // Project-level filtering driven by the "filter row" chips (department in Resource Scheduling).
  // This is intentionally separate from memberFilters filtering (which happens within each project row).
  const projectsFilteredByDepartment = React.useMemo(() => {
    if (!projects) return projects;
    if (!memberFilters?.department || memberFilters.department === 'all') return projects;
    return projects.filter((p: any) => (p.department ?? '') === memberFilters.department);
  }, [projects, memberFilters?.department]);

  const filteredProjects = useFilteredProjects(projectsFilteredByDepartment || [], filters);
  const weeks = useGridWeeks(startDate, periodToShow, displayOptions);

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

  if (isLoadingProjects) {
    return <GridLoadingState />;
  }

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
    />
  );
};
