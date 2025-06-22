
import React, { useState } from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MultiLeaveBadgeCell } from './MultiLeaveBadgeCell';
import { LongCapacityBar } from '../LongCapacityBar';
import { RowData, useRowData } from './RowUtilsHooks';
import { ProjectCellTooltip } from '../tooltips/ProjectCellTooltip';
import { useDetailedWeeklyAllocations } from '../hooks/useDetailedWeeklyAllocations';
import { format, addDays, startOfWeek } from 'date-fns';

interface CompactRowViewProps extends RowData {
  viewMode: 'compact';
  selectedWeek?: Date;
  otherLeaveData?: Record<string, number>;
  updateOtherLeave?: (memberId: string, hours: number, notes?: string) => Promise<boolean>;
}

// Enhanced Utilization Popover Component
const EnhancedUtilizationPopover: React.FC<{
  memberName: string;
  selectedWeek: Date;
  totalUsedHours: number;
  weeklyCapacity: number;
  utilizationPercentage: number;
  annualLeave: number;
  holidayHours: number;
  otherLeave: number;
  projects: Array<{
    project_id: string;
    project_name: string;
    project_code: string;
    total_hours: number;
    daily_breakdown: Array<{
      date: string;
      hours: number;
    }>;
  }>;
}> = ({
  memberName,
  selectedWeek,
  totalUsedHours,
  weeklyCapacity,
  utilizationPercentage,
  annualLeave,
  holidayHours,
  otherLeave,
  projects
}) => {
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Calculate total project hours
  const totalProjectHours = projects.reduce((sum, p) => sum + p.total_hours, 0);

  // Create daily breakdown map for all projects combined
  const dailyBreakdown = new Map<string, number>();
  projects.forEach(project => {
    project.daily_breakdown.forEach(day => {
      const current = dailyBreakdown.get(day.date) || 0;
      dailyBreakdown.set(day.date, current + day.hours);
    });
  });

  return (
    <div className="space-y-4 max-w-lg">
      <div className="font-bold text-base text-[#6465F0] border-b border-gray-200 pb-2">
        {memberName} — Weekly Utilization
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-blue-50 p-2 rounded">
          <div className="font-semibold text-blue-700">Utilization</div>
          <div className="text-blue-600">{utilizationPercentage}%</div>
        </div>
        <div className="bg-green-50 p-2 rounded">
          <div className="font-semibold text-green-700">Capacity</div>
          <div className="text-green-600">{totalUsedHours}h / {weeklyCapacity}h</div>
        </div>
      </div>

      {/* Daily Project Hours Breakdown */}
      <div className="border-t border-gray-200 pt-3">
        <div className="font-semibold text-xs mb-2">Daily Project Hours</div>
        <div className="grid grid-cols-7 gap-1 text-[10px]">
          {weekDays.map((day, index) => {
            const date = format(addDays(weekStart, index), 'yyyy-MM-dd');
            const hours = dailyBreakdown.get(date) || 0;
            return (
              <div key={day} className="text-center">
                <div className="font-medium text-gray-600">{day}</div>
                <div className={`text-center py-1 px-0.5 rounded text-[10px] font-medium ${
                  hours > 0 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-50 text-gray-400'
                }`}>
                  {hours > 0 ? `${hours}h` : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Breakdown with Daily Hours */}
      {projects.length > 0 && (
        <div className="border-t border-gray-200 pt-3">
          <div className="font-semibold text-xs mb-2">Projects This Week</div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {projects.map(project => (
              <div key={project.project_id} className="bg-gray-50 p-2 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-700 truncate flex-1">
                    {project.project_code}
                  </span>
                  <span className="font-medium text-blue-600 text-xs ml-2">
                    {project.total_hours}h
                  </span>
                </div>
                {/* Daily breakdown for this project */}
                <div className="grid grid-cols-7 gap-1 mt-1">
                  {weekDays.map((day, index) => {
                    const date = format(addDays(weekStart, index), 'yyyy-MM-dd');
                    const dayData = project.daily_breakdown.find(d => d.date === date);
                    const hours = dayData?.hours || 0;
                    return (
                      <div key={`${project.project_id}-${day}`} className="text-center">
                        <div className={`text-[9px] py-0.5 px-0.5 rounded ${
                          hours > 0 
                            ? 'bg-emerald-100 text-emerald-700 font-medium' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {hours > 0 ? `${hours}h` : '—'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center font-medium text-xs mt-2 pt-2 border-t border-gray-200">
            <span>Total Project Hours:</span>
            <span className="text-blue-600">{totalProjectHours}h</span>
          </div>
        </div>
      )}

      {/* Leave Breakdown */}
      {(annualLeave > 0 || holidayHours > 0 || otherLeave > 0) && (
        <div className="border-t border-gray-200 pt-3">
          <div className="font-semibold text-xs mb-2">Leave Breakdown</div>
          <div className="space-y-1 text-xs">
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
          </div>
        </div>
      )}

      {/* Strategic Insight */}
      <div className="border-t border-gray-200 pt-2 text-xs text-gray-600 italic">
        {utilizationPercentage > 100
          ? "⚠️ Overallocation risk! Review project loads or adjust capacity."
          : utilizationPercentage < 60
          ? "📈 Low utilization. Consider re-assigning or rebalancing workload."
          : "✅ Healthy workload distribution this week."}
      </div>
    </div>
  );
};

export const CompactRowView: React.FC<CompactRowViewProps> = ({
  member,
  memberIndex,
  projects,
  allocationMap,
  selectedWeek = new Date(),
  otherLeaveData = {},
  updateOtherLeave,
  ...props
}) => {
  const [utilizationPopoverOpen, setUtilizationPopoverOpen] = useState(false);

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
      
      {/* Utilization: 200px fixed Progress Bar with click-activated enhanced popover */}
      <TableCell 
        className="text-center border-r border-gray-200 px-1 py-0.5 utilization-column bg-gradient-to-r from-emerald-50 to-green-50"
        style={{ width: 200, minWidth: 200, maxWidth: 200 }}
      >
        <Popover open={utilizationPopoverOpen} onOpenChange={setUtilizationPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="cursor-pointer">
              <LongCapacityBar
                totalUsedHours={totalUsedHours}
                totalCapacity={weeklyCapacity}
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
              memberName={getMemberDisplayName()}
              selectedWeek={selectedWeek}
              totalUsedHours={totalUsedHours}
              weeklyCapacity={weeklyCapacity}
              utilizationPercentage={utilizationPercentage}
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
