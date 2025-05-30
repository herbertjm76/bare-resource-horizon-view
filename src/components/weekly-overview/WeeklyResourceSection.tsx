
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
  return (
    <>
      {/* Control bar with filters */}
      <WeeklyOverviewControls
        selectedWeek={selectedWeek}
        handlePreviousWeek={handlePreviousWeek}
        handleNextWeek={handleNextWeek}
        weekLabel={weekLabel}
        filters={filters}
        handleFilterChange={handleFilterChange}
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
