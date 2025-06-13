
import React from 'react';
import { TableRow } from '@/components/ui/table';
import { MemberNameCell } from './row/MemberNameCell';
import { CapacityBarCell } from './row/CapacityBarCell';
import { AnnualLeaveCell } from './row/AnnualLeaveCell';
import { HolidayCell } from './row/HolidayCell';
import { ManualInputCell } from './row/ManualInputCell';
import { DisplayPillCell } from './row/DisplayPillCell';
import { ResourceAllocationCell } from './ResourceAllocationCell';

interface ResourceTableRowProps {
  member: any;
  projects: any[];
  idx: number;
  weekStartDate: string;
  allocationMap: Map<string, number>;
  projectCount: number;
  manualLeaveData: Record<string, Record<string, number | string>>;
  remarksData: Record<string, string>;
  leaveDays: Array<{ date: string; hours: number }>;
  weeklyCapacity: number;
  totalHours: number;
  annualLeave: number;
  holidayHours: number;
  onLeaveInputChange: (memberId: string, leaveType: string, value: string | number) => void;
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
  holidayHours,
  onLeaveInputChange,
  onRemarksUpdate
}) => {
  const isEvenRow = idx % 2 === 0;
  const rowBgClass = isEvenRow ? 'bg-white' : 'bg-gray-50/50';

  // Get other leave value
  const otherLeaveValue = manualLeaveData[member.id]?.['other'] || 0;
  const otherLeave = typeof otherLeaveValue === 'string' 
    ? parseFloat(otherLeaveValue) || 0 
    : otherLeaveValue;

  // Calculate total used hours (project hours + all leave types)
  const totalUsedHours = totalHours + annualLeave + holidayHours + otherLeave;

  return (
    <TableRow className={`h-9 ${rowBgClass} hover:bg-gray-100/50`}>
      <MemberNameCell member={member} />
      
      <DisplayPillCell 
        value={projectCount}
        label=""
        pillClassName="bg-gradient-to-r from-purple-100 to-purple-200 border-purple-300 text-purple-800"
      />
      
      <CapacityBarCell 
        totalUsedHours={totalUsedHours} 
        totalCapacity={weeklyCapacity}
      />
      
      <AnnualLeaveCell 
        annualLeave={annualLeave}
        leaveDays={leaveDays}
      />
      
      <HolidayCell 
        memberId={member.id}
        memberOffice={member.location}
        weekStartDate={weekStartDate}
        holidayHours={holidayHours}
        onLeaveInputChange={onLeaveInputChange}
      />
      
      <ManualInputCell 
        memberId={member.id}
        field="other"
        value={manualLeaveData[member.id]?.['other'] || ''}
        onInputChange={onLeaveInputChange}
        className="border-r-8 border-gray-400"
      />
      
      {/* Project allocation cells */}
      {projects.map((project, projectIdx) => {
        const key = `${member.id}:${project.id}`;
        const hours = allocationMap.get(key) || 0;
        
        return (
          <ResourceAllocationCell 
            key={project.id}
            resourceId={member.id}
            projectId={project.id}
            hours={hours}
            weekStartDate={weekStartDate}
          />
        );
      })}
    </TableRow>
  );
};
