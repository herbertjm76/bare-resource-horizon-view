
import React from 'react';
import { WeeklyResourceTable } from './WeeklyResourceTable';
import { WeeklyOverviewControls } from './WeeklyOverviewControls';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';

interface WeeklyResourceSectionProps {
  selectedWeek: Date;
  handlePreviousWeek: () => void;
  handleNextWeek: () => void;
  weekLabel: string;
  filters: {
    office: string;
  };
  handleFilterChange: (key: string, value: string) => void;
}

export const WeeklyResourceSection: React.FC<WeeklyResourceSectionProps> = ({
  selectedWeek,
  handlePreviousWeek,
  handleNextWeek,
  weekLabel,
  filters,
  handleFilterChange
}) => {
  // Extend the filters to match the expected interface
  const extendedFilters = {
    office: filters.office,
    country: 'all',
    manager: 'all',
    searchTerm: ''
  };

  return (
    <>
      {/* Control bar with filters */}
      <WeeklyOverviewControls
        selectedWeek={selectedWeek}
        setSelectedWeek={() => {}} // This component uses different handler props
        weekLabel={weekLabel}
        filters={extendedFilters}
        onFilterChange={handleFilterChange}
      />
      
      <OfficeSettingsProvider>
        <WeeklyResourceTable 
          selectedWeek={selectedWeek} 
          filters={filters}
        />
      </OfficeSettingsProvider>
    </>
  );
};
