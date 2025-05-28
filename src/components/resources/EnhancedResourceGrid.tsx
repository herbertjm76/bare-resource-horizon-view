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
import { ExpandIcon, Expand, Shrink, Users, Target } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('detailed');
  
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

  // Calculate grid statistics - we'll show project count instead of resource count for now
  // since resources aren't fetched at the project level in the current implementation
  const totalProjects = filteredProjects.length;

  const utilizationData = filteredProjects.map(project => ({
    name: project.name,
    utilization: Math.floor(Math.random() * 100) // TODO: Calculate real utilization
  }));
  
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
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-brand-violet" />
            <span className="text-sm font-medium">Grid View</span>
          </div>
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

      {/* Grid Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Projects</p>
              <p className="text-2xl font-bold text-blue-800">{filteredProjects.length}</p>
            </div>
            <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">Active Filters</p>
              <p className="text-2xl font-bold text-emerald-800">
                {[filters.office, filters.country, filters.manager].filter(f => f !== 'all').length + (filters.searchTerm ? 1 : 0)}
              </p>
            </div>
            <div className="h-10 w-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-violet-50 to-violet-100/50 border-violet-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-violet-600 font-medium">Period</p>
              <p className="text-2xl font-bold text-violet-800">{periodToShow} weeks</p>
            </div>
            <div className="h-10 w-10 bg-violet-500 rounded-lg flex items-center justify-center">
              <ExpandIcon className="h-5 w-5 text-white" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
