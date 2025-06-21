
import React from 'react';
import { WeekSelector } from './WeekSelector';
import { WeeklyResourceFilters } from './WeeklyResourceFilters';
import { WeeklyActionButtons } from './components/WeeklyActionButtons';

interface WeeklyOverviewControlsProps {
  selectedWeek: Date;
  handlePreviousWeek: () => void;
  handleNextWeek: () => void;
  weekLabel: string;
  filters: {
    office: string;
  };
  handleFilterChange: (key: string, value: string) => void;
}

export const WeeklyOverviewControls: React.FC<WeeklyOverviewControlsProps> = ({
  selectedWeek,
  handlePreviousWeek,
  handleNextWeek,
  weekLabel,
  filters,
  handleFilterChange
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4 print:hidden">
      {/* Week selector */}
      <div className="flex border rounded-md p-2 items-center">
        <WeekSelector 
          selectedWeek={selectedWeek}
          onPreviousWeek={handlePreviousWeek}
          onNextWeek={handleNextWeek}
          weekLabel={weekLabel}
        />
      </div>
      
      {/* Right side controls - Filters and Export */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Filters */}
        <div className="flex-1 max-w-xs border rounded-md p-2">
          <WeeklyResourceFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
        
        {/* Export button */}
        <div className="flex items-center">
          <WeeklyActionButtons 
            selectedWeek={selectedWeek}
            weekLabel={weekLabel}
          />
        </div>
      </div>
    </div>
  );
};
