
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
  
  // Color-coding based on utilization percentage - consistent across app
  const getUtilizationColor = (util: number) => {
    if (util > allocationDangerThreshold) return { bg: '#FECACA', text: '#B91C1C' }; // Red - danger threshold exceeded
    if (util > allocationWarningThreshold) return { bg: '#FED7AA', text: '#C2410C' }; // Orange - warning threshold
    if (util > 100) return { bg: '#FECACA', text: '#B91C1C' }; // Red - over-allocated
    if (util >= 80) return { bg: '#BBF7D0', text: '#166534' }; // Green - optimal (80-100%)
    if (util >= 50) return { bg: '#FEF08A', text: '#A16207' }; // Yellow - moderate (50-79%)
    if (util > 0) return { bg: '#FED7AA', text: '#C2410C' }; // Orange - underutilized (<50%)
    return { bg: '#E5E7EB', text: '#4B5563' }; // Gray - no allocation
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
