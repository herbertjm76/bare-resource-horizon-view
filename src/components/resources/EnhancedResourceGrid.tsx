
import React, { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { format } from 'date-fns';
import { ProjectRow } from '@/components/resources/ProjectRow';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { GridDaysHeader } from './grid/GridDaysHeader';
import { GridLoadingState } from './grid/GridLoadingState';
import { GridEmptyState } from './grid/GridEmptyState';
import { useGridDays } from './hooks/useGridDays';
import { useFilteredProjects } from './hooks/useFilteredProjects';
import { useGridTableWidth } from './hooks/useGridTableWidth';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Expand, Shrink } from 'lucide-react';
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
    <div className="w-full max-w-full space-y-4">
      {/* Grid Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg border shadow-sm">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {filteredProjects.length} Projects
          </Badge>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            {periodToShow} Weeks View
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={expandAll}
            className="text-xs"
          >
            <Expand className="h-3 w-3 mr-1" />
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={collapseAll}
            className="text-xs"
          >
            <Shrink className="h-3 w-3 mr-1" />
            Collapse All
          </Button>
        </div>
      </div>

      {/* Enhanced Grid Container */}
      <Card className="w-full overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/30">
        <div className="enhanced-grid-scroll">
          <div className="enhanced-grid-container">
            <table 
              className="enhanced-resource-table" 
              style={{
                width: `${tableWidth}px`,
                minWidth: 'max-content'
              }}
            >
              <thead>
                <GridDaysHeader days={days} />
              </thead>
              <tbody>
                {filteredProjects.map((project, index) => (
                  <ProjectRow 
                    key={project.id} 
                    project={project} 
                    days={days} 
                    isExpanded={expandedProjects.includes(project.id)} 
                    onToggleExpand={() => toggleProjectExpanded(project.id)} 
                    isEven={index % 2 === 0} 
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};
