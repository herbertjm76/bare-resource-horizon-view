
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
  const utilizationPercentage = totalCapacity > 0 ? (totalUsedHours / totalCapacity) * 100 : 0;
  const utilizationRate = Math.round(utilizationPercentage);
  
  // Calculate available hours - can be negative if over capacity
  const availableHours = totalCapacity - totalUsedHours;

  // Get color based on utilization (for bars <= 100%)
  const getUtilizationColor = () => {
    if (utilizationRate >= 95) return '#22c55e'; // green - fully utilized
    if (utilizationRate >= 80) return '#f97316'; // orange - well utilized
    if (utilizationRate >= 50) return '#3b82f6'; // blue - moderate utilization
    return '#6b7280'; // gray - low utilization
  };
  
  // For overflow bars (>100%), use green for base and red for overflow
  const getBaseColorForOverflow = () => '#22c55e'; // green base for full capacity

  // Get text color for the percentage based on utilization
  const getPercentageTextColor = () => {
    if (utilizationRate > 100) return 'text-red-600 font-bold'; // Bold red for over 100%
    if (utilizationRate >= 95) return 'text-green-600 font-semibold';
    if (utilizationRate >= 80) return 'text-orange-600 font-semibold';
    if (utilizationRate >= 50) return 'text-blue-600 font-semibold';
    if (utilizationRate === 0) return 'text-muted-foreground'; // faint for 0%
    return 'text-muted-foreground font-semibold';
  };

  const utilizationColor = getUtilizationColor();
  const percentageTextColor = getPercentageTextColor();

  console.log(`CapacityBar calculation for ${totalCapacity}h weekly capacity:`, {
    totalCapacity,
    totalUsedHours,
    availableHours,
    utilizationPercentage,
    utilizationRate
  });

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex-1 flex justify-center items-center gap-1">
        {/* Horizontal progress bar */}
        <div className="relative">
          <div 
            className="w-12 h-3 rounded border border-border overflow-hidden bg-muted relative"
          >
            {utilizationPercentage <= 100 ? (
              /* Single bar for <= 100% */
              <div 
                className="h-full transition-all duration-300 rounded"
                style={{
                  width: `${utilizationPercentage}%`,
                  backgroundColor: utilizationColor
                }} 
              />
            ) : (
              /* Dual-tone bar for > 100%: base (0-100%) + overflow (100%+) in red */
              <>
                {/* Base capacity bar (0-100%) in green */}
                <div 
                  className="h-full transition-all duration-300 absolute left-0"
                  style={{
                    width: '100%',
                    backgroundColor: getBaseColorForOverflow()
                  }} 
                />
                {/* Overflow portion in red */}
                <div 
                  className="h-full transition-all duration-300 absolute right-0"
                  style={{
                    width: `${((utilizationPercentage - 100) / utilizationPercentage) * 100}%`,
                    backgroundColor: '#ef4444'
                  }} 
                />
              </>
            )}
          </div>
        </div>
        
        {/* Percentage text with color coding - smaller size to fit better */}
        <span className={cn("text-[9px] font-medium min-w-[20px] text-center", percentageTextColor)}>
          {utilizationRate}%
        </span>
      </div>
    </div>
  );
};
