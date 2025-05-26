
import React from 'react';

interface GaugeProps {
  value: number;
  max: number;
  title: string;
  size?: 'sm' | 'lg';
}

export const Gauge: React.FC<GaugeProps> = ({ value, max, title, size = 'sm' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
  
  const getColor = (value: number) => {
    if (value < 60) return '#3B82F6'; // blue
    if (value < 80) return '#10B981'; // green
    if (value < 90) return '#F59E0B'; // yellow
    return '#EF4444'; // red
  };

  const dimensions = size === 'lg' ? { size: 120, strokeWidth: 8, fontSize: 'text-xl' } : { size: 80, strokeWidth: 6, fontSize: 'text-sm' };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: dimensions.size, height: dimensions.size }}>
        <svg
          width={dimensions.size}
          height={dimensions.size}
          viewBox={`0 0 ${dimensions.size} ${dimensions.size}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r="45"
            stroke="#E5E7EB"
            strokeWidth={dimensions.strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r="45"
            stroke={getColor(value)}
            strokeWidth={dimensions.strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-300 ease-in-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${dimensions.fontSize}`} style={{ color: getColor(value) }}>
            {value}%
          </span>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-600 text-center">{title}</p>
    </div>
  );
};
