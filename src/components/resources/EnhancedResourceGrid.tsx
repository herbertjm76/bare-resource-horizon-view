
import React, { useState } from 'react';
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
}

export const EnhancedResourceGrid: React.FC<EnhancedResourceGridProps> = ({
  startDate,
  periodToShow,
  filters,
  displayOptions
}) => {
  const { projects, isLoading } = useProjects();
  const { office_stages } = useOfficeSettings();
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
  
  // Generate array of days for the selected period
  const days = useGridDays(startDate, periodToShow, displayOptions);

  // Filter and enhance projects
  const filteredProjects = useFilteredProjects(projects, filters, office_stages);

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
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
      />

      {/* Resource Grid Table */}
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
  );
};
