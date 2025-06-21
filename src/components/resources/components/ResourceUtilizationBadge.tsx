
import React from 'react';
import { StandardizedBadge } from "@/components/ui/standardized-badge";

// Helper function to get pastel colors based on utilization percentage for status indication
const getUtilizationColor = (utilization: number) => {
  if (utilization < 70) return { bg: '#D1FAE5', text: '#065F46' }; // Pastel Green - good status
  if (utilization <= 100) return { bg: '#FED7AA', text: '#9A3412' }; // Pastel Orange - warning status
  return { bg: '#FECACA', text: '#991B1B' }; // Pastel Red - critical status
};

interface ResourceUtilizationBadgeProps {
  utilization: number;
  size?: 'xs' | 'sm' | 'md';
}

export const ResourceUtilizationBadge: React.FC<ResourceUtilizationBadgeProps> = ({ 
  utilization,
  size = 'md'
}) => {
  // Round utilization to nearest integer
  const roundedUtilization = Math.round(utilization);
  
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
