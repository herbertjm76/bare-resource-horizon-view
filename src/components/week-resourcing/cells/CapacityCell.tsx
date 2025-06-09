
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
}

export const CapacityCell: React.FC<CapacityCellProps> = ({ 
  availableHours, 
  totalCapacity,
  member,
  totalAllocatedHours = 0,
  annualLeave = 0,
  holidayHours = 0,
  otherLeave = 0
}) => {
  // Calculate utilization percentage
  const usedHours = totalCapacity - availableHours;
  const utilizationPercentage = totalCapacity > 0 ? Math.round((usedHours / totalCapacity) * 100) : 0;
  
  // Get color based on utilization
  const getUtilizationColor = (percentage: number) => {
    if (percentage > 100) return 'text-red-600'; // Over 100% - overworked
    if (percentage >= 95) return 'text-green-600'; // 95-100% - fully resourced (green)
    if (percentage >= 80) return 'text-orange-600'; // 80-94% - well utilized
    if (percentage >= 50) return 'text-blue-600'; // 50-79% - moderate utilization
    return 'text-gray-600'; // Under 50% - low utilization
  };

  const capacityTooltip = (
    <div className="space-y-1 text-xs">
      <p className="font-semibold">Capacity Breakdown:</p>
      <p>Total Capacity: {totalCapacity}h</p>
      <p>Project Hours: {totalAllocatedHours}h</p>
      <p>Annual Leave: {annualLeave}h</p>
      <p>Holiday: {holidayHours}h</p>
      <p>Other Leave: {otherLeave}h</p>
      <p className="border-t pt-1 font-medium">Available: {availableHours}h</p>
      <p>Utilization: {utilizationPercentage}%</p>
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
