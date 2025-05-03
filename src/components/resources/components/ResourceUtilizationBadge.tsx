
import React from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

type UtilizationStatus = 'low' | 'optimal' | 'high' | 'over';

interface UtilizationColorScheme {
  background: string;
  text: string;
}

interface ResourceUtilizationBadgeProps {
  utilization: number;
  size?: 'sm' | 'md';
}

export const ResourceUtilizationBadge: React.FC<ResourceUtilizationBadgeProps> = ({ 
  utilization, 
  size = 'md' 
}) => {
  // Round up the utilization percentage for display
  const displayUtilization = Math.ceil(utilization);
  
  // Get status based on utilization percentage (now yellow is optimal, green is high)
  const getUtilizationStatus = (percentage: number): UtilizationStatus => {
    if (percentage <= 30) return 'low';
    if (percentage <= 80) return 'optimal';
    if (percentage <= 100) return 'high';
    return 'over';
  };

  // Get color scheme based on status
  const getColorScheme = (status: UtilizationStatus): UtilizationColorScheme => {
    switch (status) {
      case 'low':
        return { background: 'bg-gray-200', text: 'text-gray-600' };
      case 'optimal':
        return { background: 'bg-yellow-100', text: 'text-yellow-800' }; // Changed to yellow
      case 'high':
        return { background: 'bg-green-100', text: 'text-green-800' }; // Changed to green
      case 'over':
        return { background: 'bg-red-100', text: 'text-red-800' };
    }
  };

  // Get tooltip message based on status
  const getTooltipMessage = (status: UtilizationStatus): string => {
    switch (status) {
      case 'low':
        return 'Low utilization (≤30%)';
      case 'optimal':
        return 'Optimal utilization (31-80%)';
      case 'high':
        return 'High utilization (81-100%)';
      case 'over':
        return 'Over-allocated (>100%)';
    }
  };

  const status = getUtilizationStatus(displayUtilization);
  const colors = getColorScheme(status);
  const message = getTooltipMessage(status);
  
  const sizeClasses = size === 'sm' 
    ? 'h-4 text-xs px-1.5' 
    : 'h-5 text-xs px-2';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center justify-center rounded-full ${colors.background} ${colors.text} font-medium ${sizeClasses}`}>
            {displayUtilization}%
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
