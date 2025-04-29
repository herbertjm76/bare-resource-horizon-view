
import React from 'react';
import { Circle, Square, Diamond } from 'lucide-react';
import { Button } from "@/components/ui/button";
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
import { MilestoneInfo } from '../hooks/useWeekMilestones';
import { getMilestoneIconName } from '../utils/milestoneUtils';

interface MilestonePopoverProps {
  weekKey: string;
  weekLabel: string;
  milestone: MilestoneInfo | undefined;
  continuity: any;
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
  // Function to render the appropriate icon based on milestone type
  const renderMilestoneIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <Circle className="h-3 w-3" fill="black" />;
      case 'kickoff':
        return <Square className="h-3 w-3" fill="black" />;
      case 'workshop':
        return <Circle className="h-3 w-3" fill="black" />;
      case 'deadline':
        return <Diamond className="h-3 w-3" fill="black" />;
      default:
        return null;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full h-5 cursor-pointer flex justify-center items-center">
          {milestone && milestone.type !== 'none' ? (
            <div className={`relative flex items-center ${alignment} h-3 w-full`}>
              <div 
                className={`absolute h-[4px] ${continuity && continuity.left ? '' : 'rounded-l'} ${continuity && continuity.right ? '' : 'rounded-r'}`}
                style={{
                  backgroundColor: milestoneColor || '#E5DEFF',
                  width: '100%', // Changed from 300% to 100%
                }}
              />
              <div className="relative z-10">
                {renderMilestoneIcon(milestone.type)}
              </div>
            </div>
          ) : milestone?.stage ? (
            <div 
              className={`h-[4px] w-full ${continuity && continuity.left ? '' : 'rounded-l'} ${continuity && continuity.right ? '' : 'rounded-r'}`}
              style={{
                backgroundColor: milestoneColor || '#E5DEFF',
              }}
            />
          ) : (
            <div className="h-[4px] w-full border border-dotted border-gray-300 opacity-30 rounded" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="center">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Week of {weekLabel}</h4>
          
          {/* Project stage selector */}
          <div className="space-y-2">
            <h5 className="text-xs font-medium">Set Stage</h5>
            <div className="grid grid-cols-2 gap-2">
              {projectStages?.map((stage) => (
                <TooltipProvider key={stage.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-muted"
                        onClick={() => setWeekMilestone(weekKey, { 
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
                      onClick={() => setWeekMilestone(weekKey, { type: 'none' })}
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
          
          {/* Milestone type selector */}
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
                      onClick={() => setWeekMilestone(weekKey, { 
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
                      onClick={() => setWeekMilestone(weekKey, { 
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
                      onClick={() => setWeekMilestone(weekKey, { 
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
                      onClick={() => setWeekMilestone(weekKey, { type: 'none' })}
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
        </div>
      </PopoverContent>
    </Popover>
  );
};
