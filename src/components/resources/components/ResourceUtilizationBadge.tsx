
import React from 'react';
import { formatUtilization, getUtilizationStatus } from '@/hooks/allocations/utils/utilizationUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ResourceUtilizationBadgeProps {
  utilization: number;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const ResourceUtilizationBadge: React.FC<ResourceUtilizationBadgeProps> = ({
  utilization,
  size = 'md',
  showTooltip = true
}) => {
  const { status, color } = getUtilizationStatus(utilization);
  const formattedUtilization = formatUtilization(utilization);
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-2.5 py-1'
  };
  
  // Status messages
  const statusMessages = {
    low: 'Under-allocated',
    optimal: 'Optimally allocated',
    high: 'Near full capacity',
    overallocated: 'Over-allocated'
  };
  
  const badge = (
    <span 
      className={`inline-flex items-center font-medium rounded ${sizeClasses[size]}`}
      style={{ 
        backgroundColor: `${color}20`, // 20% opacity
        color 
      }}
    >
      {formattedUtilization}
    </span>
  );
  
  // Return with or without tooltip
  return showTooltip ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          <p><strong>{statusMessages[status]}</strong></p>
          <p className="text-xs">Resource is allocated at {formattedUtilization} of capacity</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : badge;
};
