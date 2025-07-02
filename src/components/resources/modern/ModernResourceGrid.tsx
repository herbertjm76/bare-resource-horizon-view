
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ModernGridHeader } from './ModernGridHeader';
import { ModernGridTable } from './ModernGridTable';
import { ModernGridControls } from './ModernGridControls';
import { useProjects } from '@/hooks/useProjects';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { useGridDays } from '../hooks/useGridDays';
import { useFilteredProjects } from '../hooks/useFilteredProjects';

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
  
  // Toggle individual project expansion
  const [localExpanded, setLocalExpanded] = useState<string[]>(expandedProjects);
  
  const toggleProjectExpanded = (projectId: string) => {
    setLocalExpanded(prev => {
      if (prev.includes(projectId)) {
        return prev.filter(id => id !== projectId);
      } else {
        return [...prev, projectId];
      }
    });
  };
  
  // Sync with parent component
  React.useEffect(() => {
    setLocalExpanded(expandedProjects);
  }, [expandedProjects]);

  if (isLoading) {
    return (
      <div className="grid-loading">
        <div className="space-y-4">
          <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <Card className="grid-empty">
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
    <div className="resource-grid-container">
      {/* Grid Header with Metrics */}
      <ModernGridHeader 
        projectCount={filteredProjects.length}
        totalProjects={totalProjects}
        periodToShow={periodToShow}
        expandedCount={localExpanded.length}
      />

      {/* Grid Controls */}
      <ModernGridControls
        projectCount={filteredProjects.length}
        expandedCount={localExpanded.length}
        onExpandAll={() => {
          const allIds = filteredProjects.map(p => p.id);
          setLocalExpanded(allIds);
          onExpandAll();
        }}
        onCollapseAll={() => {
          setLocalExpanded([]);
          onCollapseAll();
        }}
      />

      {/* Main Grid Table - Using same structure as team workload */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <ModernGridTable
            projects={filteredProjects}
            days={days}
            expandedProjects={localExpanded}
            onToggleProjectExpand={toggleProjectExpanded}
          />
        </CardContent>
      </Card>
    </div>
  );
};
