
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { NameCell } from '../cells/NameCell';
import { MultiLeaveBadgeCell } from './MultiLeaveBadgeCell';
import { LongCapacityBar } from '../LongCapacityBar';
import { RowData, useRowData } from './RowUtilsHooks';

interface CompactRowViewProps extends RowData {
  viewMode: 'compact';
}

export const CompactRowView: React.FC<CompactRowViewProps> = ({
  member,
  memberIndex,
  projects,
  allocationMap,
  ...props
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
    handleOtherLeaveChange
  } = useRowData(member, props);

  return (
    <TableRow
      className={
        `resource-table-row-compact ${memberIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
        hover:bg-blue-50/80 transition-all duration-150 h-8 min-h-0`
      }
      style={{ fontSize: 12, minHeight: 28, height: 28, lineHeight: 1 }}
    >
      {/* Name Cell */}
      <TableCell className="border-r border-gray-200 px-1 py-0.5 name-column min-w-[100px] max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap">
        <NameCell member={member} compact />
      </TableCell>
      
      {/* Project Count */}
      <TableCell className="text-center border-r border-gray-200 px-0.5 py-0.5 count-column">
        <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-500 text-white rounded-sm font-semibold text-[11px] shadow-sm">
          {projectCount}
        </span>
      </TableCell>
      
      {/* Utilization: Compact Progress Bar */}
      <TableCell className="text-center border-r border-gray-200 px-1 py-0.5 utilization-column min-w-[72px] max-w-[100px]">
        <LongCapacityBar
          totalUsedHours={totalUsedHours}
          totalCapacity={weeklyCapacity}
          compact
        />
      </TableCell>
      
      {/* Leave Badge Cells + editable Other */}
      <MultiLeaveBadgeCell
        annualLeave={annualLeave}
        holidayHours={holidayHours}
        otherLeave={displayedOtherLeave}
        remarks={remarks}
        leaveDays={leaveDays}
        className="px-0.5 py-0.5"
        editableOther={editableOtherLeave}
        onOtherLeaveChange={handleOtherLeaveChange}
        compact
      />
      
      {/* Project Cells */}
      {projects.map((project) => {
        const allocationKey = `${member.id}:${project.id}`;
        const hours = allocationMap.get(allocationKey) || 0;
        return (
          <TableCell
            key={project.id}
            className="text-center border-r border-gray-200 px-0.5 py-0.5 project-column"
            style={{ width: 30, minWidth: 30, maxWidth: 36 }}
          >
            {hours > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-500 text-white rounded-sm font-semibold text-[11px] hover:bg-emerald-600 transition-colors duration-100">
                {hours}
              </span>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
