
import React from 'react';
import { StageSelector } from './StageSelector';
import { MilestoneSelector } from './MilestoneSelector';
import { MilestoneInfo } from '../../hooks/useWeekMilestones';

interface MilestonePopoverContentProps {
  weekKey: string;
  weekLabel: string;
  milestone: MilestoneInfo | undefined;
  projectStages: Array<{id: string; name: string; color?: string}>;
  setWeekMilestone: (weekKey: string, milestoneInfo: MilestoneInfo) => void;
}

export const MilestonePopoverContent: React.FC<MilestonePopoverContentProps> = ({
  weekKey,
  weekLabel,
  milestone,
  projectStages,
  setWeekMilestone
}) => {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm">Week of {weekLabel}</h4>
      
      {/* Project stage selector */}
      <StageSelector 
        weekKey={weekKey} 
        milestone={milestone} 
        projectStages={projectStages}
        onSelectStage={setWeekMilestone} 
      />
      
      {/* Milestone type selector */}
      <MilestoneSelector 
        weekKey={weekKey} 
        milestone={milestone} 
        onSelectMilestone={setWeekMilestone} 
      />
    </div>
  );
};
