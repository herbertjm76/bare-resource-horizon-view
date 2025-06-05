import React from 'react';
import { TableRow } from '@/components/ui/table';
import { 
  NameCell, 
  ProjectCountCell, 
  CapacityCell, 
  LeaveCell, 
  OfficeCell, 
  ProjectAllocationCell 
} from './NewResourceTableCells';

interface NewResourceTableRowProps {
  member: any;
  memberIndex: number;
  projects: any[];
  allocationMap: Map<string, number>;
  annualLeaveData: Record<string, number>;
  holidaysData: Record<string, number>;
  getMemberTotal: (memberId: string) => number;
  getProjectCount: (memberId: string) => number;
}

export const NewResourceTableRow: React.FC<NewResourceTableRowProps> = ({
  member,
  memberIndex,
  projects,
  allocationMap,
  annualLeaveData,
  holidaysData,
  getMemberTotal,
  getProjectCount
}) => {
  const weeklyCapacity = member.weekly_capacity || 40;
  const totalHours = getMemberTotal(member.id);
  const projectCount = getProjectCount(member.id);
  
  // Get leave data for this member
  const annualLeave = annualLeaveData[member.id] || 0;
  const holidayHours = holidaysData[member.id] || 0;
  
  // Calculate available hours after all allocations and leave
  const availableHours = Math.max(0, weeklyCapacity - totalHours - annualLeave - holidayHours);
  
  const isEvenRow = memberIndex % 2 === 0;
  
  // Calculate the number of project columns to show (minimum 15)
  const projectColumnsCount = Math.max(15, projects.length);
  
  return (
    <TableRow 
      key={member.id}
      className={`h-9 ${isEvenRow ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-100/50`}
    >
      <NameCell member={member} />
      <ProjectCountCell projectCount={projectCount} />
      <CapacityCell availableHours={availableHours} totalCapacity={weeklyCapacity} />
      
      {/* Annual Leave Cell - display actual data from database */}
      <LeaveCell defaultValue={annualLeave.toString()} />
      
      {/* Holiday Cell - display actual data from database */}
      <LeaveCell defaultValue={holidayHours.toString()} />
      
      {/* Other Leave Cell - manual input */}
      <LeaveCell />
      
      <OfficeCell location={member.location} />
      
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
  );
};
