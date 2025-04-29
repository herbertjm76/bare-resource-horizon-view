
import React from 'react';
import { Circle, Square, Diamond } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type MilestoneType = 'none' | 'milestone' | 'kickoff' | 'workshop' | 'deadline';
export type MilestoneInfo = {
  type: MilestoneType;
  stage?: string; // Optional stage name
  icon?: 'circle' | 'square' | 'diamond';
};

// Define a type for continuity to ensure we handle both cases properly
export type Continuity = { left: boolean; right: boolean } | false;

interface MilestoneVisualizerProps {
  weekKey: string;
  weekLabel: string;
  milestone: MilestoneInfo | undefined;
  milestoneColor: string | undefined;
  continuity: Continuity;
  stageColorMap: Record<string, string>;
  onSetMilestone: (weekKey: string, milestoneInfo: MilestoneInfo) => void;
}

export const MilestoneVisualizer: React.FC<MilestoneVisualizerProps> = ({
  weekKey,
  weekLabel,
  milestone,
  milestoneColor,
  continuity,
  stageColorMap,
  onSetMilestone,
}) => {
  // Get milestone icon component
  const getMilestoneIcon = (type: MilestoneType) => {
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

  // Get icon alignment based on milestone type
  const getMilestoneAlignment = (type: MilestoneType): string => {
    switch (type) {
      case 'kickoff':
        return 'justify-start';
      case 'workshop':
        return 'justify-center';
      case 'deadline':
        return 'justify-end';
      default:
        return 'justify-center';
    }
  };

  const alignment = milestone?.type ? getMilestoneAlignment(milestone.type) : 'justify-center';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full h-5 cursor-pointer flex justify-center items-center">
          {milestone && milestone.type !== 'none' ? (
            <div className={`relative flex items-center ${alignment} h-3 w-full`}>
              <div 
                className={`absolute h-[1.33px] ${continuity && continuity.left ? '' : 'rounded-l'} ${continuity && continuity.right ? '' : 'rounded-r'}`}
                style={{
                  backgroundColor: milestoneColor || '#E5DEFF',
                  width: 'calc(100% - 2px)',
                  left: continuity && continuity.left ? '-1px' : '1px',
                  right: continuity && continuity.right ? '-1px' : '1px'
                }}
              />
              <div className="relative z-10">
                {getMilestoneIcon(milestone.type)}
              </div>
            </div>
          ) : milestone?.stage ? (
            <div 
              className={`h-[1.33px] ${continuity && continuity.left ? '' : 'rounded-l'} ${continuity && continuity.right ? '' : 'rounded-r'}`}
              style={{
                backgroundColor: milestoneColor || '#E5DEFF',
                width: '100%',
                marginLeft: continuity && continuity.left ? '-1px' : '0',
                marginRight: continuity && continuity.right ? '-1px' : '0'
              }}
            />
          ) : (
            <div className="h-[1.33px] w-4/5 border border-dotted border-gray-300 opacity-30 rounded" />
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
                      onClick={() => onSetMilestone(weekKey, { 
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
                      onClick={() => onSetMilestone(weekKey, { 
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
                      onClick={() => onSetMilestone(weekKey, { 
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
        </div>
      </PopoverContent>
    </Popover>
  );
};
