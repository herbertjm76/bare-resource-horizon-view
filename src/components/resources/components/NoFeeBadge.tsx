
import React from 'react';
import { Badge } from "@/components/ui/badge";

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
    <Badge
      variant="outline"
      className={`${sizeClasses} font-medium`}
      style={{
        backgroundColor: '#F1F0FB',
        color: '#6E59A5'
      }}
    >
      No fee
    </Badge>
  );
};
