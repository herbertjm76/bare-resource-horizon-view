
import React from 'react';
import { EnhancedResourceGrid } from './EnhancedResourceGrid';
import { OfficeSettingsProvider } from '@/context/officeSettings/OfficeSettingsContext';

interface ModernResourceGridContainerProps {
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

export const ModernResourceGridContainer: React.FC<ModernResourceGridContainerProps> = ({
  startDate,
  periodToShow,
  filters,
  displayOptions
}) => {
  return (
    <div className="mt-6 w-full max-w-full overflow-hidden">
      <OfficeSettingsProvider>
        <div className="w-full max-w-full overflow-x-auto sm:w-[calc(100vw-22rem)] sm:max-w-[calc(100vw-22rem)]">
          <EnhancedResourceGrid 
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
