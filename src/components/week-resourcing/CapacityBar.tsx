
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

  // Calculate color based on utilization percentage
  const getUtilizationColor = () => {
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
                          ? utilizationColor.includes('red') ? '#ef4444'
                          : utilizationColor.includes('orange') ? '#f97316'
                          : utilizationColor.includes('yellow') ? '#facc15'
                          : utilizationColor.includes('green') ? '#22c55e'
                          : '#3b82f6'
                          : '#f3f4f6'
                      }}
                    >
                      {/* For partially filled boxes - show gradient or partial fill */}
                      {isPartiallyFilled && (
                        <div 
                          className="absolute top-0 bottom-0 left-0"
                          style={{
                            width: `${(utilizationPercentage - boxStartPercent) / 20 * 100}%`,
                            backgroundColor: utilizationColor.includes('red') ? '#ef4444'
                              : utilizationColor.includes('orange') ? '#f97316'
                              : utilizationColor.includes('yellow') ? '#facc15'
                              : utilizationColor.includes('green') ? '#22c55e'
                              : '#3b82f6'
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
