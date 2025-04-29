
import { useState } from 'react';
import { toast } from 'sonner';
import { MilestoneInfo, Continuity } from '../milestones/MilestoneVisualizer';

export const useProjectMilestones = (stageColorMap: Record<string, string>) => {
  // Track milestones and stages for each week
  const [weekMilestones, setWeekMilestones] = useState<Record<string, MilestoneInfo>>({});

  // Set milestone or stage for a specific week
  const setWeekMilestone = (weekKey: string, milestoneInfo: MilestoneInfo) => {
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
  };

  // Get milestone color based on stage
  const getMilestoneColor = (milestone: MilestoneInfo) => {
    if (milestone.stage && stageColorMap[milestone.stage]) {
      return stageColorMap[milestone.stage];
    }
    return undefined;
  };

  // Check if there's a milestone in the adjacent week
  const hasContinuousStage = (weekIndex: number, currentMilestone: MilestoneInfo | undefined, weeks: { startDate: Date }[]): Continuity => {
    if (!currentMilestone || !currentMilestone.stage) return false;
    
    const getWeekKey = (startDate: Date) => {
      return startDate.toISOString().split('T')[0];
    };
    
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
    getMilestoneColor,
    hasContinuousStage
  };
};
