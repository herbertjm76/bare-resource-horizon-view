import { useState } from 'react';
import { toast } from 'sonner';

export type MilestoneType = 'none' | 'milestone' | 'kickoff' | 'workshop' | 'deadline';

export type MilestoneInfo = {
  type: MilestoneType;
  stage?: string; // Optional stage name
  icon?: 'circle' | 'square' | 'diamond';
};

// Define a type for continuity to ensure we handle both cases properly
export type Continuity = { left: boolean; right: boolean } | false;

export const useWeekMilestones = () => {
  // Track milestones and stages for each week
  const [weekMilestones, setWeekMilestones] = useState<Record<string, MilestoneInfo>>({});

  // Set milestone or stage for a specific week
  const setWeekMilestone = (weekKey: string, milestoneInfo: MilestoneInfo) => {
    // When clearing, remove the entry completely from the object
    if (milestoneInfo.type === 'none' && !milestoneInfo.stage) {
      setWeekMilestones(prev => {
        const newMilestones = { ...prev };
        delete newMilestones[weekKey];
        return newMilestones;
      });
      toast.info("Milestone and stage removed");
    } else {
      // Otherwise update/add the milestone info
      setWeekMilestones(prev => ({
        ...prev,
        [weekKey]: milestoneInfo
      }));
      
      // Show toast message
      if (milestoneInfo.type === 'none') {
        toast.info("Milestone removed");
      } else if (milestoneInfo.stage) {
        toast.success(`Stage ${milestoneInfo.stage} set for week of ${weekKey}`);
      } else {
        toast.success(`${milestoneInfo.type} set for week of ${weekKey}`);
      }
    }
  };

  // Check if there's a milestone in the adjacent week
  const hasContinuousStage = (
    weekIndex: number, 
    currentMilestone: MilestoneInfo | undefined, 
    weeks: { startDate: Date; label: string; days: Date[]; }[],
    getWeekKey: (date: Date) => string
  ): Continuity => {
    if (!currentMilestone || !currentMilestone.stage) return false;
    
    const prevWeekKey = weekIndex > 0 ? getWeekKey(weeks[weekIndex - 1].startDate) : null;
    const nextWeekKey = weekIndex < weeks.length - 1 ? getWeekKey(weeks[weekIndex + 1].startDate) : null;
    
    const prevMilestone = prevWeekKey ? weekMilestones[prevWeekKey] : undefined;
    const nextMilestone = nextWeekKey ? weekMilestones[nextWeekKey] : undefined;
    
    const leftContinuous = prevMilestone?.stage === currentMilestone.stage && !prevMilestone.type;
    const rightContinuous = nextMilestone?.stage === currentMilestone.stage && !nextMilestone.type;
    
    return { left: leftContinuous, right: rightContinuous };
  };

  return {
    weekMilestones,
    setWeekMilestone,
    hasContinuousStage
  };
};
