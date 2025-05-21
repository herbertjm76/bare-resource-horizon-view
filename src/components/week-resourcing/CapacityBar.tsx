
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface CapacityBarProps {
  availableHours: number;
  totalCapacity: number;
}

export const CapacityBar: React.FC<CapacityBarProps> = ({
  availableHours,
  totalCapacity
}) => {
  // Calculate the percentage of capacity used/available
  const percentageRemaining = Math.round((availableHours / totalCapacity) * 100);
  const percentageUsed = 100 - percentageRemaining;
  
  // Determine color based on available hours
  const getBarColor = () => {
    const remainingPercentage = (availableHours / totalCapacity) * 100;
    
    if (remainingPercentage <= 0) {
      return 'bg-green-500'; // Green for 0% remaining (fully allocated)
    } else if (remainingPercentage < 20) {
      return 'bg-orange-300'; // Soft orange for 1-19% remaining
    } else if (remainingPercentage < 30) {
      return 'bg-orange-500'; // Bright orange for 20-29% remaining
    } else {
      return 'bg-red-500'; // Red for 30-40% remaining
    }
  };

  const barColor = getBarColor();

  return (
    <div className="flex items-center space-x-2 w-full py-1">
      <div className="flex-1 max-w-24">
        <Progress 
          value={percentageUsed} 
          className="h-2 w-full" 
          indicatorClassName={cn(barColor)}
        />
      </div>
      <span className="text-xs font-semibold w-6 text-right">{availableHours}</span>
    </div>
  );
};
