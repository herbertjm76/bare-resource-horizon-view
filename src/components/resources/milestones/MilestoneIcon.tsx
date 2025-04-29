
import React from 'react';
import { Circle, Square, Diamond } from 'lucide-react';
import { MilestoneType } from './types';

interface MilestoneIconProps {
  type: MilestoneType;
  className?: string;
}

export const MilestoneIcon: React.FC<MilestoneIconProps> = ({ type, className = "h-3 w-3" }) => {
  switch (type) {
    case 'milestone':
      return <Circle className={className} fill="black" />;
    case 'kickoff':
      return <Square className={className} fill="black" />;
    case 'workshop':
      return <Circle className={className} fill="black" />;
    case 'deadline':
      return <Diamond className={className} fill="black" />;
    default:
      return null;
  }
};

export const getMilestoneAlignment = (type: MilestoneType): string => {
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
