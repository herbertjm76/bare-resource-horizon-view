
import React from 'react';
import { WeeklyOverviewHeader } from './WeeklyOverviewHeader';
import { WeeklyExecutiveSummary } from './WeeklyExecutiveSummary';
import { WeeklyResourceSection } from './WeeklyResourceSection';

interface WeeklyOverviewContentProps {
  selectedWeek: Date;
  handlePreviousWeek: () => void;
  handleNextWeek: () => void;
  weekLabel: string;
  summaryFormat: 'simple' | 'detailed';
  setSummaryFormat: (format: 'simple' | 'detailed') => void;
  filters: {
    office: string;
  };
  handleFilterChange: (key: string, value: string) => void;
}

export const WeeklyOverviewContent: React.FC<WeeklyOverviewContentProps> = ({
  selectedWeek,
  handlePreviousWeek,
  handleNextWeek,
  weekLabel,
  summaryFormat,
  setSummaryFormat,
  filters,
  handleFilterChange
}) => {
  return (
    <div className="flex-1 p-4 sm:p-6 bg-background">
      {/* Print only title - hidden in normal view */}
      <div className="hidden print:block">
        <h1 className="print-title">Weekly Resource Overview</h1>
        <p className="print-subtitle">{weekLabel}</p>
      </div>
      
      <div className="max-w-full mx-auto space-y-4">
        <WeeklyOverviewHeader 
          summaryFormat={summaryFormat}
          setSummaryFormat={setSummaryFormat}
        />
        
        {/* Executive Summary */}
        <WeeklyExecutiveSummary
          selectedWeek={selectedWeek}
          summaryFormat={summaryFormat}
        />
        
        {/* Resource Table Section */}
        <WeeklyResourceSection
          selectedWeek={selectedWeek}
          handlePreviousWeek={handlePreviousWeek}
          handleNextWeek={handleNextWeek}
          weekLabel={weekLabel}
          filters={filters}
          handleFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
};
