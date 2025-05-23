
import React, { useState, useMemo } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { format, addDays, isWeekend, isSunday, startOfMonth, eachDayOfInterval, addWeeks } from 'date-fns';
import { ProjectRow } from '@/components/resources/ProjectRow';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import './resources-grid.css';

interface ResourceAllocationGridProps {
  startDate: Date;
  periodToShow: number; // Changed from weeksToShow to periodToShow
  filters: {
    office: string;
    country: string;
    manager: string;
    searchTerm?: string;
  };
}

export const ResourceAllocationGrid: React.FC<ResourceAllocationGridProps> = ({
  startDate,
  periodToShow,
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
  
  // Generate array of days for the selected period
  const days = useMemo(() => {
    const monthStart = startOfMonth(startDate);
    const endDate = addWeeks(monthStart, periodToShow);
    
    return eachDayOfInterval({
      start: monthStart,
      end: endDate
    }).map(day => {
      return {
        date: day,
        label: format(day, 'd'), // Day of month
        dayName: format(day, 'EEE'), // Short day name (Mon, Tue, etc.)
        monthLabel: format(day, 'MMM'), // Short month name
        isWeekend: isWeekend(day),
        isSunday: isSunday(day),
        isFirstOfMonth: day.getDate() === 1
      };
    });
  }, [startDate, periodToShow]);

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
    setExpandedProjects(prev => 
      prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]
    );
  };

  // Calculate the total width needed for the table - improved calculation
  const tableWidth = useMemo(() => {
    // Fixed columns: counter (48px) + project name (200px)
    const fixedColumnsWidth = 48 + 200;
    // Day columns: 30px per day (fixed width)
    const daysColumnsWidth = days.length * 30;
    // Add padding to ensure we have enough space
    return fixedColumnsWidth + daysColumnsWidth + 50;
  }, [days.length]);
  
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
          style={{
            width: `${tableWidth}px`,
            minWidth: '100%'
          }}
        >
          <thead>
            <tr>
              {/* Resources count column - frozen */}
              <th 
                className="sticky-left-0 bg-muted/50 z-30 border-b text-center font-medium w-12 shadow-[1px_0_0_0_#e5e7eb]" 
                style={{
                  width: '48px',
                  minWidth: '48px'
                }}
              >
                {/* Empty header for the counter column */}
              </th>
              
              {/* Project/Resource column - frozen */}
              <th 
                className="sticky-left-12 bg-muted/50 z-30 border-b text-left font-medium shadow-[1px_0_0_0_#e5e7eb]" 
                style={{
                  width: '200px',
                  minWidth: '200px'
                }}
              >
                Project / Resource
              </th>
              
              {/* Date columns - fixed width columns */}
              {days.map((day, i) => {
                const isWeekendClass = day.isWeekend ? 'bg-muted/40' : '';
                const isSundayClass = day.isSunday ? 'sunday-border' : '';
                const isFirstOfMonthClass = day.isFirstOfMonth ? 'border-l-2 border-l-brand-primary/40' : '';
                
                return (
                  <th 
                    key={i}
                    style={{
                      width: '30px',
                      minWidth: '30px'
                    }} 
                    className={`border-b text-center font-medium ${isWeekendClass} ${isSundayClass} ${isFirstOfMonthClass}`}
                  >
                    <div className="date-label flex flex-col items-center">
                      {/* Add month label for first of month */}
                      {day.isFirstOfMonth && (
                        <span className="text-[10px] text-muted-foreground">
                          {day.monthLabel}
                        </span>
                      )}
                      
                      {/* Always show day number */}
                      <span className="text-xs font-medium">
                        {day.label}
                      </span>
                      
                      {/* Day of week abbreviation */}
                      <span className="text-[10px] text-muted-foreground">
                        {day.dayName.charAt(0)}
                      </span>
                    </div>
                  </th>
                );
              })}
              
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
  );
};
