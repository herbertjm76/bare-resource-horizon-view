
import React from 'react';
import { MilestoneInfo, Continuity } from '../../hooks/useWeekMilestones';
import { MilestoneIcon } from './MilestoneIcon';

interface MilestoneContinuityProps {
  milestone: MilestoneInfo | undefined;
  continuity: Continuity;
  milestoneColor?: string;
  alignment: string;
}

export const MilestoneContinuity: React.FC<MilestoneContinuityProps> = ({
  milestone,
  continuity,
  milestoneColor,
  alignment
}) => {
  if (!milestone) {
    return (
      <div className="h-[4px] w-full border border-dotted border-gray-300 opacity-30 rounded" />
    );
  }
  
  if (milestone.type !== 'none') {
    return (
      <div className={`relative flex items-center ${alignment} h-3 w-full`}>
        <div 
          className={`absolute h-[4px] ${continuity && continuity.left ? '' : 'rounded-l'} ${continuity && continuity.right ? '' : 'rounded-r'}`}
          style={{
            backgroundColor: milestoneColor || '#E5DEFF',
            width: '100%',
          }}
        />
        <div className="relative z-10">
          <MilestoneIcon type={milestone.type} className="h-3 w-3" />
        </div>
      </div>
    );
  }
  
  if (milestone.stage) {
    return (
      <div 
        className={`h-[4px] w-full ${continuity && continuity.left ? '' : 'rounded-l'} ${continuity && continuity.right ? '' : 'rounded-r'}`}
        style={{
          backgroundColor: milestoneColor || '#E5DEFF',
        }}
      />
    );
  }
  
  return (
    <div className="h-[4px] w-full border border-dotted border-gray-300 opacity-30 rounded" />
  );
};
