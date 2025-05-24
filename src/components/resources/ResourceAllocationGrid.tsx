
import React, { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { format } from 'date-fns';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { GridLoadingState } from './grid/GridLoadingState';
import { GridEmptyState } from './grid/GridEmptyState';
import { useGridDays } from './hooks/useGridDays';
import { useFilteredProjects } from './hooks/useFilteredProjects';
import { Card, CardContent } from '@/components/ui/card';
import './resources-grid.css';

interface ResourceAllocationGridProps {
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

export const ResourceAllocationGrid: React.FC<ResourceAllocationGridProps> = ({
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

  // Calculate total width needed
  const fixedColumnsWidth = 320; // Project name column
  const dayColumnsWidth = days.length * 50; // 50px per day
  const totalWidth = fixedColumnsWidth + dayColumnsWidth + 200; // Extra padding

  console.log('ResourceAllocationGrid:', {
    daysCount: days.length,
    projectsCount: filteredProjects.length,
    containerWidth: `${totalWidth}px`
  });
  
  // Toggle project expansion
  const toggleProjectExpanded = (projectId: string) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]
    );
  };
  
  if (isLoading) {
    return <GridLoadingState />;
  }
  
  if (filteredProjects.length === 0) {
    return <GridEmptyState />;
  }
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="planning-container">
          <div 
            className="planning-scroll"
            style={{
              width: '100%',
              overflowX: 'auto',
              overflowY: 'visible'
            }}
          >
            <table 
              className="planning-table"
              style={{
                width: `${totalWidth}px`,
                minWidth: `${totalWidth}px`
              }}
            >
              <thead>
                <tr className="bg-gray-50">
                  <th 
                    className="sticky-project-col"
                    style={{ width: '320px', minWidth: '320px' }}
                  >
                    Project / Resource
                  </th>
                  {days.map((day, i) => (
                    <th 
                      key={i}
                      className="day-header"
                      style={{ width: '50px', minWidth: '50px' }}
                    >
                      <div className="text-xs">
                        {day.label}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {day.dayName.charAt(0)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project, index) => (
                  <tr key={project.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="sticky-project-col project-name-cell">
                      <div className="p-3 flex items-center gap-2">
                        <button 
                          onClick={() => toggleProjectExpanded(project.id)}
                          className="rounded-full p-1 hover:bg-white/30 transition-colors"
                        >
                          {expandedProjects.includes(project.id) ? '▼' : '▶'}
                        </button>
                        <div>
                          <div className="font-medium text-sm">{project.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span>{project.code}</span>
                            <span className="flex items-center gap-1">
                              👥 1 ⏱ 15h 💰 Not set
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    {days.map((day, i) => (
                      <td key={i} className="day-cell">
                        <div className="h-12 w-full flex items-center justify-center">
                          {/* Placeholder for allocation data */}
                          <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
