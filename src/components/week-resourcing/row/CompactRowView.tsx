
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { MultiLeaveBadgeCell } from './MultiLeaveBadgeCell';
import { LongCapacityBar } from '../LongCapacityBar';
import { RowData, useRowData } from './RowUtilsHooks';
import { EnhancedUtilizationTooltip } from '../tooltips/EnhancedUtilizationTooltip';
import { ProjectCellTooltip } from '../tooltips/ProjectCellTooltip';
import { useDetailedWeeklyAllocations } from '../hooks/useDetailedWeeklyAllocations';

interface CompactRowViewProps extends RowData {
  viewMode: 'compact';
  selectedWeek?: Date;
}

export const CompactRowView: React.FC<CompactRowViewProps> = ({
  member,
  memberIndex,
  projects,
  allocationMap,
  selectedWeek = new Date(),
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
  } = useRowData(member, { projects, allocationMap, ...props });

  // Fetch detailed allocations for enhanced tooltips
  const { data: detailedAllocations } = useDetailedWeeklyAllocations(selectedWeek, [member.id]);
  const memberDetailedData = detailedAllocations?.[member.id];

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

  // Get project allocations for this member
  const memberProjectAllocations = projects
    .map(project => {
      const allocationKey = `${member.id}:${project.id}`;
      const hours = allocationMap.get(allocationKey) || 0;
      return {
        project,
        hours
      };
    })
    .filter(allocation => allocation.hours > 0);

  // Calculate project hours total
  const totalProjectHours = memberProjectAllocations.reduce((sum, allocation) => sum + allocation.hours, 0);

  // Utilization percentage for detailed tooltip
  const utilizationPercentage = weeklyCapacity > 0 ? Math.round((totalUsedHours / weeklyCapacity) * 100) : 0;

  // Enhanced utilization tooltip data
  const enhancedUtilizationData = {
    memberName: getMemberDisplayName(),
    selectedWeek,
    totalUsedHours,
    weeklyCapacity,
    utilizationPercentage,
    annualLeave,
    holidayHours,
    otherLeave: displayedOtherLeave,
    projects: memberDetailedData?.projects || []
  };

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
      {/* Team Member consolidated cell - 180px fixed */}
      <TableCell
        className="border-r border-gray-200 px-2 py-0.5 name-column bg-gradient-to-r from-blue-50 to-indigo-50"
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
                    maxWidth: 'calc(100% - 32px)',
                    display: 'block',
                    wordWrap: 'break-word',
                    whiteSpace: 'normal',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxHeight: '2.4em',
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
      
      {/* Utilization: 200px fixed Progress Bar with enhanced detailed tooltip */}
      <TableCell 
        className="text-center border-r border-gray-200 px-1 py-0.5 utilization-column bg-gradient-to-r from-emerald-50 to-green-50"
        style={{ width: 200, minWidth: 200, maxWidth: 200 }}
      >
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
              className="z-[250] max-w-lg px-3 py-2 bg-white border border-gray-200 shadow-xl"
              side="top"
              align="center"
            >
              <EnhancedUtilizationTooltip {...enhancedUtilizationData} />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      
      {/* Leave Badge Cells + editable Other - 150px fixed */}
      <TableCell 
        className="text-center border-r border-gray-200 px-0.5 py-0.5 bg-gradient-to-r from-yellow-50 to-orange-50 leave-column" 
        style={{ width: 150, minWidth: 150, maxWidth: 150 }}
      >
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

      {/* Project Count - 35px fixed */}
      <TableCell 
        className="text-center border-r border-gray-200 px-1 py-0.5 count-column bg-gradient-to-r from-gray-50 to-slate-50"
        style={{ width: 35, minWidth: 35, maxWidth: 35 }}
      >
        <span className="inline-flex items-center justify-center w-7 h-6 bg-slate-500 text-white rounded-sm font-semibold text-[11px] shadow-sm">
          {projectCount}
        </span>
      </TableCell>
      
      {/* Project Cells - all 35px fixed with enhanced tooltips */}
      {projects.map((project) => {
        const allocationKey = `${member.id}:${project.id}`;
        const hours = allocationMap.get(allocationKey) || 0;
        const projectDetailedData = memberDetailedData?.projects.find(p => p.project_id === project.id);
        
        return (
          <TableCell
            key={project.id}
            className="text-center border-r border-gray-200 px-0.5 py-0.5 project-column bg-gradient-to-r from-purple-50 to-violet-50"
            style={{ width: 35, minWidth: 35, maxWidth: 35 }}
          >
            {hours > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-500 text-white rounded-sm font-semibold text-[11px] hover:bg-emerald-600 transition-colors duration-100 cursor-pointer">
                      {hours}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent 
                    className="z-[250] max-w-xs px-3 py-2 bg-white border border-gray-200 shadow-xl"
                    side="top"
                    align="center"
                  >
                    <ProjectCellTooltip
                      projectName={project.name}
                      projectCode={project.code}
                      memberName={getMemberDisplayName()}
                      selectedWeek={selectedWeek}
                      totalHours={hours}
                      dailyBreakdown={projectDetailedData?.daily_breakdown}
                    />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
