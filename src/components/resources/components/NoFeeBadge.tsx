
import React from 'react';
import { StandardizedBadge } from "@/components/ui/standardized-badge";

interface NoFeeBadgeProps {
  hours: number;
  size?: 'xs' | 'sm' | 'md';
}

export const NoFeeBadge: React.FC<NoFeeBadgeProps> = ({ 
  hours,
  size = 'md'
}) => {
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
    <StandardizedBadge
      variant="status"
      className={sizeClasses}
      style={{
        backgroundColor: '#F1F0FB', // Standardized purple background
        color: '#6E59A5', // Standardized purple text
        marginLeft: '0'
      }}
    >
      No fee
    </StandardizedBadge>
  );
};
