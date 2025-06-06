
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
  
  // Determine color based on available hours - GREEN for 0 available (optimal)
  const getColor = () => {
    if (availableHours <= 0) {
      return '#22c55e'; // Green for 0 available hours (100% utilization - optimal)
    } else if (availableHours <= 5) {
      return '#facc15'; // Yellow for 1-5 available hours (good utilization)
    } else if (availableHours <= 10) {
      return '#f97316'; // Orange for 6-10 available hours (moderate utilization)
    } else {
      return '#ef4444'; // Red for 11+ available hours (low utilization)
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
