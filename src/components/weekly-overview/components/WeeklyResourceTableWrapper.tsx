
import React, { useEffect } from 'react';
import { CleanWeeklyTable } from '../CleanWeeklyTable';
import { TestPurpleTable } from '../TestPurpleTable';
import { ResourceTableLoadingState } from './ResourceTableLoadingState';
import { ResourceTableErrorState } from './ResourceTableErrorState';
import { EmptyResourceState } from './EmptyResourceState';
import { useWeeklyResourceData } from '../hooks/useWeeklyResourceData';
import { format, startOfWeek, addDays } from 'date-fns';

interface WeeklyResourceTableWrapperProps {
  selectedWeek: Date;
  filters: {
    office: string;
  };
}

export const WeeklyResourceTableWrapper: React.FC<WeeklyResourceTableWrapperProps> = ({
  selectedWeek,
  filters
}) => {
  const {
    projects,
    allMembers,
    membersByOffice,
    filteredOffices,
    getMemberAllocation,
    handleInputChange,
    getOfficeDisplay,
    projectTotals,
    refreshAllocations,
    isLoading,
    error
  } = useWeeklyResourceData(selectedWeek, filters);
  
  // Refresh allocations when week changes
  useEffect(() => {
    if (refreshAllocations) {
      console.log("Refreshing allocations for week:", selectedWeek);
      refreshAllocations();
    }
  }, [selectedWeek, refreshAllocations]);
  
  // Safety checks for data
  const hasMembers = Array.isArray(allMembers) && allMembers.length > 0;
  const hasProjects = Array.isArray(projects) && projects.length > 0;

  console.log("WeeklyResourceTableWrapper - hasProjects:", hasProjects, "hasMembers:", hasMembers, "isLoading:", isLoading);
  console.log("WeeklyResourceTableWrapper - projects:", projects);

  // Render loading state
  if (isLoading || !hasProjects) {
    return <ResourceTableLoadingState />;
  }

  // Render error state
  if (error) {
    return <ResourceTableErrorState error={error} />;
  }

  // Render empty state
  if (!hasMembers) {
    return <EmptyResourceState />;
  }

  console.log("WeeklyResourceTableWrapper - Rendering both tables");

  return (
    <div className="space-y-8">
      {/* Main table */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Main Resource Table</h3>
        <CleanWeeklyTable
          projects={projects}
          filteredOffices={filteredOffices}
          membersByOffice={membersByOffice}
          getMemberAllocation={getMemberAllocation}
          getOfficeDisplay={getOfficeDisplay}
          handleInputChange={handleInputChange}
          projectTotals={projectTotals}
        />
      </div>
      
      {/* Test table with purple header */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-purple-600">Test Purple Header Table</h3>
        <TestPurpleTable projects={projects} />
      </div>
    </div>
  );
};
