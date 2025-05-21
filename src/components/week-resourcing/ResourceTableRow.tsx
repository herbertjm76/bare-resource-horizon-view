import React from 'react';
import { TableRow } from '@/components/ui/table';
import { MemberNameCell } from './row/MemberNameCell';
import { ProjectCountCell } from './row/ProjectCountCell';
import { OfficeLocationCell } from './row/OfficeLocationCell';
import { CapacityBarCell } from './row/CapacityBarCell';
import { AnnualLeaveCell } from './row/AnnualLeaveCell';
import { LeaveInputCell } from './row/LeaveInputCell';
import { RemarksCell } from './RemarksCell';
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
  remarksData,
  leaveDays,
  weeklyCapacity,
  totalHours,
  annualLeave,
  onLeaveInputChange,
  onRemarksUpdate
}) => {
  // Get sick and other leave
  const sickLeave = manualLeaveData[member.id]?.['sick'] || 0;
  const otherLeave = manualLeaveData[member.id]?.['other'] || 0;
  const totalLeave = annualLeave + sickLeave + otherLeave;
  
  // Calculate available hours after allocated hours and leave
  const allocatedHours = totalHours + totalLeave;
  const availableHours = Math.max(0, weeklyCapacity - allocatedHours);
  
  // For debugging
  console.log(`ResourceTableRow for ${member.first_name}: totalHours=${totalHours}, leave=${totalLeave}, availableHours=${availableHours}, weeklyCapacity=${weeklyCapacity}`);
  
  // Get remarks for this member
  const memberRemarks = remarksData[member.id] || '';
  
  // Alternating row background
  const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-muted/10';

  return (
    <TableRow key={member.id} className={`h-9 ${rowBg} hover:bg-muted/20`}>
      <MemberNameCell member={member} />
      <ProjectCountCell projectCount={projectCount} />
      <OfficeLocationCell member={member} />
      <CapacityBarCell availableHours={availableHours} totalCapacity={weeklyCapacity} />
      <AnnualLeaveCell annualLeave={annualLeave} leaveDays={leaveDays} />
      
      {/* Sick/Medical Leave Cell */}
      <LeaveInputCell 
        leaveValue={sickLeave} 
        leaveType="sick" 
        memberId={member.id}
        bgColor="bg-[#FEF7CD]"
        onLeaveInputChange={onLeaveInputChange}
      />
      
      {/* Other Leave Cell */}
      <LeaveInputCell 
        leaveValue={otherLeave} 
        leaveType="other" 
        memberId={member.id}
        bgColor="bg-[#FEC6A1]"
        onLeaveInputChange={onLeaveInputChange}
      />
      
      {/* Remarks Cell */}
      <RemarksCell 
        memberId={member.id}
        initialRemarks={memberRemarks}
        onUpdate={onRemarksUpdate}
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
