
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
  
  // Color-coding based on utilization percentage
  const getColor = () => {
    const utilization = ((totalCapacity - availableHours) / totalCapacity) * 100;
    if (availableHours < 0) {
      return '#ef4444'; // Red - over-allocated
    } else if (utilization >= 80) {
      return '#22c55e'; // Green - optimal (80-100%)
    } else if (utilization >= 50) {
      return '#eab308'; // Yellow - moderate (50-79%)
    } else if (utilization > 0) {
      return '#f97316'; // Orange - underutilized (<50%)
    } else {
      return '#f3f4f6'; // Gray - no allocation
    }
  };

  // SVG parameters - further reduced size
  const size = 32;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentageUsed / 100) * circumference;
  const color = getColor();

  return (
    <div className="relative inline-block">
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
        <span className="text-[10px] font-medium">{availableHours}</span>
      </div>
    </div>
  );
};
