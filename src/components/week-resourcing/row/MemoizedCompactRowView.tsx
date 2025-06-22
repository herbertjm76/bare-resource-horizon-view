
import React, { memo } from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { NameCell } from '../cells/NameCell';
import { EnhancedTooltip } from '../EnhancedTooltip';
import { MultiLeaveBadgeCell } from './MultiLeaveBadgeCell';
import { CapacityBar } from '../CapacityBar';
import { RowData, useRowData } from './RowUtilsHooks';

interface CompactRowViewProps extends RowData {
  viewMode: 'compact';
}

const CompactRowViewComponent: React.FC<CompactRowViewProps> = ({
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
    <TableRow className={`${memberIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors duration-200 h-12 border-b`}>
      {/* Name Cell */}
      <TableCell className="border-r border-gray-200 px-3 py-2 min-w-[180px]">
        <NameCell member={member} />
      </TableCell>
      
      {/* Utilization */}
      <TableCell className="text-center border-r border-gray-200 px-3 py-2">
        <CapacityBar
          totalUsedHours={totalUsedHours}
          totalCapacity={weeklyCapacity}
        />
      </TableCell>
      
      {/* Leave */}
      <MultiLeaveBadgeCell
        annualLeave={annualLeave}
        holidayHours={holidayHours}
        otherLeave={displayedOtherLeave}
        remarks={remarks}
        leaveDays={leaveDays}
        className="px-2 py-2"
        editableOther={editableOtherLeave}
        onOtherLeaveChange={handleOtherLeaveChange}
      />
      
      {/* Project Count */}
      <TableCell className="text-center border-r border-gray-200 px-2 py-2">
        <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
          {projectCount}
        </span>
      </TableCell>
      
      {/* Project allocation cells */}
      {projects.map((project) => {
        const allocationKey = `${member.id}:${project.id}`;
        const hours = allocationMap.get(allocationKey) || 0;
        return (
          <TableCell key={project.id} className="text-center border-r border-gray-200 px-1 py-2">
            <EnhancedTooltip
              type="project"
              projectBreakdown={getProjectBreakdown(project, hours)}
            >
              {hours > 0 && (
                <span className="inline-flex items-center justify-center w-8 h-6 bg-green-500 text-white rounded text-xs font-semibold">
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
export const CompactRowView = memo(CompactRowViewComponent, (prevProps, nextProps) => {
  // Only compare essential props that actually indicate a real change
  return (
    prevProps.member.id === nextProps.member.id &&
    prevProps.memberIndex === nextProps.memberIndex &&
    prevProps.projects.length === nextProps.projects.length &&
    prevProps.allocationMap.size === nextProps.allocationMap.size
  );
});
