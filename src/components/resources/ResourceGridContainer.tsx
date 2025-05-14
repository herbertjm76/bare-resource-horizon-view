
import React from 'react';
import { ResourceAllocationGrid } from '@/components/resources/ResourceAllocationGrid';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';

interface ResourceGridContainerProps {
  startDate: Date;
  weeksToShow: number;
  filters: {
    office: string;
    country: string;
    manager: string;
    searchTerm?: string;
  };
}

export const ResourceGridContainer: React.FC<ResourceGridContainerProps> = ({
  startDate,
  weeksToShow,
  filters
}) => {
  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <OfficeSettingsProvider>
        <ResourceAllocationGrid 
          startDate={startDate}
          weeksToShow={weeksToShow}
          filters={filters}
        />
      </OfficeSettingsProvider>
    </div>
  );
};
