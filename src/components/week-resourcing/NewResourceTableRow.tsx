
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { NameCell } from './cells/NameCell';
import { ProjectCountCell } from './cells/ProjectCountCell';
import { CapacityBarCell } from './row/CapacityBarCell';
import { ReadOnlyLeaveCell } from './cells/ReadOnlyLeaveCell';
import { Badge } from '@/components/ui/badge';
import { EnhancedTooltip } from './EnhancedTooltip';

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
  viewMode = 'compact'
}) => {
  const isExpanded = viewMode === 'expanded';
  const weeklyCapacity = member.weekly_capacity || 40;
  const totalUsedHours = getMemberTotal(member.id);
  const projectCount = getProjectCount(member.id);
  const annualLeave = annualLeaveData[member.id] || 0;
  const holidayHours = holidaysData[member.id] || 0;
  const leaveDays = getWeeklyLeave(member.id);

  const utilizationPercentage = weeklyCapacity > 0 ? Math.round((totalUsedHours / weeklyCapacity) * 100) : 0;

  // Enhanced styling for compact view
  const getUtilizationStyle = () => {
    if (utilizationPercentage > 100) {
      return 'bg-red-500 text-white border-red-600 shadow-red-200';
    } else if (utilizationPercentage > 80) {
      return 'bg-amber-500 text-white border-amber-600 shadow-amber-200';
    } else {
      return 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-200';
    }
  };

  const getProjectBreakdown = (project: any, hours: number) => ({
    projectName: project.name,
    projectCode: project.code,
    projectStage: project.current_stage || project.stage,
    projectFee: project.fee,
    hours: hours,
    isActive: !!(hours > 0)
  });

  if (isExpanded) {
    // Expanded view with enhanced layout
    return (
      <TableRow className={`${memberIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors duration-200 h-20 border-b`}>
        {/* Enhanced Name Cell for Expanded */}
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
        
        {/* Project Count - Expanded */}
        <TableCell className="text-center border-r border-gray-200 px-3 py-3">
          <div className="inline-flex items-center justify-center w-12 h-8 bg-slate-100 text-slate-700 rounded-lg font-semibold text-sm border border-slate-200">
            {projectCount}
          </div>
        </TableCell>
        
        {/* Total Hours - Expanded */}
        <TableCell className="text-center border-r border-gray-200 px-3 py-3">
          <EnhancedTooltip
            type="total"
            member={member}
            totalUsedHours={totalUsedHours}
            weeklyCapacity={weeklyCapacity}
            annualLeave={annualLeave}
            holidayHours={holidayHours}
            leaveDays={leaveDays}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="inline-flex items-center justify-center w-16 h-8 bg-blue-500 text-white rounded-lg font-semibold text-sm shadow-sm">
                {totalUsedHours}h
              </span>
              <span className="text-xs text-gray-500">of {weeklyCapacity}h</span>
            </div>
          </EnhancedTooltip>
        </TableCell>
        
        {/* Utilization - Expanded */}
        <TableCell className="text-center border-r border-gray-200 px-3 py-3">
          <EnhancedTooltip
            type="utilization"
            member={member}
            utilizationPercentage={utilizationPercentage}
            totalUsedHours={totalUsedHours}
            weeklyCapacity={weeklyCapacity}
            annualLeave={annualLeave}
            holidayHours={holidayHours}
            leaveDays={leaveDays}
          >
            <span className={`inline-flex items-center justify-center w-16 h-10 rounded-xl font-bold text-sm shadow-lg ${getUtilizationStyle()}`}>
              {utilizationPercentage}%
            </span>
          </EnhancedTooltip>
        </TableCell>
        
        {/* Leave cells - Expanded */}
        <TableCell className="text-center border-r border-gray-200 px-3 py-3">
          <ReadOnlyLeaveCell 
            value={annualLeave} 
            leaveDays={leaveDays}
            leaveType="Annual Leave"
          />
        </TableCell>
        
        <TableCell className="text-center border-r border-gray-200 px-3 py-3">
          <ReadOnlyLeaveCell 
            value={holidayHours} 
            leaveDays={[]}
            leaveType="Holiday"
          />
        </TableCell>
        
        <TableCell className="text-center border-r border-gray-200 px-3 py-3">
          <span className="inline-flex items-center justify-center w-8 h-7 bg-gray-100 text-gray-600 rounded-md text-sm">
            -
          </span>
        </TableCell>
        
        <TableCell className="text-center border-r border-gray-200 px-3 py-3">
          <span className="inline-flex items-center justify-center px-3 h-7 bg-gray-100 text-gray-600 rounded-md text-sm">
            -
          </span>
        </TableCell>
        
        {/* Project allocation cells - Expanded */}
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

  // Redesigned Compact View with better aesthetics
  return (
    <TableRow className={`${memberIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50/70 transition-all duration-200 h-12 border-b border-gray-100`}>
      {/* Name Cell - Compact */}
      <TableCell className="border-r border-gray-200 px-3 py-2 name-column">
        <NameCell member={member} />
      </TableCell>
      
      {/* Project Count - Compact */}
      <TableCell className="text-center border-r border-gray-200 px-2 py-2 count-column">
        <span className="inline-flex items-center justify-center w-7 h-7 bg-slate-500 text-white rounded-full font-bold text-xs shadow-sm">
          {projectCount}
        </span>
      </TableCell>
      
      {/* Total Hours - Compact */}
      <TableCell className="text-center border-r border-gray-200 px-2 py-2 total-column">
        <span className="inline-flex items-center justify-center w-8 h-7 bg-blue-500 text-white rounded-md font-bold text-xs shadow-sm">
          {totalUsedHours}h
        </span>
      </TableCell>
      
      {/* Utilization - Compact with enhanced pill */}
      <TableCell className="text-center border-r border-gray-200 px-3 py-2 utilization-column">
        <span className={`utilization-pill inline-flex items-center justify-center rounded-full font-bold text-sm shadow-md transition-all duration-200 hover:scale-105 ${getUtilizationStyle()}`}>
          {utilizationPercentage}%
        </span>
      </TableCell>
      
      {/* Leave Cells - Compact */}
      <TableCell className="text-center border-r border-gray-200 px-2 py-2 leave-column">
        <ReadOnlyLeaveCell 
          value={annualLeave} 
          leaveDays={leaveDays}
          leaveType="Annual Leave"
        />
      </TableCell>
      
      <TableCell className="text-center border-r border-gray-200 px-2 py-2 leave-column">
        <ReadOnlyLeaveCell 
          value={holidayHours} 
          leaveDays={[]}
          leaveType="Holiday"
        />
      </TableCell>
      
      <TableCell className="text-center border-r border-gray-200 px-2 py-2 other-leave-column">
        <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-600 rounded text-xs">
          -
        </span>
      </TableCell>
      
      <TableCell className="text-center border-r border-gray-200 px-2 py-2 remarks-column">
        <span className="inline-flex items-center justify-center px-2 h-6 bg-gray-200 text-gray-600 rounded text-xs">
          -
        </span>
      </TableCell>
      
      {/* Project Cells - Compact with improved styling */}
      {projects.map((project) => {
        const allocationKey = `${member.id}:${project.id}`;
        const hours = allocationMap.get(allocationKey) || 0;
        return (
          <TableCell key={project.id} className="text-center border-r border-gray-200 px-1 py-2 project-column">
            {hours > 0 && (
              <span className="inline-flex items-center justify-center w-7 h-6 bg-emerald-500 text-white rounded-md font-bold text-xs shadow-sm hover:bg-emerald-600 transition-colors duration-200">
                {hours}
              </span>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
