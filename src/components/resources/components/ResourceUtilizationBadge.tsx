
import React from 'react';
import { StandardizedBadge } from "@/components/ui/standardized-badge";
import { useAppSettings } from '@/hooks/useAppSettings';

interface ResourceUtilizationBadgeProps {
  utilization: number;
  size?: 'xs' | 'sm' | 'md';
}

export const ResourceUtilizationBadge: React.FC<ResourceUtilizationBadgeProps> = ({ 
  utilization,
  size = 'md'
}) => {
  const { allocationWarningThreshold, allocationDangerThreshold } = useAppSettings();
  
  // Round utilization to nearest integer
  const roundedUtilization = Math.round(utilization);
  
  // Helper function to get colors based on utilization percentage - using theme colors and app settings thresholds
  const getUtilizationColor = (util: number) => {
    if (util > allocationDangerThreshold) return { bg: '#FBCFE8', text: '#9D174D' }; // Pink/Magenta - danger
    if (util > allocationWarningThreshold) return { bg: '#FED7AA', text: '#C2410C' }; // Orange - warning
    if (util > 100) return { bg: '#FBCFE8', text: '#9D174D' }; // Pink/Magenta - over capacity
    if (util >= 70) return { bg: '#DDD6FE', text: '#6B21A8' }; // Purple - optimal
    return { bg: '#E5E7EB', text: '#4B5563' }; // Gray - under-utilized
  };
  
  const colors = getUtilizationColor(roundedUtilization);
  
  // Determine text size and padding based on size prop - using rounded square shape
  let sizeClasses = '';
  
  switch(size) {
    case 'xs':
      sizeClasses = 'text-[10px] py-0 px-1 h-4 rounded';
      break;
    case 'sm':
      sizeClasses = 'text-xs py-0 px-1 h-4 rounded';
      break;
    case 'md':
    default:
      sizeClasses = 'text-xs py-0.5 px-2 h-5 rounded';
      break;
  }
  
  return (
    <StandardizedBadge
      variant="status"
      className={sizeClasses}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        marginLeft: '0'
      }}
    >
      {roundedUtilization}%
    </StandardizedBadge>
  );
};
