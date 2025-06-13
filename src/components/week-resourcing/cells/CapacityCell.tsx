
import React from 'react';
import { TableCell } from '@/components/ui/table';
import { CapacityBar } from '../CapacityBar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
  // Use the weekly total allocated hours that's passed in (this should be the sum for the entire week)
  const weeklyProjectHours = totalAllocatedHours;
  
  // Calculate weekly annual leave sum
  const weeklyAnnualLeave = annualLeaveDates.reduce((sum, leave) => sum + leave.hours, 0);
  
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

  console.log(`CapacityCell for member ${member?.first_name} ${member?.last_name}:`, {
    weeklyProjectHours,
    weeklyAnnualLeave,
    holidayHours,
    otherLeave,
    totalUsedHours,
    availableHours,
    totalCapacity,
    utilizationPercentage
  });

  const capacityTooltip = (
    <div className="space-y-3 text-xs max-w-sm">
      <div>
        <p className="font-semibold text-sm mb-2">Weekly Capacity Breakdown:</p>
        <div className="space-y-1">
          <p>Total Weekly Capacity: {totalCapacity}h</p>
          <p>Project Hours (Weekly Total): {weeklyProjectHours}h</p>
          <p>Annual Leave (Weekly Total): {weeklyAnnualLeave}h</p>
          <p>Holiday: {holidayHours}h</p>
          <p>Other Leave: {otherLeave}h</p>
          <p className="border-t pt-1 font-medium">Available: {availableHours}h</p>
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
                  {project.project_code ? `${project.project_code}: ` : ''}{project.name}
                </span>
                <span className="font-medium">{project.hours}h</span>
              </div>
            ))}
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
    <TableCell className="border-r p-1 sm:p-2 mobile-capacity-cell bg-gradient-to-br from-emerald-50 to-green-50">
      <div className="hidden sm:block">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <CapacityBar 
                availableHours={availableHours} 
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
