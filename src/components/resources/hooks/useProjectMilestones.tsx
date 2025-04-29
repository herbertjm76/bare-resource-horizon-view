
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { MilestoneInfo, Continuity } from '../milestones/MilestoneVisualizer';

export const useProjectMilestones = (stageColorMap: Record<string, string>) => {
  // Track milestones and stages for each week
  const [weekMilestones, setWeekMilestones] = useState<Record<string, MilestoneInfo>>({});
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragItem, setDragItem] = useState<MilestoneInfo | null>(null);

  // Set milestone or stage for a specific week
  const setWeekMilestone = useCallback((weekKey: string, milestoneInfo: MilestoneInfo) => {
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
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((weekKey: string) => {
    const milestone = weekMilestones[weekKey];
    if (milestone) {
      setDragItem(milestone);
      setIsDragging(true);
    }
  }, [weekMilestones]);

  // Handle drop on a week
  const handleDrop = useCallback((weekKey: string) => {
    if (dragItem) {
      setWeekMilestone(weekKey, dragItem);
      setIsDragging(false);
      setDragItem(null);
    }
  }, [dragItem, setWeekMilestone]);

  // Handle ending drag (e.g., if dropped outside a valid target)
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragItem(null);
  }, []);

  // Get milestone color based on stage
  const getMilestoneColor = useCallback((milestone: MilestoneInfo) => {
    if (milestone.stage && stageColorMap[milestone.stage]) {
      return stageColorMap[milestone.stage];
    }
    return undefined;
  }, [stageColorMap]);

  // Check if there's a milestone in the adjacent week
  const hasContinuousStage = useCallback((weekIndex: number, currentMilestone: MilestoneInfo | undefined, weeks: { startDate: Date }[]): Continuity => {
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
  }, [weekMilestones]);

  return {
    weekMilestones,
    setWeekMilestone,
    getMilestoneColor,
    hasContinuousStage,
    handleDragStart,
    handleDrop,
    handleDragEnd,
    isDragging,
    dragItem
  };
};
