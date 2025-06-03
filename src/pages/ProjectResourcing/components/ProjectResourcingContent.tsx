
import React from 'react';
import { OfficeSettingsProvider } from '@/context/officeSettings/OfficeSettingsContext';
import { ProjectResourcingFilters } from './ProjectResourcingFilters';
import { ProjectResourcingFilterRow } from './ProjectResourcingFilterRow';
import { GridControls } from '@/components/resources/grid/GridControls';
import { GridTableWrapper } from '@/components/resources/grid/GridTableWrapper';
import { EnhancedResourceTable } from '@/components/resources/grid/EnhancedResourceTable';
import { useGridDays } from '@/components/resources/hooks/useGridDays';
import { useFilteredProjects } from '@/components/resources/hooks/useFilteredProjects';
import { useGridTableWidth } from '@/components/resources/hooks/useGridTableWidth';
import { useProjects } from '@/hooks/useProjects';
import { useOfficeSettings } from '@/context/officeSettings/useOfficeSettings';
import { GridLoadingState } from '@/components/resources/grid/GridLoadingState';
import { GridEmptyState } from '@/components/resources/grid/GridEmptyState';

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
  const { office_stages } = useOfficeSettings();
  const [expandedProjects, setExpandedProjects] = React.useState<string[]>([]);
  
  // Generate array of days for the selected period
  const days = useGridDays(selectedMonth, filters.periodToShow, displayOptions);

  // Filter and enhance projects
  const filteredProjects = useFilteredProjects(projects, { ...filters, searchTerm }, office_stages);

  // Calculate the table width
  const tableWidth = useGridTableWidth(days.length);
  
  // Toggle project expansion
  const toggleProjectExpanded = (projectId: string) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]
    );
  };

  // Expand all projects
  const expandAll = () => {
    setExpandedProjects(filteredProjects.map(p => p.id));
  };

  // Collapse all projects
  const collapseAll = () => {
    setExpandedProjects([]);
  };

  const filterContent = (
    <ProjectResourcingFilters
      filters={filters}
      searchTerm={searchTerm}
      onFilterChange={onFilterChange}
      onPeriodChange={onPeriodChange}
      onSearchChange={onSearchChange}
      officeOptions={officeOptions}
      countryOptions={countryOptions}
      managers={managers}
      activeFiltersCount={activeFiltersCount}
      displayOptions={displayOptions}
      onDisplayOptionChange={onDisplayOptionChange}
    />
  );

  if (isLoading) {
    return <GridLoadingState />;
  }
  
  if (filteredProjects.length === 0) {
    return <GridEmptyState />;
  }

  return (
    <div className="w-full max-w-full overflow-hidden space-y-6">
      
      {/* Grid Controls */}
      <div className="w-full max-w-full overflow-x-auto sm:w-[calc(100vw-22rem)] sm:max-w-[calc(100vw-22rem)]">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <GridControls
            projectCount={filteredProjects.length}
            periodToShow={filters.periodToShow}
            onExpandAll={expandAll}
            onCollapseAll={collapseAll}
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="w-full max-w-full overflow-x-auto sm:w-[calc(100vw-22rem)] sm:max-w-[calc(100vw-22rem)]">
        <ProjectResourcingFilterRow
          selectedDate={selectedMonth}
          onDateChange={onMonthChange}
          periodToShow={filters.periodToShow}
          onPeriodChange={onPeriodChange}
          filterContent={filterContent}
          activeFiltersCount={activeFiltersCount}
          onClearFilters={onClearFilters}
        />
      </div>
      
      {/* Resource Grid Table */}
      <div className="w-full max-w-full overflow-x-auto sm:w-[calc(100vw-22rem)] sm:max-w-[calc(100vw-22rem)]">
        <GridTableWrapper>
          <EnhancedResourceTable
            projects={filteredProjects}
            days={days}
            expandedProjects={expandedProjects}
            tableWidth={tableWidth}
            onToggleProjectExpand={toggleProjectExpanded}
          />
        </GridTableWrapper>
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
