
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MilestoneStatusLine } from './MilestoneStatusLine';
import { StageSelector } from './StageSelector';
import { MilestoneSelector } from './MilestoneSelector';
import { MilestoneInfo, Continuity, MilestoneVisualizerProps } from './types';

export { type MilestoneType, type MilestoneInfo, type Continuity } from './types';

export const MilestoneVisualizer: React.FC<MilestoneVisualizerProps> = ({
  weekKey,
  weekLabel,
  milestone,
  milestoneColor,
  continuity,
  stageColorMap,
  onSetMilestone,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full h-5 cursor-pointer flex justify-center items-center">
          <MilestoneStatusLine
            milestone={milestone}
            milestoneColor={milestoneColor}
            continuity={continuity}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="center">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Week of {weekLabel}</h4>
          
          {/* Project stage selector */}
          <StageSelector
            stageColorMap={stageColorMap}
            weekKey={weekKey}
            onSetMilestone={onSetMilestone}
          />
          
          {/* Milestone type selector */}
          <MilestoneSelector
            weekKey={weekKey}
            milestone={milestone}
            onSetMilestone={onSetMilestone}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
