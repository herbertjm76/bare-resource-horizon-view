
import React from 'react';
import { TableRow } from '@/components/ui/table';
import { MemberNameCell } from './MemberNameCell';
import { CapacityBarCell } from './CapacityBarCell';
import { AnnualLeaveCell } from './AnnualLeaveCell';
import { HolidayCell } from './HolidayCell';
import { ManualInputCell } from './ManualInputCell';
import { DisplayPillCell } from './DisplayPillCell';
import { ResourceAllocationCell } from '../ResourceAllocationCell';

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

  // Calculate available hours
  const availableHours = Math.max(0, weeklyCapacity - totalHours - annualLeave - holidayHours - otherLeave);

  // Get projects this member is working on for tooltip
  const memberProjects = projects
    .map(project => {
      const key = `${member.id}:${project.id}`;
      const hours = allocationMap.get(key) || 0;
      return hours > 0 ? { 
        name: project.name, 
        hours, 
        project_code: project.project_code 
      } : null;
    })
    .filter(Boolean);

  return (
    <TableRow className={`h-9 ${rowBgClass} hover:bg-gray-100/50`}>
      <MemberNameCell member={member} />
      
      <DisplayPillCell projectCount={projectCount} projects={memberProjects} />
      
      <CapacityBarCell 
        availableHours={availableHours} 
        totalCapacity={weeklyCapacity}
        member={member}
        totalAllocatedHours={totalHours}
        annualLeave={annualLeave}
        holidayHours={holidayHours}
        otherLeave={otherLeave}
        projects={memberProjects}
        annualLeaveDates={leaveDays}
      />
      
      <AnnualLeaveCell 
        memberId={member.id}
        value={annualLeave}
        leaveDays={leaveDays}
      />
      
      <HolidayCell 
        memberId={member.id}
        value={holidayHours}
      />
      
      <ManualInputCell 
        memberId={member.id}
        leaveType="other"
        value={manualLeaveData[member.id]?.['other'] || ''}
        onChange={onLeaveInputChange}
      />
      
      <DisplayPillCell 
        location={member.location}
        isLocationCell
      />
      
      {/* Project allocation cells */}
      {projects.map((project, projectIdx) => {
        const key = `${member.id}:${project.id}`;
        const hours = allocationMap.get(key) || 0;
        
        return (
          <ResourceAllocationCell 
            key={project.id}
            memberId={member.id}
            projectId={project.id}
            weekStartDate={weekStartDate}
            currentHours={hours}
            isReadOnly
            projectIdx={projectIdx}
          />
        );
      })}
    </TableRow>
  );
};
