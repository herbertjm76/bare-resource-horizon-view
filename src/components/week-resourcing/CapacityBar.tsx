
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
  
  console.log(`CapacityBar: availableHours=${availableHours}, totalCapacity=${totalCapacity}, percentageUsed=${percentageUsed}%`);
  
  return (
    <div className="flex items-center space-x-2 w-full py-1">
      <div className="flex-1 flex space-x-0.5 max-w-24">
        {/* Render 5 boxes, each representing 20% of capacity */}
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
                <div 
                  className={cn(
                    "h-3 flex-1 border border-gray-300 rounded-sm relative overflow-hidden",
                    !isFilled && !isPartiallyFilled && "bg-gray-100"
                  )}
                >
                  {/* For completely filled boxes */}
                  {isFilled && (
                    <div className={cn("absolute inset-0", boxColor)} />
                  )}
                  
                  {/* For partially filled boxes */}
                  {isPartiallyFilled && (
                    <div 
                      className={cn("absolute top-0 bottom-0 left-0", boxColor)}
                      style={{ width: `${((percentageUsed - boxStartPercent) / 20) * 100}%` }}
                    />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {isFilled ? 
                    'Used (100%)' : 
                    isPartiallyFilled ? 
                      `Used (${Math.min(100, Math.max(0, ((percentageUsed - boxStartPercent) / 20) * 100)).toFixed(0)}%)` : 
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
