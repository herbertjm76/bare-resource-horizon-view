
import React from 'react';
import { TableRow } from '@/components/ui/table';
import { MemberNameCell } from './MemberNameCell';
import { ProjectCountCell } from './ProjectCountCell';
import { OfficeLocationCell } from './OfficeLocationCell';
import { CapacityBarCell } from './CapacityBarCell';
import { AnnualLeaveCell } from './AnnualLeaveCell';
import { OtherLeaveCell } from './OtherLeaveCell';
import { HolidayCell } from './HolidayCell';
import { ProjectAllocationCells } from './ProjectAllocationCells';

interface LeaveDay {
  date: string;
  hours: number;
}

interface ResourceTableRowProps {
  member: any;
  projects: any[];
  idx: number;
  weekStartDate: string;
  allocationMap: Map<string, number>;
  projectCount: number;
  manualLeaveData: Record<string, Record<string, string | number>>;
  remarksData: Record<string, string>;
  leaveDays: LeaveDay[];
  weeklyCapacity: number;
  totalHours: number;
  annualLeave: number;
  holidayHours: number;
  onLeaveInputChange: (memberId: string, leaveType: string, value: string) => void;
  onRemarksUpdate: (memberId: string, remarks: string) => void;
}

export const ResourceTableRow: React.FC<ResourceTableRowProps> = ({
  member,
  projects,
  idx,
  weekStartDate,
  allocationMap,
  projectCount,
  manualLeaveData,
  leaveDays,
  weeklyCapacity,
  totalHours,
  annualLeave,
  holidayHours,
  onLeaveInputChange,
  onRemarksUpdate
}) => {
  // Combine sick and other leave into a single "other" leave
  // Make sure to safely convert to number for calculations
  const otherLeaveValue = manualLeaveData[member.id]?.['sick'] || 0;
  const otherLeaveNum = typeof otherLeaveValue === 'string' 
    ? parseFloat(otherLeaveValue) || 0 
    : otherLeaveValue;
  
  const secondLeaveValue = manualLeaveData[member.id]?.['other'] || 0;
  const secondLeaveNum = typeof secondLeaveValue === 'string'
    ? parseFloat(secondLeaveValue) || 0
    : secondLeaveValue;

  const otherLeave = otherLeaveNum + secondLeaveNum;
  
  // Get notes for this member
  const memberNotes = manualLeaveData[member.id]?.['notes'] || '';
  
  // Alternating row background
  const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-muted/10';

  // Handler for notes - use the onLeaveInputChange function to store notes
  const handleNotesChange = (memberId: string, notes: string) => {
    onLeaveInputChange(memberId, 'notes', notes);
  };

  // Ensure we always show at least 15 project columns
  const minProjectsToShow = 15;
  const projectsToRender = [...projects];
  
  // Add empty placeholders if we have less than 15 projects
  if (projects.length < minProjectsToShow) {
    const emptyProjectsNeeded = minProjectsToShow - projects.length;
    for (let i = 0; i < emptyProjectsNeeded; i++) {
      projectsToRender.push({
        id: `empty-project-${i}`,
        isEmpty: true
      });
    }
  }

  return (
    <TableRow key={member.id} className={`h-9 ${rowBg} hover:bg-muted/20`}>
      <MemberNameCell member={member} />
      <ProjectCountCell projectCount={projectCount} />
      
      <CapacityBarCell availableHours={Math.max(0, weeklyCapacity - totalHours - annualLeave - otherLeave - holidayHours)} totalCapacity={weeklyCapacity} />
      
      {/* Annual Leave Cell - READ-ONLY display from database with gray styling */}
      <AnnualLeaveCell annualLeave={annualLeave} leaveDays={leaveDays} />
      
      {/* Holiday Cell - READ-ONLY display from database with gray styling */}
      <HolidayCell 
        memberId={member.id}
        memberOffice={member.location}
        weekStartDate={weekStartDate}
        holidayHours={holidayHours}
        onLeaveInputChange={onLeaveInputChange}
      />
      
      {/* Combined Other Leave Cell with Notes - purple for manual input (EDITABLE) */}
      <OtherLeaveCell 
        leaveValue={otherLeave} 
        memberId={member.id}
        notes={typeof memberNotes === 'string' ? memberNotes : ''}
        onLeaveInputChange={onLeaveInputChange}
        onNotesChange={handleNotesChange}
      />
      
      {/* Office Location Cell moved after all leave cells */}
      <OfficeLocationCell member={member} />
      
      {/* Project allocation cells */}
      <ProjectAllocationCells 
        projects={projectsToRender} 
        member={member} 
        allocationMap={allocationMap}
        weekStartDate={weekStartDate}
      />
    </TableRow>
  );
};
