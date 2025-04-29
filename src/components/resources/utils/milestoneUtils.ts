
import { MilestoneType } from '../hooks/useWeekMilestones';

// Get milestone icon name
export const getMilestoneIconName = (type: MilestoneType): string => {
  switch (type) {
    case 'milestone':
      return 'circle';
    case 'kickoff':
      return 'square';
    case 'workshop':
      return 'circle';
    case 'deadline':
      return 'diamond';
    default:
      return '';
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
