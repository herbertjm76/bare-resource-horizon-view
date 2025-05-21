
import React from 'react';
import { TableRow } from '@/components/ui/table';
import { MemberNameCell } from './row/MemberNameCell';
import { ProjectCountCell } from './row/ProjectCountCell';
import { OfficeLocationCell } from './row/OfficeLocationCell';
import { CapacityBarCell } from './row/CapacityBarCell';
import { AnnualLeaveCell } from './row/AnnualLeaveCell';
import { OtherLeaveCell } from './row/OtherLeaveCell';
import { ProjectAllocationCells } from './row/ProjectAllocationCells';
import { TotalHoursCell } from './row/TotalHoursCell';

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
  manualLeaveData: Record<string, Record<string, number>>;
  remarksData: Record<string, string>;
  leaveDays: LeaveDay[];
  weeklyCapacity: number;
  totalHours: number;
  annualLeave: number;
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
  onLeaveInputChange,
  onRemarksUpdate
}) => {
  // Combine sick and other leave into a single "other" leave
  const otherLeave = (manualLeaveData[member.id]?.['sick'] || 0) + 
                     (manualLeaveData[member.id]?.['other'] || 0);
  
  const totalLeave = annualLeave + otherLeave;
  
  // Calculate available hours after allocated hours and leave
  const allocatedHours = totalHours + totalLeave;
  const availableHours = Math.max(0, weeklyCapacity - allocatedHours);
  
  // For debugging
  console.log(`ResourceTableRow for ${member.first_name}: totalHours=${totalHours}, leave=${totalLeave}, availableHours=${availableHours}, weeklyCapacity=${weeklyCapacity}`);
  
  // Get notes for this member (from the existing remarks)
  const memberNotes = manualLeaveData[member.id]?.['notes'] || '';
  
  // Alternating row background
  const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-muted/10';

  // Handler for notes
  const handleNotesChange = (memberId: string, notes: string) => {
    onLeaveInputChange(memberId, 'notes', notes);
  };

  return (
    <TableRow key={member.id} className={`h-9 ${rowBg} hover:bg-muted/20`}>
      <MemberNameCell member={member} />
      <ProjectCountCell projectCount={projectCount} />
      <OfficeLocationCell member={member} />
      <CapacityBarCell availableHours={availableHours} totalCapacity={weeklyCapacity} />
      <AnnualLeaveCell annualLeave={annualLeave} leaveDays={leaveDays} />
      
      {/* Combined Other Leave Cell with Notes */}
      <OtherLeaveCell 
        leaveValue={otherLeave} 
        memberId={member.id}
        notes={memberNotes}
        onLeaveInputChange={onLeaveInputChange}
        onNotesChange={handleNotesChange}
      />
      
      {/* Project allocation cells */}
      <ProjectAllocationCells 
        projects={projects} 
        member={member} 
        allocationMap={allocationMap}
        weekStartDate={weekStartDate}
      />
      
      {/* Total Column with Utilization Badge */}
      <TotalHoursCell totalHours={totalHours} weeklyCapacity={weeklyCapacity} />
    </TableRow>
  );
};
