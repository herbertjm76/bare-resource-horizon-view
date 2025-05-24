
import React from 'react';
import { ResourceAllocationGrid } from './ResourceAllocationGrid';

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
    <div className="mt-4">
      <ResourceAllocationGrid 
        startDate={startDate}
        periodToShow={periodToShow}
        filters={filters}
        displayOptions={displayOptions}
      />
    </div>
  );
};
