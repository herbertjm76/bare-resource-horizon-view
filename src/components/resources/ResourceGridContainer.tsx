
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
}

export const ResourceGridContainer: React.FC<ResourceGridContainerProps> = ({
  startDate,
  periodToShow,
  filters,
  displayOptions
}) => {
  return (
    <div className="mt-4 h-full flex flex-col min-h-0">
      <OfficeSettingsProvider>
        <div className="flex-1 min-h-0">
          <ResourceAllocationGrid 
            startDate={startDate}
            periodToShow={periodToShow}
            filters={filters}
            displayOptions={displayOptions}
          />
        </div>
      </OfficeSettingsProvider>
    </div>
  );
};
