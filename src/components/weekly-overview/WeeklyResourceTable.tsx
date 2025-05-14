
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableFooter } from "@/components/ui/table";
import { WeeklyResourceHeader } from './WeeklyResourceHeader';
import { ResourceTableLoadingState } from './components/ResourceTableLoadingState';
import { ResourceTableErrorState } from './components/ResourceTableErrorState';
import { EmptyResourceState } from './components/EmptyResourceState';
import { TeamMemberRows } from './components/TeamMemberRows';
import { ProjectTotalsRow } from './components/ProjectTotalsRow';
import { useWeeklyResourceData } from './hooks/useWeeklyResourceData';
import { toast } from 'sonner';
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
  // Track how long we've been loading
  const [loadingDuration, setLoadingDuration] = useState(0);
  const [forceRender, setForceRender] = useState(false);
  
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
  
  // Track loading time and display toast if it takes too long
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isLoading) {
      // Start counting loading time
      interval = setInterval(() => {
        setLoadingDuration(prev => {
          const newDuration = prev + 1;
          
          // If loading for more than 15 seconds, force render
          if (newDuration === 15 && !forceRender) {
            setForceRender(true);
            toast.info("Forcing data display", {
              description: "Some data may still be loading in the background.",
              duration: 5000
            });
          }
          
          return newDuration;
        });
      }, 1000);
    } else {
      // Reset counter when loading completes
      setLoadingDuration(0);
      if (forceRender) {
        setForceRender(false);
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, forceRender]);
  
  // Refresh allocations when week changes
  useEffect(() => {
    if (refreshAllocations) {
      console.log("Refreshing allocations for week:", selectedWeek);
      refreshAllocations();
    }
  }, [selectedWeek, refreshAllocations]);
  
  // Added safety check for data
  const hasMembers = Array.isArray(allMembers) && allMembers.length > 0;
  const hasProjects = Array.isArray(projects) && projects.length > 0;

  // Render loading state with additional checks to prevent getting stuck
  if ((isLoading || !hasProjects) && !forceRender) {
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
