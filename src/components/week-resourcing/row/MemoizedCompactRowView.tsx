
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
import { MemberVacationPopover } from '@/components/weekly-rundown/MemberVacationPopover';
import { format, startOfWeek } from 'date-fns';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName } from '@/utils/projectDisplay';
import { formatAllocationValue } from '@/utils/allocationDisplay';
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
  const { projectDisplayPreference, displayPreference } = useAppSettings();
  
  // STANDARDIZED CALCULATIONS - Use the utility functions consistently
  const weeklyCapacity = useMemo(() => member?.weekly_capacity || 40, [member?.weekly_capacity]);
  
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

  // Calculate total leave hours for utilization
  const totalLeaveHours = useMemo(() => 
    annualLeave + holidayHours + otherLeave, 
    [annualLeave, holidayHours, otherLeave]
  );

  // Use the standardized capacity display calculation WITH leave hours
  const capacityDisplay = useMemo(() => 
    calculateCapacityDisplay(member.id, allocationMap, weeklyCapacity, totalLeaveHours), 
    [member.id, allocationMap, weeklyCapacity, totalLeaveHours]
  );
  
  const projectCount = useMemo(() => 
    calculateMemberProjectCount(member.id, allocationMap), 
    [member.id, allocationMap]
  );

  // Fetch detailed allocations for enhanced tooltips
  const { data: detailedAllocations } = useDetailedWeeklyAllocations(selectedWeek, [member.id]);
  const memberDetailedData = detailedAllocations?.[member.id];

  // Memoize member data to prevent recalculations
  const memberData = useMemo(() => ({
    initials: member ? `${(member.first_name || '').charAt(0)}${(member.last_name || '').charAt(0)}`.toUpperCase() : '??',
    displayName: member ? `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unnamed' : 'Unknown',
    avatarUrl: member?.avatar_url
  }), [member]);

  // Get project allocations for tooltip
  const memberProjectAllocations = useMemo(() => {
    const allocations: { projectId: string; projectName: string; projectCode: string; hours: number }[] = [];
    projects.forEach(project => {
      const key = `${member.id}:${project.id}`;
      const hours = allocationMap.get(key) || 0;
      if (hours > 0) {
        allocations.push({
          projectId: project.id,
          projectName: project.name,
          projectCode: project.code,
          hours
        });
      }
    });
    return allocations;
  }, [member.id, projects, allocationMap]);

  const memberTooltip = useMemo(() => (
    <div className="space-y-2">
      <div className="font-semibold text-sm text-foreground">{memberData.displayName}</div>
      <div className="text-xs text-muted-foreground">
        {Math.round(capacityDisplay.utilizationPercentage)}% utilized • {formatAllocationValue(capacityDisplay.totalHours, weeklyCapacity, displayPreference)} allocated
      </div>
      
      {memberProjectAllocations.length > 0 ? (
        <div className="space-y-1.5 pt-1 border-t border-border">
          <div className="text-xs font-medium text-muted-foreground">Working on:</div>
          {memberProjectAllocations.map((project) => (
            <div key={project.projectId} className="flex justify-between items-center text-xs">
              <span className="text-foreground truncate max-w-[140px]">
                {getProjectDisplayName({ code: project.projectCode, name: project.projectName }, projectDisplayPreference)}
              </span>
              <span className="text-muted-foreground font-medium ml-2">{formatAllocationValue(project.hours, weeklyCapacity, displayPreference)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground italic pt-1 border-t border-border">
          No projects assigned this week
        </div>
      )}
    </div>
  ), [memberData.displayName, capacityDisplay, memberProjectAllocations, projectDisplayPreference, displayPreference, weeklyCapacity]);


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
        <MemberVacationPopover
          memberId={member.id}
          memberName={memberData.displayName}
          weekStartDate={format(startOfWeek(selectedWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd')}
        >
          <div className="cursor-pointer">
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <div
                    className="flex items-center w-full gap-2"
                    style={{ width: '100%', minWidth: 0, height: '26px' }}
                    title={memberData.displayName}
                  >
                    <Avatar className="h-6 w-6 min-w-[24px] min-h-[24px] hover:ring-2 hover:ring-primary/50 transition-all" >
                      <AvatarImage 
                        src={memberData.avatarUrl} 
                        alt={memberData.displayName}
                      />
                      <AvatarFallback className="text-white text-[11px]" style={{ background: 'linear-gradient(135deg, hsl(var(--gradient-start)), hsl(var(--gradient-mid)))' }}>
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
                  <p className="text-xs text-muted-foreground/70 pt-1 border-t border-border/50 mt-2">Click to add hours or leave</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </MemberVacationPopover>
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
                totalUsedHours={capacityDisplay.totalHours}
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
        style={{ width: 33, minWidth: 33, maxWidth: 33 }}
      >
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
