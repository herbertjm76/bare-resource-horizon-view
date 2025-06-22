
import React, { memo } from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { NameCell } from '../cells/NameCell';
import { EnhancedTooltip } from '../EnhancedTooltip';
import { MultiLeaveBadgeCell } from './MultiLeaveBadgeCell';
import { LongCapacityBar } from '../LongCapacityBar';
import { RowData, useRowData } from './RowUtilsHooks';

interface ExpandedRowViewProps extends RowData {
  viewMode: 'expanded';
}

const ExpandedRowViewComponent: React.FC<ExpandedRowViewProps> = ({
  member,
  memberIndex,
  projects,
  allocationMap,
  annualLeaveData,
  holidaysData,
  otherLeaveData,
  getMemberTotal,
  getProjectCount,
  getWeeklyLeave,
  updateOtherLeave,
  onOtherLeaveEdit,
}) => {
  const {
    weeklyCapacity,
    totalUsedHours,
    projectCount,
    annualLeave,
    holidayHours,
    leaveDays,
    editableOtherLeave,
    displayedOtherLeave,
    remarks,
    handleOtherLeaveChange,
    getProjectBreakdown
  } = useRowData(member, {
    projects,
    allocationMap,
    annualLeaveData,
    holidaysData,
    otherLeaveData,
    getMemberTotal,
    getProjectCount,
    getWeeklyLeave,
    updateOtherLeave,
    onOtherLeaveEdit,
  });

  return (
    <TableRow className={`${memberIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors duration-200 h-20 border-b`}>
      {/* Name Cell */}
      <TableCell className="border-r border-gray-200 px-4 py-3 min-w-[180px]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <NameCell member={member} />
          </div>
          <div className="flex flex-wrap gap-1">
            {member.office_location && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                {member.office_location}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-50 text-gray-700 border-gray-200">
              {weeklyCapacity}h capacity
            </Badge>
            {member.department && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 border-purple-200">
                {member.department}
              </Badge>
            )}
          </div>
        </div>
      </TableCell>
      
      {/* Project Count */}
      <TableCell className="text-center border-r border-gray-200 px-3 py-3">
        {projectCount}
      </TableCell>
      
      {/* Utilization: Larger Progress Bar */}
      <TableCell className="text-center border-r border-gray-200 px-3 py-3">
        <LongCapacityBar
          totalUsedHours={totalUsedHours}
          totalCapacity={weeklyCapacity}
        />
      </TableCell>
      
      {/* Multiple badge pills per leave type, edit Other */}
      <MultiLeaveBadgeCell
        annualLeave={annualLeave}
        holidayHours={holidayHours}
        otherLeave={displayedOtherLeave}
        remarks={remarks}
        leaveDays={leaveDays}
        className="px-3 py-3"
        editableOther={editableOtherLeave}
        onOtherLeaveChange={handleOtherLeaveChange}
      />
      
      {/* Project allocation cells */}
      {projects.map((project) => {
        const allocationKey = `${member.id}:${project.id}`;
        const hours = allocationMap.get(allocationKey) || 0;
        return (
          <TableCell key={project.id} className="text-center border-r border-gray-200 px-2 py-3">
            <EnhancedTooltip
              type="project"
              projectBreakdown={getProjectBreakdown(project, hours)}
            >
              {hours > 0 && (
                <span className="inline-flex items-center justify-center w-10 h-8 bg-green-500 text-white rounded-lg font-semibold text-sm shadow-sm">
                  {hours}
                </span>
              )}
            </EnhancedTooltip>
          </TableCell>
        );
      })}
    </TableRow>
  );
};

// Memoize with simplified comparison
export const ExpandedRowView = memo(ExpandedRowViewComponent, (prevProps, nextProps) => {
  // Only compare essential props that actually indicate a real change
  return (
    prevProps.member.id === nextProps.member.id &&
    prevProps.memberIndex === nextProps.memberIndex &&
    prevProps.projects.length === nextProps.projects.length &&
    prevProps.allocationMap.size === nextProps.allocationMap.size
  );
});
