
import React from 'react';

interface GaugeProps {
  value: number;
  max: number;
  title: string;
  size?: 'sm' | 'lg';
  showPercentage?: boolean;
  thresholds?: {
    good: number;
    warning: number;
    critical: number;
  };
}

export const Gauge: React.FC<GaugeProps> = ({ 
  value, 
  max, 
  title, 
  size = 'sm',
  showPercentage = true,
  thresholds = { good: 60, warning: 80, critical: 90 }
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
  
  const getColor = (value: number) => {
    if (value < thresholds.good) return '#3B82F6'; // blue - under-utilized
    if (value < thresholds.warning) return '#10B981'; // green - optimal
    if (value < thresholds.critical) return '#F59E0B'; // yellow - high
    return '#EF4444'; // red - over-utilized
  };

  const getLabel = (value: number) => {
    if (value < thresholds.good) return 'Available';
    if (value < thresholds.warning) return 'Optimal';
    if (value < thresholds.critical) return 'High';
    return 'Critical';
  };

  const dimensions = size === 'lg' 
    ? { size: 120, strokeWidth: 8, fontSize: 'text-xl', radius: 45, centerFontSize: 'text-lg' }
    : { size: 80, strokeWidth: 6, fontSize: 'text-sm', radius: 32, centerFontSize: 'text-sm' };

  const color = getColor(value);
  const label = getLabel(value);

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative flex items-center justify-center" style={{ width: dimensions.size, height: dimensions.size }}>
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
            r={dimensions.radius}
            stroke="#E5E7EB"
            strokeWidth={dimensions.strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={dimensions.radius}
            stroke={color}
            strokeWidth={dimensions.strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${dimensions.centerFontSize}`} style={{ color }}>
            {showPercentage ? `${Math.round(value)}%` : value}
          </span>
          {size === 'lg' && (
            <span className="text-xs text-gray-500 mt-1 font-medium">
              {label}
            </span>
          )}
        </div>
      </div>
      <div className="mt-2 text-center">
        <p className={`font-medium text-gray-700 ${dimensions.fontSize} leading-tight`}>
          {title}
        </p>
        {size === 'sm' && (
          <p className="text-xs text-gray-500 mt-1 font-medium">
            {label}
          </p>
        )}
      </div>
    </div>
  );
};
