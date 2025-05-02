
import React from 'react';
import { MilestonePopover } from './MilestonePopover';
import { 
  getMilestoneColor, 
  getMilestoneAlignment 
} from '../utils/milestoneUtils';
import { MilestoneInfo, Continuity } from '../hooks/useWeekMilestones';

interface WeekAllocationCellProps {
  weekKey: string;
  weekLabel: string;
  projectHours: number;
  milestone?: MilestoneInfo;
  continuity: Continuity;
  stageColorMap: Record<string, string>;
  setWeekMilestone: (weekKey: string, milestoneInfo: MilestoneInfo) => void;
  projectStages: Array<{id: string; name: string; color?: string}>;
}

export const WeekAllocationCell: React.FC<WeekAllocationCellProps> = ({
  weekKey,
  weekLabel,
  projectHours,
  milestone,
  continuity,
  stageColorMap,
  setWeekMilestone,
  projectStages
}) => {
  const milestoneColor = milestone ? getMilestoneColor(milestone, stageColorMap) : undefined;
  const alignment = milestone?.type ? getMilestoneAlignment(milestone.type) : 'justify-center';
  
  return (
    <td className="p-0 border-b text-center font-medium relative" style={{ minWidth: '35px' }}>
      <div className="flex flex-col items-center">
        {/* Milestone/Stage indicator area - clickable */}
        <div className="w-full transition-colors">
          <MilestonePopover
            weekKey={weekKey}
            weekLabel={weekLabel}
            milestone={milestone}
            continuity={continuity}
            milestoneColor={milestoneColor}
            alignment={alignment}
            setWeekMilestone={setWeekMilestone}
            projectStages={projectStages}
          />
        </div>
        
        {/* Hours display */}
        <div className="py-[5px] px-0">
          <span className="text-xs font-bold">{projectHours > 0 ? `${projectHours}h` : '0h'}</span>
        </div>
      </div>
    </td>
  );
};
