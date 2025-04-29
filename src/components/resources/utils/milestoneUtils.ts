
import React from 'react';
import { Circle, Square, Diamond } from 'lucide-react';
import { MilestoneType } from '../hooks/useWeekMilestones';

// Get milestone icon component
export const getMilestoneIcon = (type: MilestoneType): React.ReactNode => {
  switch (type) {
    case 'milestone':
      return <Circle className="h-3 w-3" fill="black" />;
    case 'kickoff':
      return <Square className="h-3 w-3" fill="black" />;
    case 'workshop':
      return <Circle className="h-3 w-3" fill="black" />;
    case 'deadline':
      return <Diamond className="h-3 w-3" fill="black" />;
    default:
      return null;
  }
};

// Get milestone color based on stage and color map
export const getMilestoneColor = (
  milestone: { stage?: string } | undefined, 
  stageColorMap: Record<string, string>
): string | undefined => {
  if (milestone?.stage && stageColorMap[milestone.stage]) {
    return stageColorMap[milestone.stage];
  }
  return undefined;
};

// Get icon alignment based on milestone type
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

// Common function to get week key from date
export const getWeekKey = (startDate: Date): string => {
  return startDate.toISOString().split('T')[0];
};
