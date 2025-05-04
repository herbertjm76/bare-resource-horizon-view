
import React, { useState, useMemo } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { addDays, format, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { ProjectRow } from '@/components/resources/ProjectRow';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import './resources-grid.css';

interface ResourceAllocationGridProps {
  startDate: Date;
  weeksToShow: number;
  filters: {
    office: string;
    country: string;
    manager: string;
    searchTerm?: string;
  };
}

export const ResourceAllocationGrid: React.FC<ResourceAllocationGridProps> = ({
  startDate,
  weeksToShow,
  filters
}) => {
  const {
    projects,
    isLoading
  } = useProjects();
  const {
    office_stages
  } = useOfficeSettings();
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);

  // Get Monday of the start date
  const mondayOfStartDate = startOfWeek(startDate, {
    weekStartsOn: 1
  });

  // Generate array of weeks
  const weeks = Array.from({
    length: weeksToShow
  }, (_, i) => {
    const weekStart = addWeeks(mondayOfStartDate, i);
    return {
      startDate: weekStart,
      label: format(weekStart, 'MMM dd'),
      days: Array.from({
        length: 7
      }, (_, j) => addDays(weekStart, j))
    };
  });

  // Filter projects based on criteria including search term
  const filteredProjects = projects.filter(project => {
    if (filters.office !== "all" && project.office?.name !== filters.office) return false;
    if (filters.country !== "all" && project.country !== filters.country) return false;
    if (filters.manager !== "all" && project.project_manager?.id !== filters.manager) return false;
    
    // Filter by search term if present
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      const searchLower = filters.searchTerm.toLowerCase().trim();
      const projectNameMatch = project.name?.toLowerCase().includes(searchLower);
      const projectCodeMatch = project.code?.toLowerCase().includes(searchLower);
      
      if (!projectNameMatch && !projectCodeMatch) return false;
    }
    
    return true;
  });

  // Toggle project expansion
  const toggleProjectExpanded = (projectId: string) => {
    setExpandedProjects(prev => prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]);
  };
  
  // Calculate the total width needed for the table - improved calculation
  const tableWidth = useMemo(() => {
    // Fixed columns: counter (48px) + project name (200px)
    const fixedColumnsWidth = 48 + 200;
    // Week columns: 35px per day (fixed width)
    const weekColumnsWidth = weeks.length * 35;
    // Add padding to ensure we have enough space
    return fixedColumnsWidth + weekColumnsWidth + 50;
  }, [weeks.length]);

  if (isLoading) {
    return <div className="text-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading projects...</p>
      </div>;
  }
  
  if (filteredProjects.length === 0) {
    return <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground mb-2">No projects found matching your filters.</p>
        <Button variant="outline" onClick={() => window.location.href = '/projects'}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create a New Project
        </Button>
      </div>;
  }

  // Enhance projects with office stages data
  const projectsWithStageData = filteredProjects.map(project => {
    return {
      ...project,
      officeStages: office_stages || []
    };
  });
  
  return (
    <div className="grid-table-outer-container">
      <div className="grid-table-container">
        <table 
          className="resource-allocation-table" 
          style={{ width: `${tableWidth}px`, minWidth: '100%' }}
        >
          <thead>
            <tr>
              {/* Resources count column - frozen */}
              <th className="sticky-left-0 bg-muted/50 z-30 border-b text-center font-medium w-12 shadow-[1px_0_0_0_#e5e7eb]" style={{
                width: '48px',
                minWidth: '48px'
              }}>
                {/* Empty header for the counter column */}
              </th>
              
              {/* Project/Resource column - frozen */}
              <th className="sticky-left-12 bg-muted/50 z-30 border-b text-left font-medium shadow-[1px_0_0_0_#e5e7eb]" style={{
                width: '200px',
                minWidth: '200px'
              }}>
                Project / Resource
              </th>
              
              {/* Date columns - fixed width columns */}
              {weeks.map((week, i) => (
                <th 
                  key={i} 
                  style={{
                    width: '35px',
                    minWidth: '35px'
                  }} 
                  className="border-b text-center font-medium"
                >
                  <div className="date-label">
                    <span>{week.label}</span>
                  </div>
                </th>
              ))}
              
              {/* Blank flexible column */}
              <th className="border-b text-center font-medium">
                {/* Empty space to allow horizontal scrolling */}
              </th>
            </tr>
          </thead>
          <tbody>
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
    </div>
  );
};

