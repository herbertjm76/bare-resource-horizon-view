
import React from 'react';
import { useProjects } from '@/hooks/useProjects';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { GridLoadingState } from './grid/GridLoadingState';
import { GridEmptyState } from './grid/GridEmptyState';
import { GridControls } from './grid/GridControls';
import { GridTableWrapper } from './grid/GridTableWrapper';
import { EnhancedResourceTable } from './grid/EnhancedResourceTable';
import { useGridDays } from './hooks/useGridDays';
import { useFilteredProjects } from './hooks/useFilteredProjects';
import { useGridTableWidth } from './hooks/useGridTableWidth';
import './enhanced-grid.css';

interface EnhancedResourceGridProps {
  startDate: Date;
  periodToShow: number;
  filters: {
    office: string;
    country: string;
    manager: string;
    searchTerm?: string;
  };
  displayOptions: {
    showWeekends: boolean;
    selectedDays: string[];
    weekStartsOnSunday: boolean;
  };
  expandedProjects?: string[];
  onToggleProjectExpand?: (projectId: string) => void;
  onExpandAll?: () => void;
  onCollapseAll?: () => void;
}

export const EnhancedResourceGrid: React.FC<EnhancedResourceGridProps> = ({
  startDate,
  periodToShow,
  filters,
  displayOptions,
  expandedProjects = [],
  onToggleProjectExpand,
  onExpandAll,
  onCollapseAll
}) => {
  const { projects, isLoading } = useProjects();
  const { office_stages } = useOfficeSettings();
  
  // Generate array of days for the selected period
  const days = useGridDays(startDate, periodToShow, displayOptions);

  // Filter and enhance projects
  const filteredProjects = useFilteredProjects(projects, filters, office_stages);

  // Calculate the table width
  const tableWidth = useGridTableWidth(days.length);
  
  // Default handlers if not provided
  const handleToggleProjectExpand = onToggleProjectExpand || (() => {});
  const handleExpandAll = onExpandAll || (() => {});
  const handleCollapseAll = onCollapseAll || (() => {});
  
  if (isLoading) {
    return <GridLoadingState />;
  }
  
  if (filteredProjects.length === 0) {
    return <GridEmptyState />;
  }
  
  return (
    <div className="w-full max-w-full space-y-6">
      {/* Key Metrics and Summary Cards would go here if they exist */}
      
      {/* Grid Controls (Expand/Collapse buttons) */}
      <GridControls
        projectCount={filteredProjects.length}
        periodToShow={periodToShow}
        onExpandAll={handleExpandAll}
        onCollapseAll={handleCollapseAll}
      />

      {/* Resource Grid Table */}
      <GridTableWrapper>
        <EnhancedResourceTable
          projects={filteredProjects}
          days={days}
          expandedProjects={expandedProjects}
          tableWidth={tableWidth}
          onToggleProjectExpand={handleToggleProjectExpand}
        />
      </GridTableWrapper>
    </div>
  );
};
