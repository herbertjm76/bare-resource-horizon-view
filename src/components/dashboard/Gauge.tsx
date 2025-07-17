
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
  const radius = size === 'lg' ? 90 : 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
  
  const getLabel = (value: number) => {
    if (value < thresholds.good) return 'Available';
    if (value < thresholds.warning) return 'Optimal';
    if (value < thresholds.critical) return 'High';
    return 'Critical';
  };

  const dimensions = size === 'lg' 
    ? { size: 200, strokeWidth: 20, fontSize: 'text-2xl', centerFontSize: 'text-xl' }
    : { size: 140, strokeWidth: 16, fontSize: 'text-lg', centerFontSize: 'text-base' };

  const label = getLabel(value);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="relative flex items-center justify-center w-full h-full">
        <svg
          width={dimensions.size}
          height={dimensions.size}
          viewBox={`0 0 ${dimensions.size} ${dimensions.size}`}
          className="transform -rotate-90 w-full h-full"
        >
          {/* Background circle */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth={dimensions.strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius}
            stroke="hsl(var(--primary))"
            strokeWidth={dimensions.strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
            style={{
              filter: 'drop-shadow(0 4px 8px hsl(var(--primary) / 0.3))'
            }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${dimensions.centerFontSize} text-primary`}>
            {showPercentage ? `${Math.round(value)}%` : value}
          </span>
          {size === 'lg' && (
            <span className="text-sm text-muted-foreground mt-1 font-medium">
              {label}
            </span>
          )}
        </div>
      </div>
      {size === 'sm' && (
        <div className="mt-2 text-center">
          <p className={`font-medium text-foreground ${dimensions.fontSize} leading-tight`}>
            {title}
          </p>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            {label}
          </p>
        </div>
      )}
    </div>
  );
};
