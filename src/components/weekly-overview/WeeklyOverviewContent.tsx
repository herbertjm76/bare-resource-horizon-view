
import React from 'react';
import { WeeklyOverviewHeader } from './WeeklyOverviewHeader';
import { WeeklyExecutiveSummary } from './WeeklyExecutiveSummary';
import { WeeklyResourceSection } from './WeeklyResourceSection';
import { ModernDashboardHeader } from '@/components/dashboard/ModernDashboardHeader';
import { WeekResourceSummary } from '@/components/week-resourcing/WeekResourceSummary';
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

  // Debug logging
  console.log('WeeklyOverviewContent - Resource data:', {
    isLoading: isLoadingResourceData,
    projectsCount: projects?.length || 0,
    membersCount: members?.length || 0,
    allocationsCount: weekAllocations?.length || 0,
    weekStartDate,
    error
  });

  // Only show summary when we have actual data (not just empty arrays)
  const hasValidData = !isLoadingResourceData && 
                      projects && 
                      members && 
                      weekAllocations !== undefined &&
                      weekStartDate;

  console.log('WeeklyOverviewContent - Render decision:', {
    hasValidData,
    isLoadingResourceData,
    projectsLength: projects?.length,
    membersLength: members?.length,
    allocationsLength: weekAllocations?.length
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
        
        {/* Weekly Resource Summary Cards - Only show when we have valid data */}
        {hasValidData && (
          <WeekResourceSummary 
            projects={projects}
            members={members}
            allocations={weekAllocations}
            weekStartDate={weekStartDate}
          />
        )}
        
        {/* Loading state for resource summary */}
        {isLoadingResourceData && (
          <div className="scale-85 origin-top">
            <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
          </div>
        )}
        
        {/* Error state for resource summary */}
        {error && (
          <div className="scale-85 origin-top">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Error loading resource data: {error.message}
            </div>
          </div>
        )}
        
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
