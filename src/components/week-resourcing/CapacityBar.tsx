
import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface CapacityBarProps {
  availableHours: number;
  totalCapacity: number;
}

export const CapacityBar: React.FC<CapacityBarProps> = ({
  availableHours,
  totalCapacity
}) => {
  // Calculate the percentage of capacity that is USED (not available)
  const utilizationPercentage = Math.min(100, Math.max(0, (totalCapacity - availableHours) / totalCapacity * 100));

  // Calculate color based on available hours - GREEN for 0 available (100% utilized)
  const getUtilizationColor = () => {
    if (availableHours <= 0) {
      return '#22c55e'; // Green for 0 available hours (100% utilization - optimal)
    } else if (availableHours <= 5) {
      return '#facc15'; // Yellow for 1-5 available hours (good utilization)
    } else if (availableHours <= 10) {
      return '#f97316'; // Orange for 6-10 available hours (moderate utilization)
    } else {
      return '#ef4444'; // Red for 11+ available hours (low utilization)
    }
  };

  // Get text color for the available hours number - GREEN for 0 available
  const getTextColor = () => {
    if (availableHours <= 0) {
      return 'text-green-600 font-semibold';
    } else if (availableHours <= 5) {
      return 'text-yellow-600 font-semibold';
    } else if (availableHours <= 10) {
      return 'text-orange-600 font-semibold';
    } else {
      return 'text-red-600 font-semibold';
    }
  };

  const utilizationColor = getUtilizationColor();
  const textColor = getTextColor();

  return (
    <TooltipProvider>
      <div className="flex items-center justify-center w-full">
        <div className="flex-1 flex justify-center items-center gap-1.5">
          {/* Capacity boxes - 5 squares representing utilization */}
          <div className="flex gap-[0.5px]">
            {Array.from({ length: 5 }).map((_, index) => {
              // Each box represents 20% (index 0 = 0-20%, index 1 = 20-40%, etc.)
              const boxStartPercent = index * 20;
              const boxEndPercent = (index + 1) * 20;

              // Determine if this specific box should be filled
              const isFilled = utilizationPercentage >= boxEndPercent;
              const isPartiallyFilled = !isFilled && utilizationPercentage > boxStartPercent;
              
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div 
                      className="h-2.5 w-2.5 relative overflow-hidden border border-gray-300"
                      style={{
                        backgroundColor: isFilled 
                          ? utilizationColor
                          : '#f3f4f6'
                      }}
                    >
                      {/* For partially filled boxes - show gradient or partial fill */}
                      {isPartiallyFilled && (
                        <div 
                          className="absolute top-0 bottom-0 left-0"
                          style={{
                            width: `${(utilizationPercentage - boxStartPercent) / 20 * 100}%`,
                            backgroundColor: utilizationColor
                          }} 
                        />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {isFilled 
                        ? `${boxStartPercent}-${boxEndPercent}% (Filled)` 
                        : isPartiallyFilled 
                          ? `${boxStartPercent}-${boxEndPercent}% (${Math.round((utilizationPercentage - boxStartPercent) / 20 * 100)}% filled)`
                          : `${boxStartPercent}-${boxEndPercent}% (Empty)`
                      }
                    </p>
                    <p className="text-xs font-medium">
                      Total Utilization: {utilizationPercentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {availableHours <= 0 ? 'Optimal utilization!' : `${availableHours}h under-utilized`}
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
          
          {/* Available hours number with color coding */}
          <span className={cn("text-xs font-medium", textColor)}>
            {availableHours}
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
};
