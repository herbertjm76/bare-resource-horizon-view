
import React from 'react';

interface GaugeProps {
  value: number;
  max: number;
  title: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  trackColor?: string;
}

export const Gauge: React.FC<GaugeProps> = ({
  value,
  max,
  title,
  subtitle,
  size = 'md',
  color = '#6F4BF6',
  trackColor = '#ECECFB',
}) => {
  const percentage = Math.min(100, Math.round((value / max) * 100));
  const radius = size === 'sm' ? 35 : size === 'md' ? 45 : 55;
  const strokeWidth = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <svg 
          width={(radius + strokeWidth) * 2} 
          height={(radius + strokeWidth) * 2}
          className="transform -rotate-90"
        >
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={trackColor}
            fill="transparent"
          />
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={color}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl font-bold text-gray-900">{percentage}%</span>
        </div>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-gray-800">{title}</h3>
      {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
    </div>
  );
};
