
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
  // Calculate how many boxes should be filled (out of 5)
  const percentageRemaining = (availableHours / totalCapacity) * 100;
  const boxesFilled = Math.ceil((percentageRemaining / 100) * 5);
  
  // Determine color based on boxes filled
  const getBoxColor = () => {
    if (boxesFilled <= 2) {
      return 'bg-red-500'; // Red for 1-2 boxes (low availability)
    } else if (boxesFilled <= 4) {
      return 'bg-yellow-400'; // Yellow for 3-4 boxes (medium availability)
    } else {
      return 'bg-green-500'; // Green for 5 boxes (high availability)
    }
  };

  const boxColor = getBoxColor();
  
  return (
    <div className="flex items-center space-x-2 w-full py-1">
      <div className="flex-1 flex space-x-0.5 max-w-24">
        {/* Render 5 boxes */}
        {Array.from({ length: 5 }).map((_, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div 
                className={cn(
                  "h-3 flex-1 border border-gray-300 rounded-sm",
                  index < boxesFilled ? boxColor : "bg-gray-100"
                )}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{index < boxesFilled ? 'Available' : 'Used'}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <span className="text-xs font-semibold w-6 text-right">{availableHours}</span>
    </div>
  );
};
