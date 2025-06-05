
import React from 'react';
import { MilestonePopover } from './MilestonePopover';
import { 
  getMilestoneColor, 
  getMilestoneAlignment 
} from '../utils/milestoneUtils';
import { MilestoneInfo, Continuity } from '../hooks/useWeekMilestones';
import { StandardizedBadge } from "@/components/ui/standardized-badge";

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
          {projectHours > 0 ? (
            <StandardizedBadge
              variant="count"
              className="text-lg font-bold mx-1"
            >
              {projectHours}h
            </StandardizedBadge>
          ) : (
            <span className="text-lg font-bold text-gray-250">
              0h
            </span>
          )}
        </div>
      </div>
    </td>
  );
};
