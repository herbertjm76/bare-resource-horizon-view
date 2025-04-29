
import React from 'react';
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MilestoneInfo } from './types';
import { MilestoneIcon } from './MilestoneIcon';

interface MilestoneSelectorProps {
  weekKey: string;
  milestone?: MilestoneInfo;
  onSetMilestone: (weekKey: string, milestoneInfo: MilestoneInfo) => void;
}

export const MilestoneSelector: React.FC<MilestoneSelectorProps> = ({ 
  weekKey, 
  milestone, 
  onSetMilestone 
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
                onClick={() => onSetMilestone(weekKey, { 
                  type: 'kickoff',
                  stage: milestone?.stage,
                  icon: 'square'
                })}
              >
                <MilestoneIcon type="kickoff" className="h-3 w-3 mr-1" /> Kickoff
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
                onClick={() => onSetMilestone(weekKey, { 
                  type: 'workshop',
                  stage: milestone?.stage,
                  icon: 'circle'
                })}
              >
                <MilestoneIcon type="workshop" className="h-3 w-3 mr-1" /> Workshop
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
                onClick={() => onSetMilestone(weekKey, { 
                  type: 'deadline',
                  stage: milestone?.stage,
                  icon: 'diamond'
                })}
              >
                <MilestoneIcon type="deadline" className="h-3 w-3 mr-1" /> Deadline
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
                onClick={() => onSetMilestone(weekKey, { type: 'none' })}
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
