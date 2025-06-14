
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

  // Utilization percentage for detailed tooltip
  const utilizationPercentage = weeklyCapacity > 0 ? Math.round((totalUsedHours / weeklyCapacity) * 100) : 0;

  const utilizationTooltip = (
    <div className="space-y-2">
      <div className="font-bold mb-2 text-[#6465F0]">
        {getMemberDisplayName()} — Utilization Details
      </div>
      <div className="flex flex-col gap-1 text-xs">
        <div>
          <span className="font-semibold">Utilization:</span> {utilizationPercentage}%
        </div>
        <div>
          <span className="font-semibold">Total Used:</span> {totalUsedHours}h / {weeklyCapacity}h
        </div>
        <div>
          <span className="font-semibold">Project Hours:</span> {totalUsedHours - annualLeave - holidayHours - displayedOtherLeave}h
        </div>
        <div>
          <span className="font-semibold">Annual Leave:</span> {annualLeave}h
        </div>
        <div>
          <span className="font-semibold">Holiday Hours:</span> {holidayHours}h
        </div>
        <div>
          <span className="font-semibold">Other Leave:</span> {displayedOtherLeave}h
        </div>
        <div className="text-gray-500 mt-1">
          <span>Strategic insight:</span> <br />
          {utilizationPercentage > 100
            ? "Overallocation risk! Review project loads or adjust capacity."
            : utilizationPercentage < 60
            ? "Low utilization. Consider re-assigning or rebalancing workload."
            : "Healthy workload distribution this week."}
        </div>
      </div>
    </div>
  );

  // Annual leave only tooltip (no hours display)
  const annualLeaveTooltip = (
    <div className="space-y-1 text-xs">
      <p className="font-semibold mb-2">Annual Leave Details</p>
      {leaveDays && leaveDays.length > 0 ? (
        leaveDays.map((day, index) => (
          <div key={index} className="flex justify-between items-center">
            <span>{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <span className="ml-2 font-medium">{day.hours}h</span>
          </div>
        ))
      ) : (
        <p>No annual leave this week</p>
      )}
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
      {/* Team Member consolidated cell - 180px */}
      <TableCell
        className="border-r border-gray-200 px-2 py-0.5 name-column min-w-[180px] max-w-[180px] w-[180px] overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50"
        style={{ width: 180, minWidth: 180, maxWidth: 180, zIndex: 5 }}
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
                  className="font-semibold leading-tight"
                  style={{
                    fontSize: '15px',
                    lineHeight: '1.2',
                    maxWidth: 'calc(100% - 32px)', // Leave space for avatar
                    display: 'block',
                    wordWrap: 'break-word',
                    whiteSpace: 'normal',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxHeight: '2.4em', // Allow for 2 lines
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
      
      {/* Utilization: Full Width Progress Bar with detailed tooltip */}
      <TableCell className="text-center border-r border-gray-200 px-1 py-0.5 utilization-column bg-gradient-to-r from-emerald-50 to-green-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-pointer">
                <LongCapacityBar
                  totalUsedHours={totalUsedHours}
                  totalCapacity={weeklyCapacity}
                  compact
                />
              </div>
            </TooltipTrigger>
            <TooltipContent 
              className="z-[250] max-w-xs px-3 py-2 bg-white border border-gray-200 shadow-xl"
            >
              {utilizationTooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      
      {/* Leave Badge Cells + editable Other - 150px */}
      <TableCell className="text-center border-r border-gray-200 px-0.5 py-0.5 bg-gradient-to-r from-yellow-50 to-orange-50 min-w-[150px] max-w-[150px] w-[150px]" style={{ width: 150, minWidth: 150, maxWidth: 150 }}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-pointer">
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
              </div>
            </TooltipTrigger>
            <TooltipContent 
              className="z-[250] max-w-xs px-3 py-2 bg-white border border-gray-200 shadow-xl"
            >
              {annualLeaveTooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>

      {/* Project Count - moved after leave */}
      <TableCell className="text-center border-r border-gray-200 px-1 py-0.5 count-column bg-gradient-to-r from-gray-50 to-slate-50 min-w-[35px] max-w-[35px] w-[35px]">
        <span className="inline-flex items-center justify-center w-7 h-6 bg-slate-500 text-white rounded-sm font-semibold text-[11px] shadow-sm">
          {projectCount}
        </span>
      </TableCell>
      
      {/* Project Cells */}
      {projects.map((project) => {
        const allocationKey = `${member.id}:${project.id}`;
        const hours = allocationMap.get(allocationKey) || 0;
        return (
          <TableCell
            key={project.id}
            className="text-center border-r border-gray-200 px-0.5 py-0.5 project-column bg-gradient-to-r from-purple-50 to-violet-50"
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
