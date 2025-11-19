import React from 'react';

interface AllocationRingProps {
  hours: number;
  size?: number;
  strokeWidth?: number;
  maxHours?: number;
}

export const AllocationRing: React.FC<AllocationRingProps> = ({ 
  hours, 
  size = 32, 
  strokeWidth = 3,
  maxHours = 40 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((hours / maxHours) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  // Color based on utilization
  const getColor = () => {
    if (percentage >= 100) return '#ef4444'; // red for over-allocated
    if (percentage >= 80) return '#f59e0b'; // amber for high
    if (percentage >= 50) return '#10b981'; // emerald for good
    return '#3b82f6'; // blue for low
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Hours text in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-slate-700">
          {hours}
        </span>
      </div>
    </div>
  );
};
