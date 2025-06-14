
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
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
  } = useRowData(member, { projects, allocationMap, ...props }); // Pass needed objects to useRowData

  // Helpers for compact avatar and name
  const getUserInitials = (): string => {
    if (!member) return '??';
    const firstName = member.first_name || '';
    const lastName = member.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  const getMemberDisplayName = (): string => {
    if (!member) return 'Unknown';
    return `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unnamed';
  };
  const getAvatarUrl = (): string | undefined => {
    if (!member) return undefined;
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  const memberTooltip = (
    <div className="space-y-1 text-xs">
      <p className="font-semibold">{getMemberDisplayName()}</p>
      {member.role && <p>Role: {member.role}</p>}
      {member.department && <p>Department: {member.department}</p>}
      {member.location && <p>Location: {member.location}</p>}
      {member.weekly_capacity && <p>Weekly Capacity: {member.weekly_capacity}h</p>}
      {member.email && <p>Email: {member.email}</p>}
    </div>
  );

  return (
    <TableRow
      className={
        `resource-table-row-compact ${memberIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
        hover:bg-blue-50/80 transition-all duration-150 h-8 min-h-0`
      }
      style={{ fontSize: 12, minHeight: 28, height: 28, lineHeight: 1 }}
    >
      {/* Team Member consolidated cell */}
      <TableCell
        className="border-r border-gray-200 px-1 py-0.5 name-column min-w-[120px] max-w-[120px] w-[120px] overflow-hidden"
        style={{ width: 120, minWidth: 120, maxWidth: 120, background: 'inherit', zIndex: 5 }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex items-center w-full gap-2 cursor-pointer"
                style={{ width: '100%', minWidth: 0, height: '26px' }}
                title={getMemberDisplayName()}
              >
                <Avatar className="h-6 w-6 min-w-[24px] min-h-[24px]" >
                  <AvatarImage 
                    src={getAvatarUrl()} 
                    alt={getMemberDisplayName()}
                  />
                  <AvatarFallback className="bg-[#6465F0] text-white text-[11px]">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <span
                  className="truncate font-semibold"
                  style={{
                    fontSize: '13px',
                    lineHeight: '1.1',
                    maxWidth: 'calc(100% - 32px)', // Leave space for avatar
                    display: 'block',
                  }}
                  data-testid="compact-full-name"
                >
                  {getMemberDisplayName()}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent 
              side="right" 
              align="start" 
              sideOffset={8}
              className="z-[200] max-w-xs"
              avoidCollisions={true}
            >
              {memberTooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
