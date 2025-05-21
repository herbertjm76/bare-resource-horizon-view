
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ResourceTableHeader } from './ResourceTableHeader';
import { ResourceTableFooter } from './ResourceTableFooter';
import { ResourceTableRow } from './ResourceTableRow';
import { useResourceTableData } from '@/hooks/useResourceTableData';

interface ResourceTableProps {
  projects: any[];
  members: any[];
  allocations: any[];
  weekStartDate: string;
}

export const ResourceTable: React.FC<ResourceTableProps> = ({
  projects,
  members,
  allocations,
  weekStartDate
}) => {
  // Use the hook to manage table data
  const {
    membersMap,
    allocationMap,
    projectCountByMember,
    projectTotals,
    memberTotals,
    manualLeaveData,
    remarksData,
    getWeeklyLeave,
    getTotalWeeklyLeaveHours,
    handleLeaveInputChange,
    handleRemarksUpdate
  } = useResourceTableData(projects, members, allocations, weekStartDate);

  return (
    <TooltipProvider>
      <div className="annual-leave-calendar grid-table-outer-container border rounded-md shadow-sm">
        <div className="grid-table-container">
          <Table className="resource-allocation-table">
            {/* Table Header Component */}
            <ResourceTableHeader projects={projects} />
            
            <TableBody>
              {/* Render each resource row */}
              {Array.from(membersMap.values()).map((member: any, idx: number) => {
                // Get weekly capacity or default to 40
                const weeklyCapacity = member.weekly_capacity || 40;
                const totalHours = memberTotals.get(member.id) || 0;
                
                // Get project count for this member
                const projectCount = projectCountByMember.get(member.id) || 0;
                
                // Calculate leave hours
                const annualLeave = getTotalWeeklyLeaveHours(member.id) || 0;
                
                // Get leave days for tooltip
                const leaveDays = getWeeklyLeave(member.id);
                
                return (
                  <ResourceTableRow 
                    key={member.id}
                    member={member}
                    projects={projects}
                    idx={idx}
                    weekStartDate={weekStartDate}
                    allocationMap={allocationMap}
                    projectCount={projectCount}
                    manualLeaveData={manualLeaveData}
                    remarksData={remarksData}
                    leaveDays={leaveDays}
                    weeklyCapacity={weeklyCapacity}
                    totalHours={totalHours}
                    annualLeave={annualLeave}
                    onLeaveInputChange={handleLeaveInputChange}
                    onRemarksUpdate={handleRemarksUpdate}
                  />
                );
              })}
            </TableBody>
            
            {/* Totals row */}
            <ResourceTableFooter 
              projects={projects} 
              projectTotals={projectTotals} 
            />
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
};
