
import React, { useState } from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { NameCell } from './cells/NameCell';
import { ProjectCountCell } from './cells/ProjectCountCell';
import { EnhancedTooltip } from './EnhancedTooltip';
import { Badge } from '@/components/ui/badge';
import { MultiLeaveBadgeCell } from './row/MultiLeaveBadgeCell';
import { LongCapacityBar } from './LongCapacityBar';

interface NewResourceTableRowProps {
  member: any;
  memberIndex: number;
  projects: any[];
  allocationMap: Map<string, number>;
  annualLeaveData: Record<string, number>;
  holidaysData: Record<string, number>;
  getMemberTotal: (memberId: string) => number;
  getProjectCount: (memberId: string) => number;
  getWeeklyLeave: (memberId: string) => Array<{ date: string; hours: number }>;
  viewMode?: 'compact' | 'expanded';
  onOtherLeaveEdit?: (memberId: string, value: number) => void;
}

export const NewResourceTableRow: React.FC<NewResourceTableRowProps> = ({
  member,
  memberIndex,
  projects,
  allocationMap,
  annualLeaveData,
  holidaysData,
  getMemberTotal,
  getProjectCount,
  getWeeklyLeave,
  viewMode = 'compact',
  onOtherLeaveEdit,
}) => {
  // "Other leave" value storage for manual edit by row, for input UX in compact mode
  const [otherLeave, setOtherLeave] = useState<number>(0);

  React.useEffect(() => {
    setOtherLeave(0); // start/reset at 0 for each member by default
  }, [member.id]);

  const isExpanded = viewMode === 'expanded';
  const weeklyCapacity = member.weekly_capacity || 40;
  const totalUsedHours = getMemberTotal(member.id);
  const projectCount = getProjectCount(member.id);
  const annualLeave = annualLeaveData[member.id] || 0;
  const holidayHours = holidaysData[member.id] || 0;
  const leaveDays = getWeeklyLeave(member.id);

  // For demo: Otherwise controlled elsewhere in real app
  const editableOtherLeave = typeof onOtherLeaveEdit === "function";
  const displayedOtherLeave = editableOtherLeave ? otherLeave : 0;
  const remarks = "";

  const utilizationPercentage = weeklyCapacity > 0 ? Math.round((totalUsedHours / weeklyCapacity) * 100) : 0;

  const getProjectBreakdown = (project: any, hours: number) => ({
    projectName: project.name,
    projectCode: project.code,
    projectStage: project.current_stage || project.stage,
    projectFee: project.fee,
    hours: hours,
    isActive: !!(hours > 0)
  });

  // Expanded View
  if (isExpanded) {
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
          onOtherLeaveChange={v => {
            setOtherLeave(v);
            if (onOtherLeaveEdit) onOtherLeaveEdit(member.id, v);
          }}
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
  }

  // Compact View
  return (
    <TableRow className={`${memberIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50/70 transition-all duration-200 h-12 border-b border-gray-100`}>
      {/* Name Cell */}
      <TableCell className="border-r border-gray-200 px-3 py-2 name-column">
        <NameCell member={member} />
      </TableCell>
      {/* Project Count */}
      <TableCell className="text-center border-r border-gray-200 px-2 py-2 count-column">
        <span className="inline-flex items-center justify-center w-8 h-8 bg-slate-500 text-white rounded-md font-bold text-xs shadow-sm">
          {projectCount}
        </span>
      </TableCell>
      {/* Utilization: Large bar */}
      <TableCell className="text-center border-r border-gray-200 px-3 py-2 utilization-column">
        <LongCapacityBar
          totalUsedHours={totalUsedHours}
          totalCapacity={weeklyCapacity}
        />
      </TableCell>
      {/* Leave Badge Cells + editable Other */}
      <MultiLeaveBadgeCell
        annualLeave={annualLeave}
        holidayHours={holidayHours}
        otherLeave={displayedOtherLeave}
        remarks={remarks}
        leaveDays={leaveDays}
        className="px-2 py-2"
        editableOther={editableOtherLeave}
        onOtherLeaveChange={v => {
          setOtherLeave(v);
          if (onOtherLeaveEdit) onOtherLeaveEdit(member.id, v);
        }}
      />
      {/* Project Cells */}
      {projects.map((project) => {
        const allocationKey = `${member.id}:${project.id}`;
        const hours = allocationMap.get(allocationKey) || 0;
        return (
          <TableCell key={project.id} className="text-center border-r border-gray-200 px-1 py-2 project-column">
            {hours > 0 && (
              <span className="inline-flex items-center justify-center w-8 h-8 bg-emerald-500 text-white rounded-md font-bold text-xs shadow-sm hover:bg-emerald-600 transition-colors duration-200">
                {hours}
              </span>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
