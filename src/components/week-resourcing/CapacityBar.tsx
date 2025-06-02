
import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CapacityBarProps {
  availableHours: number;
  totalCapacity: number;
}

export const CapacityBar: React.FC<CapacityBarProps> = ({
  availableHours,
  totalCapacity
}) => {
  // Calculate the percentage of capacity that is USED (not available)
  const usedHours = totalCapacity - availableHours;
  const percentageUsed = Math.min(100, Math.max(0, (usedHours / totalCapacity) * 100));

  // Calculate color based on utilization percentage
  const getUtilizationColor = () => {
    if (percentageUsed >= 100) {
      return {
        color: 'bg-red-500',
        level: 'Overallocated',
        description: `${usedHours}h / ${totalCapacity}h (${Math.round(percentageUsed)}%)`
      };
    } else if (percentageUsed >= 90) {
      return {
        color: 'bg-orange-500',
        level: 'Near Full',
        description: `${usedHours}h / ${totalCapacity}h (${Math.round(percentageUsed)}%)`
      };
    } else if (percentageUsed >= 70) {
      return {
        color: 'bg-yellow-500',
        level: 'Good Utilization',
        description: `${usedHours}h / ${totalCapacity}h (${Math.round(percentageUsed)}%)`
      };
    } else if (percentageUsed >= 40) {
      return {
        color: 'bg-green-500',
        level: 'Moderate Load',
        description: `${usedHours}h / ${totalCapacity}h (${Math.round(percentageUsed)}%)`
      };
    } else {
      return {
        color: 'bg-blue-500',
        level: 'Low Utilization',
        description: `${usedHours}h / ${totalCapacity}h (${Math.round(percentageUsed)}%)`
      };
    }
  };

  const utilization = getUtilizationColor();

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex-1 flex justify-center items-center gap-1.5">
        {/* Capacity boxes - 5 boxes representing 20% each */}
        <div className="flex gap-[0.5px]">
          {Array.from({ length: 5 }).map((_, index) => {
            // Each box represents 20% (index 0 = 0-20%, index 1 = 20-40%, etc.)
            const boxStartPercent = index * 20;
            const boxEndPercent = (index + 1) * 20;

            // Determine if this specific box should be filled
            const isFilled = percentageUsed >= boxEndPercent;
            const isPartiallyFilled = !isFilled && percentageUsed > boxStartPercent;
            
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div className={cn(
                    "h-2.5 w-2.5 relative overflow-hidden border border-gray-300",
                    !isFilled && !isPartiallyFilled && "bg-gray-100"
                  )}>
                    {/* For completely filled boxes */}
                    {isFilled && (
                      <div className={cn("absolute inset-0", utilization.color)} />
                    )}
                    
                    {/* For partially filled boxes */}
                    {isPartiallyFilled && (
                      <div 
                        className={cn("absolute top-0 bottom-0 left-0", utilization.color)} 
                        style={{
                          width: `${(percentageUsed - boxStartPercent) / 20 * 100}%`
                        }} 
                      />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <p className="font-medium">{utilization.level}</p>
                    <p>{utilization.description}</p>
                    <p className="text-gray-500">Available: {availableHours}h</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
        
        {/* Available hours number with color-coded background */}
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={cn(
              "text-xs font-medium px-1.5 py-0.5 rounded text-white",
              utilization.color
            )}>
              {availableHours}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              <p className="font-medium">{utilization.level}</p>
              <p>{utilization.description}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
