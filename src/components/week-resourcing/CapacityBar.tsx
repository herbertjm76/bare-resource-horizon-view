
import React from 'react';
import { cn } from '@/lib/utils';

interface CapacityBarProps {
  totalUsedHours: number;
  totalCapacity: number;
}

export const CapacityBar: React.FC<CapacityBarProps> = ({
  totalUsedHours,
  totalCapacity
}) => {
  // Calculate utilization percentage based on actual used hours vs total capacity
  const utilizationPercentage = totalCapacity > 0 ? Math.min(120, Math.max(0, (totalUsedHours / totalCapacity) * 100)) : 0;
  const utilizationRate = Math.round(utilizationPercentage);
  
  // Calculate available hours for display
  const availableHours = Math.max(0, totalCapacity - totalUsedHours);

  // Get color based on utilization
  const getUtilizationColor = () => {
    if (utilizationRate > 100) return '#ef4444'; // red - overallocated
    if (utilizationRate >= 95) return '#22c55e'; // green - fully utilized
    if (utilizationRate >= 80) return '#f97316'; // orange - well utilized
    if (utilizationRate >= 50) return '#3b82f6'; // blue - moderate utilization
    return '#6b7280'; // gray - low utilization
  };

  // Get text color for the available hours number
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

  console.log(`CapacityBar calculation for ${totalCapacity}h capacity:`, {
    totalCapacity,
    totalUsedHours,
    availableHours,
    utilizationPercentage,
    utilizationRate
  });

  return (
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
              <div 
                key={index}
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
            );
          })}
        </div>
        
        {/* Available hours number with color coding */}
        <span className={cn("text-xs font-medium", textColor)}>
          {availableHours}
        </span>
      </div>
    </div>
  );
};
