import React, { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { addDays, format, startOfWeek, addWeeks } from 'date-fns';
import { ProjectRow } from '@/components/resources/ProjectRow';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { DragDropContext } from './DragDropContext';

interface ResourceAllocationGridProps {
  startDate: Date;
  weeksToShow: number;
  filters: {
    office: string;
    country: string;
    manager: string;
  };
}

export const ResourceAllocationGrid: React.FC<ResourceAllocationGridProps> = ({ 
  startDate, 
  weeksToShow,
  filters
}) => {
  const { projects, isLoading } = useProjects();
  const { office_stages } = useOfficeSettings();
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
  
  const mondayOfStartDate = startOfWeek(startDate, { weekStartsOn: 1 });
  const weeks = Array.from({ length: weeksToShow }, (_, i) => {
    const weekStart = addWeeks(mondayOfStartDate, i);
    return {
      startDate: weekStart,
      label: format(weekStart, 'MMM dd'),
      days: Array.from({ length: 7 }, (_, j) => addDays(weekStart, j))
    };
  });
  
  const filteredProjects = projects.filter(project => {
    if (filters.office !== "all" && project.office?.name !== filters.office) return false;
    if (filters.country !== "all" && project.country !== filters.country) return false;
    if (filters.manager !== "all" && project.project_manager?.id !== filters.manager) return false;
    return true;
  });
  
  const toggleProjectExpanded = (projectId: string) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId) 
        : [...prev, projectId]
    );
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }
  
  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground mb-2">No projects found matching your filters.</p>
        <Button variant="outline" onClick={() => window.location.href = '/projects'}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create a New Project
        </Button>
      </div>
    );
  }

  // Calculate the total width based on number of weeks, but make columns tighter
  const tableWidth = Math.max(800, weeksToShow * 40 + 262); // 40px per week + 262px for left columns (250 + 12)

  // Enhance projects with office stages data
  const projectsWithStageData = filteredProjects.map(project => {
    return {
      ...project,
      officeStages: office_stages || []
    };
  });

  return (
    <DragDropContext>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full border-collapse divide-y divide-gray-200" style={{ width: tableWidth + 'px' }}>
          <thead className="bg-muted/50 sticky top-0 z-20">
            <tr>
              {/* Resources count column */}
              <th className="sticky left-0 bg-muted/50 z-20 p-2 border-b text-center font-medium w-12">
                {/* Empty header for the counter column */}
              </th>
              {/* Project/Resource column */}
              <th className="sticky left-12 bg-muted/50 z-20 p-2 border-b text-left font-medium" style={{ minWidth: '250px' }}>
                Project / Resource
              </th>
              
              {/* Date columns - more compact columns */}
              {weeks.map((week, i) => (
                <th key={i} className="p-0 border-b text-center font-medium" style={{ width: '40px', minWidth: '40px' }}>
                  <div className="flex justify-center items-center h-20">
                    <span className="text-xs whitespace-nowrap transform -rotate-90 origin-center">{week.label}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projectsWithStageData.map((project, index) => (
              <ProjectRow 
                key={project.id}
                project={project}
                weeks={weeks}
                isExpanded={expandedProjects.includes(project.id)}
                onToggleExpand={() => toggleProjectExpanded(project.id)}
                isEven={index % 2 === 0}
              />
            ))}
          </tbody>
        </table>
      </div>
    </DragDropContext>
  );
};
