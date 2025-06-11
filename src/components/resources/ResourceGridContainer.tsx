
import React from 'react';
import { ResourceAllocationGrid } from './ResourceAllocationGrid';
import { OfficeSettingsProvider } from '@/context/officeSettings/OfficeSettingsContext';

interface ResourceGridContainerProps {
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
  expandedProjects: string[];
  onToggleProjectExpand: (projectId: string) => void;
}

export const ResourceGridContainer: React.FC<ResourceGridContainerProps> = ({
  startDate,
  periodToShow,
  filters,
  displayOptions,
  expandedProjects,
  onToggleProjectExpand
}) => {
  return (
    <div className="mt-4 w-full max-w-full overflow-hidden">
      <OfficeSettingsProvider>
        <div className="w-full max-w-full overflow-x-auto sm:w-[calc(100vw-22rem)] sm:max-w-[calc(100vw-22rem)]">
          <ResourceAllocationGrid 
            startDate={startDate}
            periodToShow={periodToShow}
            filters={filters}
            displayOptions={displayOptions}
            expandedProjects={expandedProjects}
            onToggleProjectExpand={onToggleProjectExpand}
          />
        </div>
      </OfficeSettingsProvider>
    </div>
  );
};
