
import React from 'react';
import { OfficeSettingsProvider } from '@/context/officeSettings/OfficeSettingsContext';
import { StreamlinedProjectResourcingHeader } from './StreamlinedProjectResourcingHeader';
import { StreamlinedActionBar } from './StreamlinedActionBar';
import { ModernResourceGrid } from '@/components/resources/modern/ModernResourceGrid';
import { useProjects } from '@/hooks/useProjects';
import { GridLoadingState } from '@/components/resources/grid/GridLoadingState';
import { useProjectResourcingSummary } from '../hooks/useProjectResourcingSummary';

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
  const { 
    availableThisMonth,
    multiProjectLoad, 
    overloadedResources,
    isLoading: isSummaryLoading 
  } = useProjectResourcingSummary(selectedMonth, filters.periodToShow);
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
    <div className="space-y-3">
      
      {/* Compact Action Bar */}
      <StreamlinedActionBar
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
      
      {/* Content-First Main Table */}
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
    <OfficeSettingsProvider>
      <ProjectResourcingInner {...props} />
    </OfficeSettingsProvider>
  );
};
