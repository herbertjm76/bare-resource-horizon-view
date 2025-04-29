
import React, { useState } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);

  // Default state - empty solid outline
  if (!milestone) {
    return (
      <div 
        className="h-[4px] w-full border border-solid border-gray-300 bg-transparent hover:border-gray-400 transition-colors cursor-pointer rounded"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    );
  }
  
  // Milestone with icon
  if (milestone.type !== 'none') {
    return (
      <div 
        className={`relative flex items-center ${alignment} h-3 w-full group cursor-pointer`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Solid outline effect with fill on hover */}
        <div 
          className={`absolute h-[4px] ${continuity && continuity.left ? '' : 'rounded-l'} ${continuity && continuity.right ? '' : 'rounded-r'} transition-all group-hover:h-[6px]`}
          style={{
            backgroundColor: isHovered ? milestoneColor || '#9b87f5' : 'transparent',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: milestoneColor || '#9b87f5',
            width: '100%',
            maxWidth: '100%',
            left: 0,
            right: 0
          }}
        />
        <div className="relative z-10 transition-transform group-hover:scale-125">
          <MilestoneIcon type={milestone.type} className="h-3 w-3" />
        </div>
      </div>
    );
  }
  
  // Stage only (no milestone)
  if (milestone.stage) {
    return (
      <div 
        className={`h-[4px] w-full ${continuity && continuity.left ? '' : 'rounded-l'} ${continuity && continuity.right ? '' : 'rounded-r'} cursor-pointer hover:h-[6px] transition-all`}
        style={{
          backgroundColor: isHovered ? milestoneColor || '#9b87f5' : 'transparent',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: milestoneColor || '#9b87f5',
          maxWidth: '100%',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    );
  }
  
  // Default state (no milestone or stage)
  return (
    <div 
      className="h-[4px] w-full border border-solid border-gray-300 bg-transparent hover:border-gray-400 transition-colors cursor-pointer rounded"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
};
