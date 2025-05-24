
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

  console.log('ResourceAllocationGrid:', {
    daysCount: days.length,
    projectsCount: filteredProjects.length
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
    <Card className="border shadow-sm h-full flex flex-col">
      <CardContent className="p-0 flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-20 bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th 
                    className="sticky left-0 z-30 bg-gray-50 border-r-2 border-gray-200 p-3 text-left font-medium"
                    style={{ width: '280px', minWidth: '280px' }}
                  >
                    Project / Resource
                  </th>
                  {days.map((day, i) => (
                    <th 
                      key={i}
                      className="border-r border-gray-200 p-2 text-center font-medium bg-gray-50"
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
                    <td 
                      className="sticky left-0 z-10 bg-inherit border-r-2 border-gray-200 border-b border-gray-100"
                      style={{ width: '280px', minWidth: '280px' }}
                    >
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
                      <td 
                        key={i} 
                        className="border-r border-gray-200 border-b border-gray-100 p-0"
                        style={{ width: '50px', minWidth: '50px' }}
                      >
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
