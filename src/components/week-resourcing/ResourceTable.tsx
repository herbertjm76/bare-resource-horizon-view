
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ResourceTableHeader } from './ResourceTableHeader';
import { ResourceTableRow } from './row/ResourceTableRow';
import { useResourceTableData } from '@/hooks/useResourceTableData';
import { ResourceTableFooter } from './ResourceTableFooter';
import '@/styles/enhanced-tables.css';

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
        <div className="enhanced-table-scroll">
          <div className="enhanced-table-container">
            <Table className="enhanced-table" style={{ tableLayout: 'fixed' }}>
              <ResourceTableHeader projects={projects} />
              
              <TableBody>
                {Array.from(membersMap.values()).map((member: any, idx: number) => {
                  const weeklyCapacity = member.weekly_capacity || 40;
                  const totalHours = memberTotals.get(member.id) || 0;
                  const projectCount = projectCountByMember.get(member.id) || 0;
                  const annualLeave = getTotalWeeklyLeaveHours(member.id) || 0;
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
              
              <ResourceTableFooter
                projects={projects}
                projectHourTotals={projectHourTotals}
              />
            </Table>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
