
import React from 'react';
import { ResourceAllocationGrid } from '@/components/resources/ResourceAllocationGrid';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';

interface ResourceGridContainerProps {
  startDate: Date;
  periodToShow: number; // Changed from weeksToShow to periodToShow
  filters: {
    office: string;
    country: string;
    manager: string;
    searchTerm?: string;
  };
}

export const ResourceGridContainer: React.FC<ResourceGridContainerProps> = ({
  startDate,
  periodToShow,
  filters
}) => {
  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <OfficeSettingsProvider>
        <ResourceAllocationGrid 
          startDate={startDate}
          periodToShow={periodToShow}
          filters={filters}
        />
      </OfficeSettingsProvider>
    </div>
  );
};
