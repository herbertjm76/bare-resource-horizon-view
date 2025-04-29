
import React from 'react';
import { MilestoneInfo, Continuity } from './types';
import { MilestoneIcon, getMilestoneAlignment } from './MilestoneIcon';

interface MilestoneStatusLineProps {
  milestone: MilestoneInfo | undefined;
  milestoneColor: string | undefined;
  continuity: Continuity;
}

export const MilestoneStatusLine: React.FC<MilestoneStatusLineProps> = ({
  milestone,
  milestoneColor,
  continuity,
}) => {
  if (!milestone) {
    return <div className="h-[1.33px] w-4/5 border border-dotted border-gray-300 opacity-30 rounded" />;
  }

  if (milestone.type !== 'none') {
    const alignment = getMilestoneAlignment(milestone.type);

    return (
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
          <MilestoneIcon type={milestone.type} />
        </div>
      </div>
    );
  }

  if (milestone.stage) {
    return (
      <div 
        className={`h-[1.33px] ${continuity && continuity.left ? '' : 'rounded-l'} ${continuity && continuity.right ? '' : 'rounded-r'}`}
        style={{
          backgroundColor: milestoneColor || '#E5DEFF',
          width: '100%',
          marginLeft: continuity && continuity.left ? '-1px' : '0',
          marginRight: continuity && continuity.right ? '-1px' : '0'
        }}
      />
    );
  }

  return <div className="h-[1.33px] w-4/5 border border-dotted border-gray-300 opacity-30 rounded" />;
};
