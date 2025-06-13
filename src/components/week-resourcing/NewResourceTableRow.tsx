
import React from 'react';
import { TableRow } from '@/components/ui/table';
import { 
  NameCell, 
  ProjectCountCell, 
  CapacityCell, 
  ReadOnlyLeaveCell,
  EditableLeaveCell,
  ProjectAllocationCell,
  CellStyles
} from './cells';

interface NewResourceTableRowProps {
  member: any;
  memberIndex: number;
  projects: any[];
  allocationMap: Map<string, number>;
  annualLeaveData: Record<string, number>;
  holidaysData: Record<string, number>;
  getMemberTotal: (memberId: string) => number;
  getProjectCount: (memberId: string) => number;
  getWeeklyLeave: (memberId: string) => Array<{ date: string; hours: number }>;
}

export const NewResourceTableRow: React.FC<NewResourceTableRowProps> = ({
  member,
  memberIndex,
  projects,
  allocationMap,
  annualLeaveData,
  holidaysData,
  getMemberTotal,
  getProjectCount,
  getWeeklyLeave
}) => {
  const weeklyCapacity = member.weekly_capacity || 40;
  
  // Get the WEEKLY total allocated hours (sum for entire week June 9-15)
  const totalWeeklyAllocatedHours = getMemberTotal(member.id);
  
  const projectCount = getProjectCount(member.id);
  
  // Get leave data for this member - these should already be weekly totals
  const weeklyAnnualLeave = annualLeaveData[member.id] || 0;
  const holidayHours = holidaysData[member.id] || 0;
  const otherLeave = 0; // This could be expanded to include other leave types
  const annualLeaveDates = getWeeklyLeave ? getWeeklyLeave(member.id) : [];
  
  // Calculate total used hours for the week
  const totalUsedHours = totalWeeklyAllocatedHours + weeklyAnnualLeave + holidayHours + otherLeave;
  
  // Calculate available hours after all allocations and leave
  const availableHours = Math.max(0, weeklyCapacity - totalUsedHours);
  
  const isEvenRow = memberIndex % 2 === 0;
  
  // Calculate the number of project columns to show (minimum 15)
  const projectColumnsCount = Math.max(15, projects.length);
  
  // Get projects this member is working on for tooltip - with WEEKLY totals
  const memberProjects = projects
    .map(project => {
      const key = `${member.id}:${project.id}`;
      const hours = allocationMap.get(key) || 0;
      return hours > 0 ? { 
        name: project.name, 
        hours, // This should already be the weekly total from allocationMap
        project_code: project.project_code 
      } : null;
    })
    .filter(Boolean);

  console.log(`NewResourceTableRow - Member ${member.first_name} ${member.last_name}:`, {
    totalWeeklyAllocatedHours,
    projectCount,
    weeklyAnnualLeave: weeklyAnnualLeave,
    holidayHours,
    totalUsedHours,
    availableHours,
    weeklyCapacity,
    memberProjects,
    allocationMapEntries: Array.from(allocationMap.entries()).filter(([key]) => key.startsWith(member.id))
  });
  
  return (
    <>
      <CellStyles />
      <TableRow 
        key={member.id}
        className={`h-9 mobile-resource-table ${isEvenRow ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-100/50`}
      >
        <NameCell member={member} />
        
        <ProjectCountCell projectCount={projectCount} projects={memberProjects} />
        
        <CapacityCell 
          availableHours={availableHours} 
          totalCapacity={weeklyCapacity}
          member={member}
          totalAllocatedHours={totalWeeklyAllocatedHours}
          annualLeave={weeklyAnnualLeave}
          holidayHours={holidayHours}
          otherLeave={otherLeave}
          projects={memberProjects}
          annualLeaveDates={annualLeaveDates}
        />
        
        {/* Annual Leave Cell - READ-ONLY display from database with tooltip */}
        <ReadOnlyLeaveCell 
          value={weeklyAnnualLeave} 
          leaveDays={annualLeaveDates}
          leaveType="Annual Leave"
        />
        
        {/* Holiday Cell - READ-ONLY display from database with gray styling */}
        <ReadOnlyLeaveCell value={holidayHours} />
        
        {/* Other Leave Cell - EDITABLE manual input with thick border divider */}
        <EditableLeaveCell className="border-r-4 border-gray-400" />
        
        {/* Project allocation cells - show all projects or fill to minimum */}
        {Array.from({ length: projectColumnsCount }).map((_, idx) => {
          const project = projects[idx];
          if (project) {
            const key = `${member.id}:${project.id}`;
            const hours = allocationMap.get(key) || 0;
            
            return (
              <ProjectAllocationCell 
                key={project.id}
                hours={hours}
                readOnly
              />
            );
          } else {
            // Empty cells for consistent column count
            return (
              <ProjectAllocationCell 
                key={`empty-${idx}`}
                hours={0}
                disabled
              />
            );
          }
        })}
      </TableRow>
    </>
  );
};
