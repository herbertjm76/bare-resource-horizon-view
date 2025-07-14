
import React from 'react';
import { OfficeSettingsProvider } from '@/context/officeSettings/OfficeSettingsContext';
import { ProjectResourcingHeader } from './ProjectResourcingHeader';
import { ProjectResourcingFilterRow } from './ProjectResourcingFilterRow';
import { ProjectResourcingSummaryCards } from './ProjectResourcingSummaryCards';
import { ModernResourceGrid } from '@/components/resources/modern/ModernResourceGrid';
import { useProjects } from '@/hooks/useProjects';
import { GridLoadingState } from '@/components/resources/grid/GridLoadingState';

interface ProjectResourcingContentProps {
  selectedMonth: Date;
  searchTerm: string;
  filters: {
    office: string;
    country: string;
    manager: string;
    periodToShow: number;
  };
  displayOptions: {
    showWeekends: boolean;
    selectedDays: string[];
    weekStartsOnSunday: boolean;
  };
  officeOptions: string[];
  countryOptions: string[];
  managers: Array<{id: string, name: string}>;
  activeFiltersCount: number;
  onMonthChange: (date: Date) => void;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: string, value: string) => void;
  onPeriodChange: (period: number) => void;
  onDisplayOptionChange: (option: string, value: boolean | string[]) => void;
  onClearFilters: () => void;
}

// Inner component that uses office settings
const ProjectResourcingInner: React.FC<ProjectResourcingContentProps> = ({
  selectedMonth,
  searchTerm,
  filters,
  displayOptions,
  officeOptions,
  countryOptions,
  managers,
  activeFiltersCount,
  onMonthChange,
  onSearchChange,
  onFilterChange,
  onPeriodChange,
  onDisplayOptionChange,
  onClearFilters
}) => {
  const { projects, isLoading } = useProjects();
  const [expandedProjects, setExpandedProjects] = React.useState<string[]>([]);
  
  // Expand all projects
  const expandAll = () => {
    if (projects) {
      setExpandedProjects(projects.map(p => p.id));
    }
  };

  // Collapse all projects
  const collapseAll = () => {
    setExpandedProjects([]);
  };

  // Toggle individual project
  const handleToggleProjectExpand = (projectId: string) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const totalProjects = projects?.length || 0;

  // Combine filters with search term for filtering
  const combinedFilters = {
    ...filters,
    searchTerm
  };

  if (isLoading) {
    return <GridLoadingState />;
  }

  return (
    <div className="w-full max-w-full overflow-hidden space-y-6 bg-gray-50">
      
      {/* Header with metrics */}
      <ProjectResourcingHeader 
        projectCount={totalProjects}
        periodToShow={filters.periodToShow}
      />

      {/* Summary Cards */}
      <ProjectResourcingSummaryCards 
        selectedMonth={selectedMonth}
        periodToShow={filters.periodToShow}
      />

      {/* Filter Row with expand/collapse controls */}
      <div className="w-full max-w-full overflow-hidden">
        <ProjectResourcingFilterRow
          selectedDate={selectedMonth}
          onDateChange={onMonthChange}
          periodToShow={filters.periodToShow}
          onPeriodChange={onPeriodChange}
          filters={filters}
          searchTerm={searchTerm}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          officeOptions={officeOptions}
          countryOptions={countryOptions}
          managers={managers}
          activeFiltersCount={activeFiltersCount}
          displayOptions={displayOptions}
          onDisplayOptionChange={onDisplayOptionChange}
          onClearFilters={onClearFilters}
          onExpandAll={expandAll}
          onCollapseAll={collapseAll}
          expandedProjects={expandedProjects}
          totalProjects={totalProjects}
        />
      </div>
      
      {/* Modern Resource Grid with original styling */}
      <div className="w-full max-w-full overflow-hidden">
        <ModernResourceGrid
          startDate={selectedMonth}
          periodToShow={filters.periodToShow}
          filters={combinedFilters}
          displayOptions={displayOptions}
          onExpandAll={expandAll}
          onCollapseAll={collapseAll}
          expandedProjects={expandedProjects}
          totalProjects={totalProjects}
          onToggleProjectExpand={handleToggleProjectExpand}
        />
      </div>
    </div>
  );
};

export const ProjectResourcingContent: React.FC<ProjectResourcingContentProps> = (props) => {
  return (
    <div className="flex flex-col max-w-full bg-gray-50">
      <OfficeSettingsProvider>
        <ProjectResourcingInner {...props} />
      </OfficeSettingsProvider>
    </div>
  );
};
