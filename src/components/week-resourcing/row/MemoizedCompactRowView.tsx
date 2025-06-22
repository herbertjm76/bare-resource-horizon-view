
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { CapacityBar } from '../CapacityBar'; 
import { ProjectAllocationCells } from './ProjectAllocationCells';
import { format } from 'date-fns';

interface MemoizedCompactRowViewProps {
  member: any;
  memberIndex: number;
  projects: any[];
  allocationMap: Map<string, number>;
  annualLeaveData: Record<string, number>;
  holidaysData: Record<string, number>;
  otherLeaveData?: Record<string, number>;
  getMemberTotal: (memberId: string) => number;
  getProjectCount: (memberId: string) => number;
  getWeeklyLeave: (memberId: string) => Array<{ date: string; hours: number }>;
  updateOtherLeave?: (memberId: string, hours: number, notes?: string) => Promise<boolean>;
  onOtherLeaveEdit?: (memberId: string, value: number) => void;
  selectedWeek: Date;
  viewMode: 'compact' | 'expanded';
}

export const CompactRowView: React.FC<MemoizedCompactRowViewProps> = React.memo(({
  member,
  memberIndex,
  projects,
  allocationMap,
  annualLeaveData,
  holidaysData,
  otherLeaveData = {},
  getMemberTotal,
  getProjectCount,
  getWeeklyLeave,
  updateOtherLeave,
  onOtherLeaveEdit,
  selectedWeek,
  viewMode
}) => {
  const isEvenRow = memberIndex % 2 === 0;
  const rowBgClass = isEvenRow ? 'bg-white' : 'bg-gray-50/50';
  
  // Calculate totals using the provided functions
  const totalProjectHours = getMemberTotal(member.id);
  const projectCount = getProjectCount(member.id);
  
  // Get leave data
  const annualLeave = annualLeaveData[member.id] || 0;
  const holidayHours = holidaysData[member.id] || 0;
  const otherLeave = otherLeaveData[member.id] || 0;
  
  // Calculate total used hours
  const totalUsedHours = totalProjectHours + annualLeave + holidayHours + otherLeave;
  const weeklyCapacity = member.weekly_capacity || 40;
  
  // Calculate utilization percentage
  const utilizationPercentage = weeklyCapacity > 0 ? Math.round((totalUsedHours / weeklyCapacity) * 100) : 0;
  
  // Format week start date for allocations
  const weekStartDate = format(selectedWeek, 'yyyy-MM-dd');

  console.log(`CompactRowView for ${member.first_name} ${member.last_name}:`, {
    memberId: member.id,
    projectsCount: projects.length,
    allocationMapSize: allocationMap.size,
    totalUsedHours,
    projectCount
  });

  return (
    <TableRow className={`h-12 ${rowBgClass} hover:bg-gray-100/50 border-b`}>
      {/* Team Member Name - Sticky */}
      <TableCell className="font-medium sticky left-0 bg-inherit z-10 border-r" style={{ width: 180, minWidth: 180 }}>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">
            {member.first_name} {member.last_name}
          </span>
          <span className="text-xs text-gray-500">{member.location || 'Unknown'}</span>
        </div>
      </TableCell>
      
      {/* Weekly Utilization */}
      <TableCell className="text-center border-r" style={{ width: 200, minWidth: 200 }}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold">{totalUsedHours}h / {weeklyCapacity}h</span>
            <span className={`font-bold ${utilizationPercentage > 100 ? 'text-red-600' : utilizationPercentage < 60 ? 'text-orange-500' : 'text-green-600'}`}>
              {utilizationPercentage}%
            </span>
          </div>
          <CapacityBar 
            totalUsedHours={totalUsedHours} 
            totalCapacity={weeklyCapacity}
            className="h-2"
          />
        </div>
      </TableCell>
      
      {/* Leave Summary */}
      <TableCell className="text-center border-r" style={{ width: 150, minWidth: 150 }}>
        <div className="flex flex-col gap-1 text-xs">
          {annualLeave > 0 && (
            <div className="flex justify-between">
              <span>Annual:</span>
              <span className="font-medium">{annualLeave}h</span>
            </div>
          )}
          {holidayHours > 0 && (
            <div className="flex justify-between">
              <span>Holiday:</span>
              <span className="font-medium">{holidayHours}h</span>
            </div>
          )}
          {otherLeave > 0 && (
            <div className="flex justify-between">
              <span>Other:</span>
              <span className="font-medium">{otherLeave}h</span>
            </div>
          )}
          {(annualLeave + holidayHours + otherLeave) === 0 && (
            <span className="text-gray-400">No leave</span>
          )}
        </div>
      </TableCell>
      
      {/* Project Count */}
      <TableCell className="text-center border-r" style={{ width: 35, minWidth: 35 }}>
        <div className="flex items-center justify-center">
          <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full ${
            projectCount > 0 
              ? 'bg-purple-100 text-purple-800 border border-purple-300' 
              : 'bg-gray-100 text-gray-500 border border-gray-300'
          }`}>
            {projectCount}
          </span>
        </div>
      </TableCell>
      
      {/* Project Allocation Cells */}
      <ProjectAllocationCells 
        projects={projects}
        member={member}
        allocationMap={allocationMap}
        weekStartDate={weekStartDate}
      />
    </TableRow>
  );
}, (prevProps, nextProps) => {
  // Optimized comparison for better performance
  const memberChanged = prevProps.member.id !== nextProps.member.id;
  const indexChanged = prevProps.memberIndex !== nextProps.memberIndex;
  const allocationMapChanged = prevProps.allocationMap.size !== nextProps.allocationMap.size;
  const projectsChanged = prevProps.projects.length !== nextProps.projects.length;
  
  return !memberChanged && !indexChanged && !allocationMapChanged && !projectsChanged;
});

CompactRowView.displayName = 'CompactRowView';

export { CompactRowView as MemoizedCompactRowView };
