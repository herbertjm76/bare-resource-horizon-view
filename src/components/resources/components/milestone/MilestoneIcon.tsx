
import React from 'react';
import { Circle, Square, Diamond } from 'lucide-react';
import { MilestoneType } from '../../hooks/useWeekMilestones';

interface MilestoneIconProps {
  type: MilestoneType;
  className?: string;
}

export const MilestoneIcon: React.FC<MilestoneIconProps> = ({ type, className = "" }) => {
  switch (type) {
    case 'milestone':
      return <Circle className={`${className}`} fill="black" />;
    case 'kickoff':
      return <Square className={`${className}`} fill="black" />;
    case 'workshop':
      return <Circle className={`${className}`} fill="black" />;
    case 'deadline':
      return <Diamond className={`${className}`} fill="black" />;
    default:
      return null;
  }
};
