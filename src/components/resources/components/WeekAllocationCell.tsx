
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
    <td className="border-b text-center font-medium relative week-allocation-cell" style={{ minWidth: '35px', maxWidth: '35px', padding: 0 }}>
      <div className="week-allocation-cell-content">
        {/* Milestone/Stage indicator area */}
        <div className="w-full">
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
        <div className="hours-display">
          <span className={`text-xs font-bold ${projectHours > 0 ? 'text-black' : 'text-gray-250'}`}>
            {projectHours > 0 ? `${projectHours}h` : '0h'}
          </span>
        </div>
      </div>
    </td>
  );
};
