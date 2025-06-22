
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { CapacityBar } from '../CapacityBar';
import { ProjectAllocationCells } from './ProjectAllocationCells';
import { format } from 'date-fns';

interface MemoizedExpandedRowViewProps {
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

export const ExpandedRowView: React.FC<MemoizedExpandedRowViewProps> = React.memo(({
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
  const weeklyLeaveDetails = getWeeklyLeave(member.id);
  
  // Calculate total used hours
  const totalUsedHours = totalProjectHours + annualLeave + holidayHours + otherLeave;
  const weeklyCapacity = member.weekly_capacity || 40;
  
  // Calculate utilization percentage
  const utilizationPercentage = weeklyCapacity > 0 ? Math.round((totalUsedHours / weeklyCapacity) * 100) : 0;
  
  // Format week start date for allocations
  const weekStartDate = format(selectedWeek, 'yyyy-MM-dd');

  return (
    <TableRow className={`h-16 ${rowBgClass} hover:bg-gray-100/50 border-b`}>
      {/* Team Member Name - Sticky */}
      <TableCell className="font-medium sticky left-0 bg-inherit z-10 border-r" style={{ width: 180, minWidth: 180 }}>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">
            {member.first_name} {member.last_name}
          </span>
          <span className="text-xs text-gray-500">{member.job_title || 'Unknown Role'}</span>
          <span className="text-xs text-gray-400">{member.location || 'Unknown Location'}</span>
        </div>
      </TableCell>
      
      {/* Weekly Utilization - Expanded */}
      <TableCell className="border-r" style={{ width: 200, minWidth: 200 }}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold">Total: {totalUsedHours}h / {weeklyCapacity}h</span>
            <span className={`font-bold ${utilizationPercentage > 100 ? 'text-red-600' : utilizationPercentage < 60 ? 'text-orange-500' : 'text-green-600'}`}>
              {utilizationPercentage}%
            </span>
          </div>
          <CapacityBar 
            totalUsedHours={totalUsedHours} 
            totalCapacity={weeklyCapacity}
            className="h-3"
          />
          <div className="text-xs text-gray-600">
            <div>Projects: {totalProjectHours}h ({projectCount} projects)</div>
            <div>Leave: {annualLeave + holidayHours + otherLeave}h</div>
          </div>
        </div>
      </TableCell>
      
      {/* Leave Details - Expanded */}
      <TableCell className="border-r" style={{ width: 150, minWidth: 150 }}>
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex justify-between">
            <span>Annual:</span>
            <span className="font-medium">{annualLeave}h</span>
          </div>
          <div className="flex justify-between">
            <span>Holiday:</span>
            <span className="font-medium">{holidayHours}h</span>
          </div>
          <div className="flex justify-between">
            <span>Other:</span>
            <span className="font-medium">{otherLeave}h</span>
          </div>
          {weeklyLeaveDetails.length > 0 && (
            <div className="mt-1 pt-1 border-t">
              <div className="text-xs text-gray-500 mb-1">Daily breakdown:</div>
              {weeklyLeaveDetails.map((leave, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span>{format(new Date(leave.date), 'EEE')}</span>
                  <span>{leave.hours}h</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </TableCell>
      
      {/* Project Count */}
      <TableCell className="text-center border-r" style={{ width: 35, minWidth: 35 }}>
        <div className="flex items-center justify-center">
          <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full ${
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

ExpandedRowView.displayName = 'ExpandedRowView';

export { ExpandedRowView as MemoizedExpandedRowView };
