
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ModernGridHeader } from './ModernGridHeader';
import { ModernGridTable } from './ModernGridTable';
import { ModernGridControls } from './ModernGridControls';
import { useProjects } from '@/hooks/useProjects';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { useGridDays } from '../hooks/useGridDays';
import { useFilteredProjects } from '../hooks/useFilteredProjects';
import './modern-grid.css';

interface ModernResourceGridProps {
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
  onExpandAll: () => void;
  onCollapseAll: () => void;
  expandedProjects: string[];
  totalProjects: number;
}

export const ModernResourceGrid: React.FC<ModernResourceGridProps> = ({
  startDate,
  periodToShow,
  filters,
  displayOptions,
  onExpandAll,
  onCollapseAll,
  expandedProjects,
  totalProjects
}) => {
  const { projects, isLoading } = useProjects();
  const { office_stages } = useOfficeSettings();
  
  // Generate days for the selected period
  const days = useGridDays(startDate, periodToShow, displayOptions);
  
  // Filter projects
  const filteredProjects = useFilteredProjects(projects, filters, office_stages);
  
  // Toggle project expansion
  const toggleProjectExpanded = (projectId: string) => {
    const currentExpanded = expandedProjects.includes(projectId);
    if (currentExpanded) {
      // Collapse
      const newExpanded = expandedProjects.filter(id => id !== projectId);
      onCollapseAll(); // This will be updated to handle individual toggles
    } else {
      // Expand  
      onExpandAll(); // This will be updated to handle individual toggles
    }
  };

  if (isLoading) {
    return (
      <div className="modern-grid-loading">
        <div className="space-y-4">
          <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <Card className="modern-grid-empty">
        <div className="p-12 text-center">
          <div className="text-gray-400 text-lg mb-2">No projects found</div>
          <div className="text-gray-500 text-sm">
            Try adjusting your filters or search criteria
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="modern-resource-grid">
      {/* Grid Header with Metrics */}
      <ModernGridHeader 
        projectCount={filteredProjects.length}
        totalProjects={totalProjects}
        periodToShow={periodToShow}
        expandedCount={expandedProjects.length}
      />

      {/* Grid Controls */}
      <ModernGridControls
        projectCount={filteredProjects.length}
        expandedCount={expandedProjects.length}
        onExpandAll={onExpandAll}
        onCollapseAll={onCollapseAll}
      />

      {/* Main Grid Table */}
      <Card className="modern-grid-card">
        <ModernGridTable
          projects={filteredProjects}
          days={days}
          expandedProjects={expandedProjects}
          onToggleProjectExpand={toggleProjectExpanded}
        />
      </Card>
    </div>
  );
};
