
import React, { memo, useMemo } from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { NameCell } from '../cells/NameCell';
import { EnhancedTooltip } from '../EnhancedTooltip';
import { MultiLeaveBadgeCell } from './MultiLeaveBadgeCell';
import { LongCapacityBar } from '../LongCapacityBar';
import { RowData, useRowData } from './RowUtilsHooks';
import { format, startOfWeek } from 'date-fns';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue, formatCapacityValue } from '@/utils/allocationDisplay';
import { getMemberCapacity } from '@/utils/capacityUtils';

interface ExpandedRowViewProps extends RowData {
  viewMode: 'expanded';
  selectedWeek?: Date;
}

const ExpandedRowViewComponent: React.FC<ExpandedRowViewProps> = ({
  member,
  memberIndex,
  projects,
  allocationMap,
  annualLeaveData,
  holidaysData,
  otherLeaveData = {},
  getMemberTotal,
  getProjectCount,
  getWeeklyLeave,
  updateOtherLeave,
  onOtherLeaveEdit,
  selectedWeek = new Date(),
}) => {
  const { displayPreference, workWeekHours } = useAppSettings();
  const weekStartDate = format(startOfWeek(selectedWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  
  // Get leave data directly from props for reliability
  const weeklyCapacity = getMemberCapacity(member?.weekly_capacity, workWeekHours);
  const annualLeave = annualLeaveData?.[member.id] || 0;
  const holidayHours = holidaysData?.[member.id] || 0;
  const otherLeave = otherLeaveData?.[member.id] || 0;
  
  const {
    totalUsedHours,
    projectCount,
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

  // Calculate total hours including leave for proper utilization display
  const totalLeaveHours = annualLeave + holidayHours + otherLeave;
  const totalHoursWithLeave = totalUsedHours + totalLeaveHours;

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

  // Calculate utilization percentage
  const utilizationPercentage = weeklyCapacity > 0 ? Math.round((totalHoursWithLeave / weeklyCapacity) * 100) : 0;

  // Theme-based alternating row colors
  const rowBgColor = memberIndex % 2 === 0 
    ? 'hsl(var(--background))' 
    : 'hsl(var(--theme-primary) / 0.02)';

  return (
    <TableRow 
      className="transition-colors duration-200 h-20"
      style={{ 
        backgroundColor: rowBgColor,
        borderBottom: '1px solid hsl(var(--border) / 0.3)'
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--theme-primary) / 0.08)'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = rowBgColor}
    >
      {/* Name Cell */}
      <TableCell 
        className="px-4 py-3 min-w-[180px]"
        style={{
          backgroundColor: 'hsl(var(--theme-primary) / 0.05)',
          borderRight: '2px solid hsl(var(--theme-primary) / 0.15)',
          borderBottom: '1px solid hsl(var(--border) / 0.3)'
        }}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <NameCell 
              member={member} 
              weekStartDate={weekStartDate}
              projectAllocations={memberProjectAllocations}
              utilizationPercentage={utilizationPercentage}
              totalAllocatedHours={totalHoursWithLeave}
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {member.office_location && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                {member.office_location}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-50 text-gray-700 border-gray-200">
              {formatCapacityValue(weeklyCapacity, displayPreference)} capacity
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
      <TableCell 
        className="text-center px-3 py-3"
        style={{
          borderRight: '1px solid hsl(var(--border) / 0.5)',
          borderBottom: '1px solid hsl(var(--border) / 0.3)'
        }}
      >
        {projectCount}
      </TableCell>
      
      {/* Utilization: Larger Progress Bar - Include leave hours */}
      <TableCell 
        className="text-center px-3 py-3"
        style={{
          borderRight: '1px solid hsl(var(--border) / 0.5)',
          borderBottom: '1px solid hsl(var(--border) / 0.3)'
        }}
      >
        <LongCapacityBar
          totalUsedHours={totalHoursWithLeave}
          totalCapacity={weeklyCapacity}
        />
      </TableCell>
      
      
      {/* Project allocation cells */}
      {projects.map((project, projectIndex) => {
        const allocationKey = `${member.id}:${project.id}`;
        const hours = allocationMap.get(allocationKey) || 0;
        
        // Alternating column backgrounds
        const columnBgColor = projectIndex % 2 === 0 
          ? 'transparent' 
          : 'hsl(var(--theme-primary) / 0.02)';
        
        return (
          <TableCell 
            key={project.id} 
            className="text-center px-2 py-3"
            style={{
              backgroundColor: columnBgColor,
              borderRight: '1px solid hsl(var(--border) / 0.5)',
              borderBottom: '1px solid hsl(var(--border) / 0.3)'
            }}
          >
            <EnhancedTooltip
              type="project"
              projectBreakdown={getProjectBreakdown(project, hours)}
            >
              {hours > 0 && (
                <span 
                  className="inline-flex items-center justify-center w-10 h-8 text-white rounded-lg font-semibold text-sm shadow-sm"
                  style={{ backgroundColor: 'hsl(var(--theme-primary))' }}
                >
                  {formatAllocationValue(hours, weeklyCapacity, displayPreference)}
                </span>
              )}
            </EnhancedTooltip>
          </TableCell>
        );
      })}
    </TableRow>
  );
};

// Memoize with comparison that includes the specific member's utilization inputs
export const ExpandedRowView = memo(ExpandedRowViewComponent, (prevProps, nextProps) => {
  const memberId = nextProps.member.id;

  const membersEqual = prevProps.member.id === nextProps.member.id;
  const indexEqual = prevProps.memberIndex === nextProps.memberIndex;
  const projectsEqual = prevProps.projects.length === nextProps.projects.length;
  const allocationEqual = prevProps.allocationMap.size === nextProps.allocationMap.size;
  const viewModeEqual = prevProps.viewMode === nextProps.viewMode;

  const annualLeaveEqual = (prevProps.annualLeaveData?.[memberId] || 0) === (nextProps.annualLeaveData?.[memberId] || 0);
  const holidayEqual = (prevProps.holidaysData?.[memberId] || 0) === (nextProps.holidaysData?.[memberId] || 0);
  const otherLeaveEqual = (prevProps.otherLeaveData?.[memberId] || 0) === (nextProps.otherLeaveData?.[memberId] || 0);

  return (
    membersEqual &&
    indexEqual &&
    projectsEqual &&
    allocationEqual &&
    viewModeEqual &&
    annualLeaveEqual &&
    holidayEqual &&
    otherLeaveEqual
  );
});
