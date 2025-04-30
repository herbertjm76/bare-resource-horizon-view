
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
  // Default state - empty gray line when not selected
  if (!milestone) {
    return (
      <div 
        className="h-[4px] w-full bg-gray-250 cursor-pointer"
      />
    );
  }
  
  // Milestone with icon
  if (milestone.type !== 'none') {
    return (
      <div 
        className={`relative flex items-center ${alignment} h-3 w-full group cursor-pointer`}
      >
        {/* Solid color bar with icon */}
        <div 
          className="absolute h-[4px] w-full"
          style={{
            backgroundColor: milestoneColor || '#9b87f5',
            left: 0,
            right: 0
          }}
        />
        <div className="relative z-10">
          <MilestoneIcon type={milestone.type} className="h-3 w-3" />
        </div>
      </div>
    );
  }
  
  // Stage only (no milestone) - solid color rectangle
  if (milestone.stage) {
    return (
      <div 
        className="h-[4px] w-full cursor-pointer"
        style={{
          backgroundColor: milestoneColor || '#9b87f5',
          maxWidth: '100%',
        }}
      />
    );
  }
  
  // Default state (no milestone or stage) - slightly darker gray line
  return (
    <div 
      className="h-[4px] w-full bg-gray-250 cursor-pointer"
    />
  );
};
