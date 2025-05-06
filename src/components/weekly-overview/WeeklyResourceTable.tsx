
import React, { useEffect } from 'react';
import { Table, TableBody, TableFooter } from "@/components/ui/table";
import { WeeklyResourceHeader } from './WeeklyResourceHeader';
import { ResourceTableLoadingState } from './components/ResourceTableLoadingState';
import { ResourceTableErrorState } from './components/ResourceTableErrorState';
import { EmptyResourceState } from './components/EmptyResourceState';
import { TeamMemberRows } from './components/TeamMemberRows';
import { ProjectTotalsRow } from './components/ProjectTotalsRow';
import { useWeeklyResourceData } from './hooks/useWeeklyResourceData';
import './weekly-overview.css';

interface WeeklyResourceTableProps {
  selectedWeek: Date;
  filters: {
    office: string;
  };
}

export const WeeklyResourceTable: React.FC<WeeklyResourceTableProps> = ({
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

  // Debug to help identify loading state issues
  console.log("WeeklyResourceTable - Loading state:", isLoading);
  console.log("WeeklyResourceTable - Projects:", projects);
  console.log("WeeklyResourceTable - Members count:", allMembers?.length);
  
  // Added safety check for members array
  const hasMembers = Array.isArray(allMembers) && allMembers.length > 0;

  if (isLoading) {
    return <ResourceTableLoadingState />;
  }

  if (error) {
    return <ResourceTableErrorState error={error} />;
  }

  if (!hasMembers) {
    return <EmptyResourceState />;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="weekly-table-container">
        <Table className="min-w-full text-xs weekly-table">
          <WeeklyResourceHeader projects={projects} />
          <TableBody>
            <TeamMemberRows 
              filteredOffices={filteredOffices}
              membersByOffice={membersByOffice}
              getMemberAllocation={getMemberAllocation}
              getOfficeDisplay={getOfficeDisplay}
              handleInputChange={handleInputChange}
              projects={projects}
            />
          </TableBody>
          <TableFooter>
            <ProjectTotalsRow 
              projects={projects}
              projectTotals={projectTotals()}
            />
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};
