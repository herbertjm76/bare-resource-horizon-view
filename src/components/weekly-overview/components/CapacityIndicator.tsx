
import React from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAvailableValue, formatCapacityValue } from '@/utils/allocationDisplay';

interface CapacityIndicatorProps {
  availableHours: number;
  totalCapacity: number;
}

export const CapacityIndicator: React.FC<CapacityIndicatorProps> = ({
  availableHours,
  totalCapacity
}) => {
  const { displayPreference } = useAppSettings();
  // Calculate the percentage of capacity that is USED (not available)
  const utilizationPercentage = Math.min(100, Math.max(0, (totalCapacity - availableHours) / totalCapacity * 100));

  // Get color values for utilization
  const getUtilizationColors = () => {
    if (utilizationPercentage >= 90) {
      return { bg: '#ef4444', text: 'text-red-600 font-semibold' }; // Red
    } else if (utilizationPercentage >= 80) {
      return { bg: '#f97316', text: 'text-orange-600 font-semibold' }; // Orange
    } else if (utilizationPercentage >= 60) {
      return { bg: '#facc15', text: 'text-yellow-600 font-semibold' }; // Yellow
    } else if (utilizationPercentage >= 40) {
      return { bg: '#22c55e', text: 'text-green-600 font-semibold' }; // Green
    } else {
      return { bg: '#3b82f6', text: 'text-blue-600 font-semibold' }; // Blue
    }
  };

  const colors = getUtilizationColors();

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
              
              let boxBackgroundColor = '#f3f4f6'; // Default gray
              
              if (isFilled) {
                boxBackgroundColor = colors.bg;
              } else if (isPartiallyFilled) {
                // For partially filled, we'll use a gradient effect
                boxBackgroundColor = '#f3f4f6';
              }
              
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div 
                      className="h-3 w-3 relative overflow-hidden"
                      style={{
                        backgroundColor: boxBackgroundColor,
                        border: '1px solid #9ca3af'
                      }}
                    >
                      {/* For partially filled boxes - show gradient or partial fill */}
                      {isPartiallyFilled && (
                        <div 
                          className="absolute top-0 bottom-0 left-0"
                          style={{
                            width: `${Math.round((utilizationPercentage - boxStartPercent) / 20 * 100)}%`,
                            backgroundColor: colors.bg
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
                      Available: {formatAvailableValue(availableHours, totalCapacity, displayPreference)} / {formatCapacityValue(totalCapacity, displayPreference)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
          
          {/* Available hours number with color coding */}
          <span className={cn("text-xs font-medium ml-1", colors.text)}>
            {availableHours}
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
};
