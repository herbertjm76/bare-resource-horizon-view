
import React from 'react';
import { Circle, Square, Diamond } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { MilestoneInfo } from '../../hooks/useWeekMilestones';

interface MilestoneSelectorProps {
  weekKey: string;
  milestone?: MilestoneInfo;
  onSelectMilestone: (weekKey: string, milestoneInfo: MilestoneInfo) => void;
}

export const MilestoneSelector: React.FC<MilestoneSelectorProps> = ({
  weekKey,
  milestone,
  onSelectMilestone
}) => {
  return (
    <div className="space-y-2">
      <h5 className="text-xs font-medium">Set Milestone</h5>
      <div className="flex flex-wrap gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 px-2 py-1"
                onClick={() => onSelectMilestone(weekKey, { 
                  type: 'kickoff',
                  stage: milestone?.stage,
                  icon: 'square'
                })}
              >
                <Square className="h-3 w-3 mr-1" fill="black" /> Kickoff
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Project kickoff</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                className="h-7 px-2 py-1"
                onClick={() => onSelectMilestone(weekKey, { 
                  type: 'workshop',
                  stage: milestone?.stage,
                  icon: 'circle'
                })}
              >
                <Circle className="h-3 w-3 mr-1" fill="black" /> Workshop
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Project workshop</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                className="h-7 px-2 py-1"
                onClick={() => onSelectMilestone(weekKey, { 
                  type: 'deadline',
                  stage: milestone?.stage,
                  icon: 'diamond'
                })}
              >
                <Diamond className="h-3 w-3 mr-1" fill="black" /> Deadline
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Project deadline</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                className="h-7 px-2 py-1"
                onClick={() => onSelectMilestone(weekKey, { type: 'none' })}
              >
                Clear
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove milestone</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
