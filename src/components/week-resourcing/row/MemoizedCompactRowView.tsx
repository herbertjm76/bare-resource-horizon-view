
import React, { memo, useMemo, useState, useCallback, useRef, useEffect } from 'react';

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
import { useCompany } from '@/context/CompanyContext';
import { getProjectDisplayName } from '@/utils/projectDisplay';
import { formatAllocationValue, formatDualAllocationValue } from '@/utils/allocationDisplay';
import { parseInputToHours, hoursToInputDisplay, getAllocationInputConfig } from '@/utils/allocationInput';
import { getAllocationCapacity } from '@/utils/allocationCapacity';
import { saveResourceAllocation } from '@/hooks/allocations/api';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
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
  annualLeaveData,
  holidaysData,
  selectedWeek = new Date(),
  otherLeaveData = {},
  updateOtherLeave,
  getMemberTotal,
  getProjectCount,
  getWeeklyLeave,
  onOtherLeaveEdit,
  ...props
}) => {
  const { projectDisplayPreference, displayPreference, workWeekHours, startOfWorkWeek } = useAppSettings();
  const { company } = useCompany();
  const queryClient = useQueryClient();
  
  // STANDARDIZED CALCULATIONS
  // IMPORTANT:
  // - weeklyCapacity is used for INPUT parsing/validation.
  // - percentCapacity is used for DISPLAYING percentages so "%" is always based on COMPANY workWeekHours.
  const weeklyCapacity = useMemo(
    () =>
      getAllocationCapacity({
        displayPreference,
        workWeekHours,
        memberWeeklyCapacity: member?.weekly_capacity,
      }),
    [displayPreference, workWeekHours, member?.weekly_capacity]
  );

  const percentCapacity = useMemo(() => workWeekHours ?? 40, [workWeekHours]);

  // State for tracking which cell is being edited
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editInputValue, setEditInputValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Input configuration based on display preference
  const inputConfig = useMemo(
    () => getAllocationInputConfig(displayPreference, weeklyCapacity),
    [displayPreference, weeklyCapacity]
  );

  // Handle starting edit mode
  const handleStartEdit = useCallback((projectId: string, currentHours: number) => {
    setEditingProjectId(projectId);
    setEditInputValue(hoursToInputDisplay(currentHours, weeklyCapacity, displayPreference));
  }, [weeklyCapacity, displayPreference]);
  
  // Handle saving allocation
  const handleSaveAllocation = useCallback(async (projectId: string) => {
    // Guard against double-save (Enter triggers blur; blur calls save too)
    if (isSavingRef.current) return;

    const newHours = parseInputToHours(editInputValue, weeklyCapacity, displayPreference);

    console.debug('[alloc-debug] MemoizedCompactRowView save', {
      editInputValue,
      displayPreference,
      weeklyCapacity,
      workWeekHours,
      memberWeeklyCapacity: member?.weekly_capacity,
      parsedHours: newHours,
      selectedWeek,
      projectId,
      memberId: member.id,
    });

    const key = `${member.id}:${projectId}`;
    const currentHours = allocationMap.get(key) || 0;

    // Only save if value changed
    if (Math.abs(newHours - currentHours) > 0.01) {
      isSavingRef.current = true;
      setIsSaving(true);
      try {
        const weekKey = format(
          startOfWeek(selectedWeek, {
            weekStartsOn: startOfWorkWeek === 'Sunday' ? 0 : startOfWorkWeek === 'Saturday' ? 6 : 1,
          }),
          'yyyy-MM-dd'
        );
        await saveResourceAllocation(
          projectId,
          member.id,
          'active',
          weekKey,
          newHours,
          company?.id || '',
          startOfWorkWeek
        );

        // Fire-and-forget invalidations for instant UI feedback
        void queryClient.invalidateQueries({ queryKey: ['streamlined-week-resource-data'] });
        void queryClient.invalidateQueries({ queryKey: ['comprehensive-weekly-allocations'] });
        void queryClient.invalidateQueries({ queryKey: ['available-allocations'] });
        void queryClient.invalidateQueries({ queryKey: ['detailed-weekly-allocations'] });

        window.dispatchEvent(
          new CustomEvent('allocation-updated', {
            detail: {
              weekKey,
              resourceId: member.id,
              memberId: member.id,
              projectId,
              hours: newHours,
            },
          })
        );
      } catch (error) {
        console.error('Failed to save allocation:', error);
      } finally {
        isSavingRef.current = false;
        setIsSaving(false);
      }
    }

    setEditingProjectId(null);
    setEditInputValue('');
  }, [editInputValue, weeklyCapacity, displayPreference, member.id, allocationMap, selectedWeek, company?.id, queryClient, startOfWorkWeek]);
  
  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, projectId: string) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Let blur be the single save path
        e.currentTarget.blur();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setEditingProjectId(null);
        setEditInputValue('');
      }
    },
    []
  );

  // Focus input when editing starts
  useEffect(() => {
    if (editingProjectId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingProjectId]);
  
  // Get leave data directly from props for reliability
  const annualLeave = annualLeaveData?.[member.id] || 0;
  const holidayHours = holidaysData?.[member.id] || 0;
  const otherLeave = otherLeaveData?.[member.id] || 0;
  
  const {
    leaveDays,
    editableOtherLeave,
    displayedOtherLeave,
    remarks,
    handleOtherLeaveChange
  } = useRowData(member, { 
    projects, 
    allocationMap, 
    annualLeaveData,
    holidaysData,
    otherLeaveData,
    updateOtherLeave,
    getMemberTotal,
    getProjectCount,
    getWeeklyLeave,
    onOtherLeaveEdit,
  });

  // Note: otherLeave is already calculated above from otherLeaveData

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
  const memberData = useMemo(() => {
    const fullName = member ? `${member.first_name || ''} ${member.last_name || ''}`.trim() : '';
    let displayName = fullName || 'Unknown';
    if (!fullName && member) {
      // Fallback for pre-registered or deleted resources
      if (member.isPending) displayName = member.name || 'Pending invite';
      else if (member.isDeleted) displayName = member.name || 'Deleted Resource';
      else displayName = member.name || 'Unknown';
    }
    return {
      initials: member ? `${(member.first_name || '').charAt(0)}${(member.last_name || '').charAt(0)}`.toUpperCase() || '??' : '??',
      displayName,
      avatarUrl: member?.avatar_url
    };
  }, [member]);

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
        {Math.round(capacityDisplay.utilizationPercentage)}% utilized • {formatDualAllocationValue(capacityDisplay.totalHours, percentCapacity, displayPreference)} allocated
      </div>
      
      {memberProjectAllocations.length > 0 ? (
        <div className="space-y-1.5 pt-1 border-t border-border">
          <div className="text-xs font-medium text-muted-foreground">Working on:</div>
          {memberProjectAllocations.map((project) => (
            <div key={project.projectId} className="flex justify-between items-center text-xs">
              <span className="text-foreground truncate max-w-[140px]">
                {getProjectDisplayName({ code: project.projectCode, name: project.projectName }, projectDisplayPreference)}
              </span>
              <span className="text-muted-foreground font-medium ml-2">{formatDualAllocationValue(project.hours, percentCapacity, displayPreference)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground italic pt-1 border-t border-border">
          No projects assigned this week
        </div>
      )}
    </div>
  ), [memberData.displayName, capacityDisplay, memberProjectAllocations, projectDisplayPreference, displayPreference, percentCapacity]);

  // Theme-based alternating row colors
  const rowBgColor = memberIndex % 2 === 0 
    ? 'hsl(var(--background))' 
    : 'hsl(var(--theme-primary) / 0.02)';

  return (
    <TableRow
      className="resource-table-row-compact transition-all duration-150 h-8 min-h-0"
      style={{ 
        fontSize: 12, 
        minHeight: 33, 
        height: 33, 
        lineHeight: 1,
        backgroundColor: rowBgColor
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--theme-primary) / 0.08)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = rowBgColor}
    >
      {/* Team Member consolidated cell - 180px fixed */}
      <TableCell
        className="px-2 py-0.5 name-column sticky left-0 z-10"
        style={{ 
          width: 180, 
          minWidth: 180, 
          maxWidth: 180, 
          backgroundColor: 'hsl(var(--theme-primary) / 0.05)',
          borderRight: '2px solid hsl(var(--theme-primary) / 0.15)',
          borderBottom: '1px solid hsl(var(--border) / 0.3)'
        }}
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
        className="text-center px-1 py-0.5 utilization-column"
        style={{ 
          width: 200, 
          minWidth: 200, 
          maxWidth: 200,
          borderRight: '1px solid hsl(var(--border) / 0.5)',
          borderBottom: '1px solid hsl(var(--border) / 0.3)'
        }}
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
            className="z-[250] max-w-lg px-4 py-3 bg-popover border border-border shadow-xl"
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
      

      {/* Project Count - 35px fixed */}
      <TableCell 
        className="text-center px-1 py-0.5 count-column"
        style={{ 
          width: 35, 
          minWidth: 35, 
          maxWidth: 35,
          borderRight: '1px solid hsl(var(--border) / 0.5)',
          borderBottom: '1px solid hsl(var(--border) / 0.3)'
        }}
      >
        <span 
          className="inline-flex items-center justify-center w-7 h-6 rounded-sm font-semibold text-[11px] shadow-sm"
          style={{
            backgroundColor: 'hsl(var(--theme-primary))',
            color: 'white'
          }}
        >
          {projectCount}
        </span>
      </TableCell>
      
      {/* Project Cells - all 50px fixed with inline editing */}
      {projects.map((project, projectIndex) => {
        const allocationKey = `${member.id}:${project.id}`;
        const hours = allocationMap.get(allocationKey) || 0;
        const projectDetailedData = memberDetailedData?.projects.find(p => p.project_id === project.id);
        const isEditing = editingProjectId === project.id;
        
        // Alternating column backgrounds
        const columnBgColor = projectIndex % 2 === 0 
          ? 'transparent' 
          : 'hsl(var(--theme-primary) / 0.02)';
        
        return (
          <TableCell
            key={project.id}
            className="text-center px-0.5 py-0.5 project-column"
            style={{ 
              width: 50, 
              minWidth: 50, 
              maxWidth: 50,
              backgroundColor: columnBgColor,
              borderRight: '1px solid hsl(var(--border) / 0.5)',
              borderBottom: '1px solid hsl(var(--border) / 0.3)'
            }}
          >
            {isEditing ? (
              <input
                ref={editInputRef}
                type="number"
                min={inputConfig.min}
                max={inputConfig.max}
                step={inputConfig.step}
                value={editInputValue}
                onChange={(e) => setEditInputValue(e.target.value)}
                onBlur={() => handleSaveAllocation(project.id)}
                onKeyDown={(e) => handleKeyDown(e, project.id)}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                disabled={isSaving}
                placeholder={inputConfig.placeholder}
                className={cn(
                  "w-full h-6 text-center text-[11px] font-medium border rounded",
                  "bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary",
                  "transition-all duration-150",
                  isSaving && "opacity-50 cursor-wait"
                )}
              />
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      onClick={() => handleStartEdit(project.id, hours)}
                      className={cn(
                        "w-full h-full flex items-center justify-center cursor-pointer hover:bg-accent/50 rounded transition-colors",
                        hours > 0 ? "" : "text-gray-300"
                      )}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleStartEdit(project.id, hours);
                        }
                      }}
                      aria-label={hours > 0 ? `Edit ${hours}h allocation` : 'Add allocation'}
                    >
                      {hours > 0 ? (
                        <span className="inline-flex items-center justify-center w-7 h-6 bg-emerald-500 text-white rounded-sm font-semibold text-[11px] hover:bg-emerald-600 transition-colors duration-100">
                          {formatAllocationValue(hours, weeklyCapacity, displayPreference)}
                        </span>
                      ) : (
                        <span className="text-[11px]">—</span>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent 
                    className="z-[250] max-w-xs px-3 py-2 bg-popover border border-border shadow-xl"
                    side="top"
                    align="center"
                  >
                    <ProjectCellTooltip
                      projectName={project.name}
                      projectCode={project.code}
                      memberName={memberData.displayName}
                      selectedWeek={selectedWeek}
                      totalHours={hours}
                      capacity={weeklyCapacity}
                      dailyBreakdown={projectDetailedData?.daily_breakdown}
                    />
                    <p className="text-xs text-muted-foreground/70 pt-1 border-t border-border/50 mt-2">Click to edit</p>
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

// Memoize with comparison that includes the specific member's utilization inputs
export const CompactRowView = memo(CompactRowViewComponent, (prevProps, nextProps) => {
  const memberId = nextProps.member.id;

  const membersEqual = prevProps.member.id === nextProps.member.id;
  const indexEqual = prevProps.memberIndex === nextProps.memberIndex;
  const projectsEqual = prevProps.projects.length === nextProps.projects.length;
  const viewModeEqual = prevProps.viewMode === nextProps.viewMode;

  // IMPORTANT: allocationMap.size is NOT enough (hours can change without size changing).
  // Build a lightweight per-member signature across all projects to detect updates.
  const getMemberAllocationSignature = (allocationMap: Map<string, number>, projects: any[]) => {
    let hash = 0;
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      const key = `${memberId}:${p.id}`;
      const hours = allocationMap.get(key) || 0;
      // Simple rolling hash: order-sensitive, cheap, stable
      hash = (hash * 31 + Math.round(hours * 10) + i) >>> 0;
    }
    return hash;
  };

  const allocationEqual =
    getMemberAllocationSignature(prevProps.allocationMap, prevProps.projects) ===
    getMemberAllocationSignature(nextProps.allocationMap, nextProps.projects);

  const annualLeaveEqual = (prevProps.annualLeaveData?.[memberId] || 0) === (nextProps.annualLeaveData?.[memberId] || 0);
  const holidayEqual = (prevProps.holidaysData?.[memberId] || 0) === (nextProps.holidaysData?.[memberId] || 0);
  const otherLeaveEqual = (prevProps.otherLeaveData?.[memberId] || 0) === (nextProps.otherLeaveData?.[memberId] || 0);

  return (
    membersEqual &&
    indexEqual &&
    projectsEqual &&
    viewModeEqual &&
    allocationEqual &&
    annualLeaveEqual &&
    holidayEqual &&
    otherLeaveEqual
  );
});
