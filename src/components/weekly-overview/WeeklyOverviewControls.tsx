
import React from 'react';
import { WeekSelector } from './WeekSelector';
import { WeeklyResourceFilters } from './WeeklyResourceFilters';
import { WeeklyActionButtons } from './components/WeeklyActionButtons';

interface WeeklyOverviewControlsProps {
  selectedWeek: Date;
  setSelectedWeek: (date: Date) => void;
  weekLabel: string;
  filters: {
    office: string;
    country: string;
    manager: string;
    searchTerm: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export const WeeklyOverviewControls: React.FC<WeeklyOverviewControlsProps> = ({
  selectedWeek,
  setSelectedWeek,
  weekLabel,
  filters,
  onFilterChange
}) => {
  const handlePreviousWeek = () => {
    const newWeek = new Date(selectedWeek);
    newWeek.setDate(newWeek.getDate() - 7);
    setSelectedWeek(newWeek);
  };

  const handleNextWeek = () => {
    const newWeek = new Date(selectedWeek);
    newWeek.setDate(newWeek.getDate() + 7);
    setSelectedWeek(newWeek);
  };

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
      
      {/* Filters */}
      <div className="flex-1 max-w-xs border rounded-md p-2">
        <WeeklyResourceFilters 
          filters={filters}
          onFilterChange={onFilterChange}
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
  );
};
