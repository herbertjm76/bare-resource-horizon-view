
import React from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { MilestoneInfo, Continuity } from '../hooks/useWeekMilestones';
import { MilestoneContinuity } from './milestone/MilestoneContinuity';
import { MilestonePopoverContent } from './milestone/MilestonePopoverContent';

interface MilestonePopoverProps {
  weekKey: string;
  weekLabel: string;
  milestone: MilestoneInfo | undefined;
  continuity: Continuity;
  milestoneColor?: string;
  alignment: string;
  setWeekMilestone: (weekKey: string, milestoneInfo: MilestoneInfo) => void;
  projectStages: Array<{id: string; name: string; color?: string}>;
}

export const MilestonePopover: React.FC<MilestonePopoverProps> = ({
  weekKey,
  weekLabel,
  milestone,
  continuity,
  milestoneColor,
  alignment,
  setWeekMilestone,
  projectStages
}) => {
  return (
    <Popover>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <div className="w-full h-[18px] cursor-pointer flex items-center justify-center">
                <MilestoneContinuity 
                  milestone={milestone} 
                  continuity={continuity} 
                  milestoneColor={milestoneColor} 
                  alignment={alignment} 
                />
              </div>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Click to set milestone or stage</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent className="w-64 p-3" align="center">
        <MilestonePopoverContent 
          weekKey={weekKey}
          weekLabel={weekLabel}
          milestone={milestone}
          projectStages={projectStages}
          setWeekMilestone={setWeekMilestone}
        />
      </PopoverContent>
    </Popover>
  );
};
