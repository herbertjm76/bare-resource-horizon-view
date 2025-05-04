
import React from 'react';

type BadgeSize = 'xs' | 'sm' | 'md';

interface ResourceUtilizationBadgeProps {
  utilization: number;
  size?: BadgeSize;
}

export const ResourceUtilizationBadge: React.FC<ResourceUtilizationBadgeProps> = ({
  utilization,
  size = 'md'
}) => {
  // Determine color based on utilization percentage
  const getColor = (): { bg: string; text: string } => {
    if (utilization >= 90) {
      return { bg: 'bg-red-100', text: 'text-red-700' }; // Over-allocated
    } else if (utilization >= 75) {
      return { bg: 'bg-green-100', text: 'text-green-700' }; // Good utilization
    } else if (utilization >= 50) {
      return { bg: 'bg-yellow-100', text: 'text-yellow-700' }; // Moderate utilization
    } else {
      return { bg: 'bg-gray-100', text: 'text-gray-700' }; // Under-utilized
    }
  };
  
  const { bg, text } = getColor();
  
  // Determine size classes
  const sizeClasses = {
    xs: 'text-[10px] px-1 py-0',
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1'
  };
  
  return (
    <div className={`inline-flex items-center rounded-full ${bg} ${text} ${sizeClasses[size]}`}>
      {Math.round(utilization)}%
    </div>
  );
};
