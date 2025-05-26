
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ResourceTableHeader } from './ResourceTableHeader';
import { ResourceTableRow } from './row/ResourceTableRow';  // Updated import path
import { useResourceTableData } from '@/hooks/useResourceTableData';
import { ResourceTableFooter } from './ResourceTableFooter';

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

  // Ensure we have project totals for footer
  const projectHourTotals = projects.map(project => {
    let total = 0;
    members.forEach(member => {
      const key = `${member.id}:${project.id}`;
      total += allocationMap.get(key) || 0;
    });
    return {
      projectId: project.id,
      totalHours: total
    };
  });

  return (
    <TooltipProvider>
      <div className="w-full max-w-full overflow-hidden border rounded-md shadow-sm">
        <div 
          className="overflow-x-auto overflow-y-visible -webkit-overflow-scrolling-touch"
          style={{
            width: 'calc(100vw - 22rem)',
            maxWidth: 'calc(100vw - 22rem)'
          }}
        >
          <Table className="resource-allocation-table">
            {/* Table Header Component - removed showRemarks prop to use default value */}
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
            
            {/* Add footer with project hour totals */}
            <ResourceTableFooter
              projects={projects}
              projectHourTotals={projectHourTotals}
            />
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
};
