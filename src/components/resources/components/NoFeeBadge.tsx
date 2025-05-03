
import React from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { AlertCircle } from 'lucide-react';

interface NoFeeBadgeProps {
  hours: number;
  size?: 'sm' | 'md';
}

export const NoFeeBadge: React.FC<NoFeeBadgeProps> = ({ hours, size = 'md' }) => {
  const sizeClasses = size === 'sm' 
    ? 'h-5 text-xs px-1.5 py-0.5' 
    : 'h-6 text-xs px-2 py-1';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1">
            <span className={`inline-flex items-center justify-center rounded-md bg-gray-100 text-gray-600 font-medium ${sizeClasses}`}>
              <AlertCircle className="h-3 w-3 mr-1" />
              Fees not set
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p>Project has {hours} allocated hours but no fees have been set to calculate budget utilization</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
