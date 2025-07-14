
import React, { memo, useMemo } from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MultiLeaveBadgeCell } from './MultiLeaveBadgeCell';
import { LongCapacityBar } from '../LongCapacityBar';
import { RowData, useRowData } from './RowUtilsHooks';
import { EnhancedUtilizationPopover } from './components/EnhancedUtilizationPopover';
import { ProjectCellTooltip } from '../tooltips/ProjectCellTooltip';
import { useDetailedWeeklyAllocations } from '../hooks/useDetailedWeeklyAllocations';
import { 
  calculateMemberProjectHours, 
  calculateUtilizationPercentage, 
  calculateMemberProjectCount,
  calculateCapacityDisplay
} from '../utils/utilizationCalculations';

interface CompactRowViewProps extends RowData {
  viewMode: 'compact';
  selectedWeek?: Date;
}

const CompactRowViewComponent: React.FC<CompactRowViewProps> = ({
  member,
  memberIndex,
  projects,
  allocationMap,
  selectedWeek = new Date(),
  otherLeaveData = {},
  updateOtherLeave,
  ...props
}) => {
  // STANDARDIZED CALCULATIONS - Use the utility functions consistently
  const weeklyCapacity = useMemo(() => member?.weekly_capacity || 40, [member?.weekly_capacity]);
  
  // Use the standardized capacity display calculation
  const capacityDisplay = useMemo(() => 
    calculateCapacityDisplay(member.id, allocationMap, weeklyCapacity), 
    [member.id, allocationMap, weeklyCapacity]
  );
  
  const projectCount = useMemo(() => 
    calculateMemberProjectCount(member.id, allocationMap), 
    [member.id, allocationMap]
  );

  const {
    annualLeave,
    holidayHours,
    leaveDays,
    editableOtherLeave,
    displayedOtherLeave,
    remarks,
    handleOtherLeaveChange
  } = useRowData(member, { 
    projects, 
    allocationMap, 
    otherLeaveData,
    updateOtherLeave,
    ...props 
  });

  // Get other leave from the new data source
  const otherLeave = otherLeaveData[member.id] || 0;

  // Fetch detailed allocations for enhanced tooltips
  const { data: detailedAllocations } = useDetailedWeeklyAllocations(selectedWeek, [member.id]);
  const memberDetailedData = detailedAllocations?.[member.id];

  // Memoize member data to prevent recalculations
  const memberData = useMemo(() => ({
    initials: member ? `${(member.first_name || '').charAt(0)}${(member.last_name || '').charAt(0)}`.toUpperCase() : '??',
    displayName: member ? `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unnamed' : 'Unknown',
    avatarUrl: member?.avatar_url
  }), [member]);

  const memberTooltip = useMemo(() => (
    <div className="space-y-1 text-xs">
      <p className="font-semibold">{memberData.displayName}</p>
      {member.role && <p>Role: {member.role}</p>}
      {member.department && <p>Department: {member.department}</p>}
      {member.location && <p>Location: {member.location}</p>}
      {member.weekly_capacity && <p>Weekly Capacity: {member.weekly_capacity}h</p>}
      {member.email && <p>Email: {member.email}</p>}
    </div>
  ), [memberData.displayName, member]);

  // Debug logging with FINAL STANDARDIZED calculations
  console.log(`MemoizedCompactRowView FINAL STANDARDIZED for ${memberData.displayName}:`, {
    memberId: member.id,
    ...capacityDisplay,
    projectCount_STANDARDIZED: projectCount,
    allocationMapSize: allocationMap.size,
    allocationMapEntries: Array.from(allocationMap.entries()).filter(([key]) => key.startsWith(member.id))
  });

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
                title={memberData.displayName}
              >
                <Avatar className="h-6 w-6 min-w-[24px] min-h-[24px]" >
                  <AvatarImage 
                    src={memberData.avatarUrl} 
                    alt={memberData.displayName}
                  />
                  <AvatarFallback className="bg-primary text-white text-[11px]">
                    {memberData.initials}
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
                  {memberData.displayName}
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
      
      {/* Utilization: 200px fixed Progress Bar with STANDARDIZED calculation */}
      <TableCell 
        className="text-center border-r border-gray-200 px-1 py-0.5 utilization-column bg-gradient-to-r from-emerald-50 to-green-50"
        style={{ width: 200, minWidth: 200, maxWidth: 200 }}
      >
        <Popover>
          <PopoverTrigger asChild>
            <div className="cursor-pointer">
              <LongCapacityBar
                totalUsedHours={capacityDisplay.projectHours}
                totalCapacity={capacityDisplay.capacity}
                compact
              />
            </div>
          </PopoverTrigger>
          <PopoverContent 
            className="z-[250] max-w-lg px-4 py-3 bg-white border border-gray-200 shadow-xl"
            side="top"
            align="center"
            sideOffset={5}
          >
            <EnhancedUtilizationPopover
              memberName={memberData.displayName}
              selectedWeek={selectedWeek}
              totalUsedHours={capacityDisplay.projectHours}
              weeklyCapacity={capacityDisplay.capacity}
              utilizationPercentage={capacityDisplay.utilizationPercentage}
              annualLeave={annualLeave}
              holidayHours={holidayHours}
              otherLeave={otherLeave}
              projects={memberDetailedData?.projects || []}
            />
          </PopoverContent>
        </Popover>
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
                  otherLeave={otherLeave}
                  remarks={remarks}
                  leaveDays={leaveDays}
                  className="px-0.5 py-0.5"
                  editableOther={true}
                  onOtherLeaveChange={async (value: number) => {
                    if (updateOtherLeave) {
                      await updateOtherLeave(member.id, value);
                    }
                  }}
                  compact
                />
              </div>
            </TooltipTrigger>
            <TooltipContent 
              className="z-[250] max-w-xs px-3 py-2 bg-white border border-gray-200 shadow-xl"
            >
              <div className="space-y-2 text-xs">
                <p className="font-semibold mb-2">Leave Breakdown</p>
                {annualLeave > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Annual Leave:</span>
                    <span className="font-medium">{annualLeave}h</span>
                  </div>
                )}
                {holidayHours > 0 && (
                  <div className="flex justify-between">
                    <span className="text-purple-600">Holiday Hours:</span>
                    <span className="font-medium">{holidayHours}h</span>
                  </div>
                )}
                {otherLeave > 0 && (
                  <div className="flex justify-between">
                    <span className="text-orange-600">Other Leave:</span>
                    <span className="font-medium">{otherLeave}h</span>
                  </div>
                )}
                {annualLeave === 0 && holidayHours === 0 && otherLeave === 0 && (
                  <p className="text-gray-500">No leave this week</p>
                )}
              </div>
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
                      memberName={memberData.displayName}
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

// Simplified memo comparison to be less strict
export const CompactRowView = memo(CompactRowViewComponent, (prevProps, nextProps) => {
  // Only compare the most essential props that actually change
  const membersEqual = prevProps.member.id === nextProps.member.id;
  const indexEqual = prevProps.memberIndex === nextProps.memberIndex;
  const projectsEqual = prevProps.projects.length === nextProps.projects.length;
  const viewModeEqual = prevProps.viewMode === nextProps.viewMode;
  
  return membersEqual && indexEqual && projectsEqual && viewModeEqual;
});
