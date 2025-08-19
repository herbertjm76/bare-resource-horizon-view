
import React from 'react';
import { OfficeSettingsProvider } from '@/context/officeSettings/OfficeSettingsContext';
import { ProjectResourcingHeader } from './ProjectResourcingHeader';
import { ProjectResourcingFilterRow } from './ProjectResourcingFilterRow';
import { ProjectResourcingSummaryCards } from './ProjectResourcingSummaryCards';
import { ModernResourceGrid } from '@/components/resources/modern/ModernResourceGrid';
import { useProjects } from '@/hooks/useProjects';
import { GridLoadingState } from '@/components/resources/grid/GridLoadingState';
import { BurnRateIndicator } from '@/components/resources/financial/BurnRateIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      
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

      {/* Financial Overview - Mock data for demonstration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects?.slice(0, 3).map((project) => (
              <BurnRateIndicator
                key={project.id}
                projectId={project.id}
                projectName={project.name}
                budgetAmount={100000}
                spentAmount={65000}
                burnRate={8500}
                runwayWeeks={6.2}
                utilizationRate={78}
                className="h-full"
              />
            ))}
          </div>
        </CardContent>
      </Card>

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
    <OfficeSettingsProvider>
      <ProjectResourcingInner {...props} />
    </OfficeSettingsProvider>
  );
};
