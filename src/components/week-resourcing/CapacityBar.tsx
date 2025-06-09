
import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { UtilizationCalculationService } from '@/services/utilizationCalculationService';

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
  const utilizationRate = Math.round(utilizationPercentage);

  // Get color based on utilization with same logic as mobile display
  const getUtilizationColor = () => {
    if (utilizationRate > 100) return '#ef4444'; // red
    if (utilizationRate >= 95) return '#22c55e'; // green
    if (utilizationRate >= 80) return '#f97316'; // orange
    if (utilizationRate >= 50) return '#3b82f6'; // blue
    return '#6b7280'; // gray
  };

  // Get text color for the available hours number using same logic
  const getTextColor = () => {
    if (utilizationRate === 0) return 'text-gray-400'; // faint for 0%
    if (utilizationRate > 100) return 'text-red-600 font-semibold';
    if (utilizationRate >= 95) return 'text-green-600 font-semibold';
    if (utilizationRate >= 80) return 'text-orange-600 font-semibold';
    if (utilizationRate >= 50) return 'text-blue-600 font-semibold';
    return 'text-gray-600 font-semibold';
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
                    <p className="text-xs">
                      Status: {UtilizationCalculationService.getUtilizationBadgeText(utilizationRate)}
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
