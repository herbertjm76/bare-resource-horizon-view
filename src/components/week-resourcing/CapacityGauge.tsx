
import React from 'react';

interface CapacityGaugeProps {
  availableHours: number;
  totalCapacity: number;
}

export const CapacityGauge: React.FC<CapacityGaugeProps> = ({
  availableHours,
  totalCapacity
}) => {
  // Calculate the percentage of capacity used
  const percentageRemaining = Math.round((availableHours / totalCapacity) * 100);
  const percentageUsed = 100 - percentageRemaining;
  
  // Determine color based on available hours
  const getColor = () => {
    const remainingPercentage = (availableHours / totalCapacity) * 100;
    
    if (remainingPercentage <= 0) {
      return '#F2FCE2'; // Green for 0% remaining
    } else if (remainingPercentage < 20) {
      return '#FEC6A1'; // Soft orange for 1-19% remaining
    } else if (remainingPercentage < 30) {
      return '#F97316'; // Bright orange for 20-29% remaining
    } else {
      return '#ea384c'; // Red for 30-40% remaining
    }
  };

  // SVG parameters - reduced size and stroke width
  const size = 45;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentageUsed / 100) * circumference;
  const color = getColor();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="#f3f4f6"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={color}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium">{availableHours}</span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground -mt-0.5">/{totalCapacity}</div>
    </div>
  );
};
