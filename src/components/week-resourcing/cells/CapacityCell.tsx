
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { CapacityBar } from '../CapacityBar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName } from '@/utils/projectDisplay';
import { formatAllocationValue, formatAvailableValue, formatCapacityValue } from '@/utils/allocationDisplay';
import { logger } from '@/utils/logger';

interface CapacityCellProps {
  availableHours: number;
  totalCapacity: number;
  member?: any;
  totalAllocatedHours?: number;
  annualLeave?: number;
  holidayHours?: number;
  otherLeave?: number;
  projects?: Array<{ name: string; hours: number; project_code?: string }>;
  annualLeaveDates?: Array<{ date: string; hours: number }>;
}

export const CapacityCell: React.FC<CapacityCellProps> = ({ 
  availableHours, 
  totalCapacity,
  member,
  totalAllocatedHours = 0,
  annualLeave = 0,
  holidayHours = 0,
  otherLeave = 0,
  projects = [],
  annualLeaveDates = []
}) => {
  const { projectDisplayPreference, displayPreference } = useAppSettings();
  // Use the weekly total allocated hours that's passed in (this should be the sum for the entire week)
  const weeklyProjectHours = totalAllocatedHours;
  
  // Use the annual leave value that's already calculated for the week (don't recalculate)
  const weeklyAnnualLeave = annualLeave;
  
  // Calculate total used hours for the week
  const totalUsedHours = weeklyProjectHours + weeklyAnnualLeave + holidayHours + otherLeave;
  
  // Calculate utilization percentage based on weekly capacity
  const utilizationPercentage = totalCapacity > 0 ? Math.round((totalUsedHours / totalCapacity) * 100) : 0;
  
  // Get color based on utilization
  const getUtilizationColor = (percentage: number) => {
    if (percentage > 100) return 'text-red-600'; // Over 100% - overworked
    if (percentage >= 95) return 'text-green-600'; // 95-100% - fully resourced (green)
    if (percentage >= 80) return 'text-orange-600'; // 80-94% - well utilized
    if (percentage >= 50) return 'text-blue-600'; // 50-79% - moderate utilization
    return 'text-gray-600'; // Under 50% - low utilization
  };

  logger.debug(`CapacityCell for member ${member?.first_name} ${member?.last_name}:`, {
    weeklyProjectHours,
    weeklyAnnualLeave,
    holidayHours,
    otherLeave,
    totalUsedHours,
    availableHours,
    totalCapacity,
    utilizationPercentage,
    projectsCount: projects.length,
    projectsTotalFromTooltip: projects.reduce((sum, p) => sum + p.hours, 0)
  });

  const capacityTooltip = (
    <div className="space-y-3 text-xs max-w-sm">
      <div>
        <p className="font-semibold text-sm mb-2">Weekly Capacity Breakdown:</p>
        <div className="space-y-1">
          <p>Total Weekly Capacity: {formatCapacityValue(totalCapacity, displayPreference)}</p>
          <p>Project Hours (Weekly Total): {formatAllocationValue(weeklyProjectHours, totalCapacity, displayPreference)}</p>
          <p>Annual Leave (Weekly Total): {formatAllocationValue(weeklyAnnualLeave, totalCapacity, displayPreference)}</p>
          <p>Holiday: {formatAllocationValue(holidayHours, totalCapacity, displayPreference)}</p>
          <p>Other Leave: {formatAllocationValue(otherLeave, totalCapacity, displayPreference)}</p>
          <p className="border-t pt-1 font-medium">Available: {formatAvailableValue(availableHours, totalCapacity, displayPreference)}</p>
          <p>Weekly Utilization: {utilizationPercentage}%</p>
        </div>
      </div>
      
      {projects.length > 0 && (
        <div>
          <p className="font-semibold text-sm mb-1">Weekly Project Assignments:</p>
          <div className="space-y-1">
            {projects.map((project, idx) => (
              <div key={idx} className="flex justify-between gap-2">
                <span className="truncate">
                  {getProjectDisplayName({ code: project.project_code, name: project.name }, projectDisplayPreference)}
                </span>
                <span className="font-medium">{formatAllocationValue(project.hours, totalCapacity, displayPreference)}</span>
              </div>
            ))}
            <div className="border-t pt-1 font-semibold flex justify-between">
              <span>Total Projects:</span>
              <span>{formatAllocationValue(projects.reduce((sum, p) => sum + p.hours, 0), totalCapacity, displayPreference)}</span>
            </div>
          </div>
        </div>
      )}
      
      {annualLeaveDates.length > 0 && (
        <div>
          <p className="font-semibold text-sm mb-1">Annual Leave This Week:</p>
          <div className="space-y-1">
            {annualLeaveDates.map((leave, idx) => (
              <div key={idx} className="flex justify-between gap-2">
                <span>{new Date(leave.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
                <span className="font-medium">{leave.hours}h</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <TableCell className="border-r p-1 sm:p-2 mobile-capacity-cell bg-muted/30">
      <div className="hidden sm:block">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <CapacityBar 
                totalUsedHours={totalUsedHours} 
                totalCapacity={totalCapacity} 
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {capacityTooltip}
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="sm:hidden text-xs text-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <span 
              className={`font-bold ${utilizationPercentage === 0 ? 'text-gray-400' : getUtilizationColor(utilizationPercentage)}`}
            >
              {utilizationPercentage}%
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {capacityTooltip}
          </TooltipContent>
        </Tooltip>
      </div>
    </TableCell>
  );
};
