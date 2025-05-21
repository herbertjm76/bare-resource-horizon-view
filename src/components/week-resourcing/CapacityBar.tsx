
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
  const percentageUsed = Math.min(100, Math.max(0, ((totalCapacity - availableHours) / totalCapacity) * 100));
  
  // Calculate color based on utilization percentage
  const getBoxColor = () => {
    if (percentageUsed >= 80) {
      return 'bg-green-500'; // Green for high utilization (80-100%)
    } else if (percentageUsed >= 40) {
      return 'bg-yellow-400'; // Yellow for medium utilization (40-80%)
    } else {
      return 'bg-red-500'; // Red for low utilization (0-40%)
    }
  };

  const boxColor = getBoxColor();
  
  return (
    <div className="flex items-center space-x-2 w-full py-1">
      <div className="flex-1 flex space-x-0.5 max-w-24">
        {/* Render 5 boxes, each representing 20% of capacity */}
        {Array.from({ length: 5 }).map((_, index) => {
          // Calculate if this box should be filled based on percentage
          // Each box represents 20% (index 0 = 0-20%, index 1 = 20-40%, etc.)
          const boxStartPercent = index * 20;
          const boxEndPercent = (index + 1) * 20;
          
          // A box should be filled only if the percentage used is greater than the box's starting percentage
          const boxShouldBeFilled = percentageUsed >= boxStartPercent;
          
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "h-3 flex-1 border border-gray-300 rounded-sm",
                    boxShouldBeFilled ? boxColor : "bg-gray-100"
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {boxShouldBeFilled ? 
                    `Used (${Math.min(20, Math.max(0, percentageUsed - boxStartPercent)).toFixed(0)}%)` : 
                    'Available'}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      <span className="text-xs font-semibold w-6 text-right">{availableHours}</span>
    </div>
  );
};
