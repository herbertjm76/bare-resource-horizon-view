
import React from 'react';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MilestoneInfo } from './types';

interface StageSelectorProps {
  stageColorMap: Record<string, string>;
  weekKey: string;
  onSetMilestone: (weekKey: string, milestoneInfo: MilestoneInfo) => void;
}

export const StageSelector: React.FC<StageSelectorProps> = ({ 
  stageColorMap, 
  weekKey, 
  onSetMilestone 
}) => {
  return (
    <div className="space-y-2">
      <h5 className="text-xs font-medium">Set Stage</h5>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(stageColorMap).map(([stageName, color]) => (
          <TooltipProvider key={stageName}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-muted"
                  onClick={() => onSetMilestone(weekKey, { 
                    type: 'none',
                    stage: stageName
                  })}
                >
                  <div 
                    className="h-3 w-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: color || '#E5DEFF' }}
                  />
                  <span className="text-xs truncate">{stageName}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{stageName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-muted"
                onClick={() => onSetMilestone(weekKey, { type: 'none' })}
              >
                <div className="h-3 w-3 rounded-sm border border-gray-300 flex-shrink-0" />
                <span className="text-xs">Clear</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove stage</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
