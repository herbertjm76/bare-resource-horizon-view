
import React from 'react';
import { Badge } from "@/components/ui/badge";

// Helper function to get color based on utilization percentage
const getUtilizationColor = (utilization: number) => {
  if (utilization < 70) return { bg: '#EDFAE5', text: '#25701B' }; // Green - under utilized
  if (utilization <= 100) return { bg: '#FEF7CD', text: '#856404' }; // Yellow - good utilization
  return { bg: '#FFDEE2', text: '#C0392B' }; // Red - over utilized
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
  
  // Determine text size and padding based on size prop
  let sizeClasses = '';
  
  switch(size) {
    case 'xs':
      sizeClasses = 'text-[10px] py-0 px-1 h-4';
      break;
    case 'sm':
      sizeClasses = 'text-xs py-0 px-1 h-4';
      break;
    case 'md':
    default:
      sizeClasses = 'text-xs py-0.5 px-2 h-5';
      break;
  }
  
  return (
    <Badge
      variant="outline"
      className={`${sizeClasses} font-medium`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text
      }}
    >
      {roundedUtilization}%
    </Badge>
  );
};
