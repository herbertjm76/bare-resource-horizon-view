
import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface CapacityIndicatorProps {
  availableHours: number;
  totalCapacity: number;
}

export const CapacityIndicator: React.FC<CapacityIndicatorProps> = ({
  availableHours,
  totalCapacity
}) => {
  // Calculate the percentage of capacity that is USED (not available)
  const utilizationPercentage = Math.min(100, Math.max(0, (totalCapacity - availableHours) / totalCapacity * 100));

  // Calculate color based on utilization percentage
  const getBoxColor = () => {
    if (utilizationPercentage >= 90) {
      return 'bg-red-500'; // Red for very high utilization (90-100%)
    } else if (utilizationPercentage >= 80) {
      return 'bg-orange-500'; // Orange for high utilization (80-90%)
    } else if (utilizationPercentage >= 60) {
      return 'bg-yellow-400'; // Yellow for medium-high utilization (60-80%)
    } else if (utilizationPercentage >= 40) {
      return 'bg-green-500'; // Green for medium utilization (40-60%)
    } else {
      return 'bg-blue-500'; // Blue for low utilization (0-40%)
    }
  };

  // Get text color for the available hours number based on utilization
  const getTextColor = () => {
    if (utilizationPercentage >= 90) {
      return 'text-red-600 font-semibold';
    } else if (utilizationPercentage >= 80) {
      return 'text-orange-600 font-semibold';
    } else if (utilizationPercentage >= 60) {
      return 'text-yellow-600 font-semibold';
    } else if (utilizationPercentage >= 40) {
      return 'text-green-600 font-semibold';
    } else {
      return 'text-blue-600 font-semibold';
    }
  };

  const boxColor = getBoxColor();
  const textColor = getTextColor();

  return (
    <TooltipProvider>
      <div className="flex items-center justify-center w-full">
        <div className="flex-1 flex justify-center items-center gap-1.5">
          {/* Capacity boxes - 5 squares representing utilization */}
          <div className="flex gap-0.5">
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
                    <div className={cn(
                      "h-3 w-3 border border-gray-400 relative overflow-hidden",
                      // Apply background color based on fill state
                      isFilled ? boxColor : isPartiallyFilled ? "bg-gray-100" : "bg-gray-100"
                    )}>
                      {/* For partially filled boxes - show gradient or partial fill */}
                      {isPartiallyFilled && (
                        <div 
                          className={cn("absolute top-0 bottom-0 left-0", boxColor)} 
                          style={{
                            width: `${Math.round((utilizationPercentage - boxStartPercent) / 20 * 100)}%`
                          }} 
                        />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <p>
                      {boxStartPercent}-{boxEndPercent}%: {
                        isFilled 
                          ? 'Filled' 
                          : isPartiallyFilled 
                            ? `${Math.round((utilizationPercentage - boxStartPercent) / 20 * 100)}% filled`
                            : 'Empty'
                      }
                    </p>
                    <p className="font-medium">
                      Total Utilization: {utilizationPercentage.toFixed(1)}%
                    </p>
                    <p className="text-gray-500">
                      Available: {availableHours}h / {totalCapacity}h
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
          
          {/* Available hours number with color coding */}
          <span className={cn("text-xs font-medium ml-1", textColor)}>
            {availableHours}
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
};
