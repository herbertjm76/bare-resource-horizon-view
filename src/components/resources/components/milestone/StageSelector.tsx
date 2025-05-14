
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { MilestoneInfo } from '../../hooks/useWeekMilestones';

interface StageSelectorProps {
  weekKey: string;
  milestone?: MilestoneInfo;
  projectStages: Array<{id: string; name: string; color?: string}>;
  onSelectStage: (weekKey: string, milestoneInfo: MilestoneInfo) => void;
}

export const StageSelector: React.FC<StageSelectorProps> = ({
  weekKey,
  milestone,
  projectStages,
  onSelectStage
}) => {
  return (
    <div className="space-y-2">
      <h5 className="text-xs font-medium">Set Stage</h5>
      <div className="grid grid-cols-2 gap-2">
        {projectStages?.map((stage) => (
          <TooltipProvider key={stage.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-muted"
                  onClick={() => onSelectStage(weekKey, { 
                    type: 'none',
                    stage: stage.name
                  })}
                >
                  <div 
                    className="h-3 w-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: stage.color || '#E5DEFF' }}
                  />
                  <span className="text-xs truncate">{stage.name}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{stage.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-muted"
                onClick={() => onSelectStage(weekKey, { type: 'none' })}
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
