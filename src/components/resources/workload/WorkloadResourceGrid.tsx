import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WorkloadResourceTable } from './WorkloadResourceTable';
import { useProjects } from '@/hooks/useProjects';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { useGridDays } from '../hooks/useGridDays';
import { useFilteredProjects } from '../hooks/useFilteredProjects';
import './workload-resource-grid.css';

interface WorkloadResourceGridProps {
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

export const WorkloadResourceGrid: React.FC<WorkloadResourceGridProps> = ({
  startDate,
  periodToShow,
  filters,
  displayOptions
}) => {
  const { projects, isLoading } = useProjects();
  const { office_stages } = useOfficeSettings();
  
  // Generate days for the selected period
  const days = useGridDays(startDate, periodToShow, displayOptions);
  
  // Filter projects
  const filteredProjects = useFilteredProjects(projects, filters, office_stages);

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
    <Card className="border-none shadow-sm">
      <CardContent className="p-0">
        <WorkloadResourceTable
          projects={filteredProjects}
          days={days}
        />
      </CardContent>
    </Card>
  );
};
