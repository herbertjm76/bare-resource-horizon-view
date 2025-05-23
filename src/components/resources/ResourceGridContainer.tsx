
import React from 'react';
import { ResourceAllocationGrid } from '@/components/resources/ResourceAllocationGrid';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';

interface ResourceGridContainerProps {
  startDate: Date;
  periodToShow: number;
  filters: {
    office: string;
    country: string;
    manager: string;
    searchTerm?: string;
  };
  displayOptions?: {
    showWeekends: boolean;
    showWorkdaysOnly: boolean;
  };
}

export const ResourceGridContainer: React.FC<ResourceGridContainerProps> = ({
  startDate,
  periodToShow,
  filters,
  displayOptions = { showWeekends: true, showWorkdaysOnly: false }
}) => {
  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <OfficeSettingsProvider>
        <ResourceAllocationGrid 
          startDate={startDate}
          periodToShow={periodToShow}
          filters={filters}
          displayOptions={displayOptions}
        />
      </OfficeSettingsProvider>
    </div>
  );
};
