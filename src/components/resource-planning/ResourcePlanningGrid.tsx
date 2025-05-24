
import React from 'react';
import { useProjects } from '@/hooks/useProjects';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { useFilteredProjects } from '@/components/resources/hooks/useFilteredProjects';
import { useGridDays } from '@/components/resources/hooks/useGridDays';
import './resource-planning.css';

interface ResourcePlanningGridProps {
  startDate: Date;
  periodToShow: number;
  filters: {
    office: string;
    country: string;
    manager: string;
    searchTerm?: string;
  };
}

export const ResourcePlanningGrid: React.FC<ResourcePlanningGridProps> = ({
  startDate,
  periodToShow,
  filters
}) => {
  const { projects, isLoading } = useProjects();
  const { office_stages } = useOfficeSettings();

  // Generate days for the grid
  const days = useGridDays(startDate, periodToShow, {
    showWeekends: false,
    selectedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    weekStartsOnSunday: false
  });

  // Filter projects
  const filteredProjects = useFilteredProjects(projects, filters, office_stages);

  console.log('ResourcePlanningGrid:', {
    daysCount: days.length,
    projectsCount: filteredProjects.length,
    containerWidth: `${320 + (days.length * 50)}px`
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading projects...</div>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">No projects found matching your criteria</div>
      </div>
    );
  }

  // Calculate total width needed
  const fixedColumnsWidth = 320; // Project name column
  const dayColumnsWidth = days.length * 50; // 50px per day
  const totalWidth = fixedColumnsWidth + dayColumnsWidth + 200; // Extra padding

  return (
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
                  <div className="p-3">
                    <div className="font-medium text-sm">{project.name}</div>
                    <div className="text-xs text-muted-foreground">{project.code}</div>
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
  );
};
