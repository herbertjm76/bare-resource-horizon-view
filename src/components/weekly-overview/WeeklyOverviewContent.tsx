
import React from 'react';
import { WeeklyOverviewHeader } from './WeeklyOverviewHeader';
import { WeeklyExecutiveSummary } from './WeeklyExecutiveSummary';
import { WeeklyResourceSection } from './WeeklyResourceSection';
import { ModernDashboardHeader } from '@/components/dashboard/ModernDashboardHeader';
import { WeekResourceOverviewCards } from '@/components/week-resourcing/WeekResourceOverviewCards';
import { useWeekResourceData } from '@/components/week-resourcing/hooks/useWeekResourceData';

interface WeeklyOverviewContentProps {
  selectedWeek: Date;
  handlePreviousWeek: () => void;
  handleNextWeek: () => void;
  weekLabel: string;
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
  filters,
  handleFilterChange
}) => {
  // Get week resource data for the summary cards
  const {
    projects,
    members,
    weekAllocations,
    weekStartDate,
    isLoading: isLoadingResourceData,
    error
  } = useWeekResourceData({ 
    selectedWeek, 
    filters: { office: filters.office, searchTerm: "" } 
  });

  console.log('WeeklyOverviewContent - Resource data status:', {
    isLoading: isLoadingResourceData,
    hasProjects: !!projects,
    hasMembers: !!members,
    hasAllocations: weekAllocations !== undefined,
    hasWeekStartDate: !!weekStartDate,
    error: !!error
  });

  return (
    <div className="flex-1 p-4 sm:p-6 bg-background">
      {/* Print only title - hidden in normal view */}
      <div className="hidden print:block">
        <h1 className="print-title">Weekly Resource Overview</h1>
        <p className="print-subtitle">{weekLabel}</p>
      </div>
      
      <div className="max-w-full mx-auto space-y-4">
        <ModernDashboardHeader
          totalTeamMembers={0}
          totalActiveProjects={0}
          totalOffices={0}
        />
        
        {/* Weekly Resource Summary Cards - Always render the component, let it handle its own loading states */}
        <WeekResourceOverviewCards 
          projects={projects || []}
          members={members || []}
          allocations={weekAllocations || []}
          weekStartDate={weekStartDate || ''}
        />
        
        {/* Executive Summary */}
        <WeeklyExecutiveSummary
          selectedWeek={selectedWeek}
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
