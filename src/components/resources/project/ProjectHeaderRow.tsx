
import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { MilestoneInfo, Continuity } from '../milestones/types';
import { DraggableMilestoneVisualizer } from '../milestones/DraggableMilestoneVisualizer';

interface ProjectHeaderRowProps {
  project: any;
  weeks: {
    startDate: Date;
    label: string;
    days: Date[];
  }[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  weeklyProjectHours: Record<string, number>;
  weekMilestones: Record<string, MilestoneInfo>;
  stageColorMap: Record<string, string>;
  resourceCount: number;
  hasContinuousStage: (weekIndex: number, currentMilestone: MilestoneInfo | undefined) => Continuity;
  setWeekMilestone: (weekKey: string, milestoneInfo: MilestoneInfo) => void;
  getMilestoneColor: (milestone: MilestoneInfo) => string | undefined;
  headerBgClass: string;
  handleDragStart: (weekKey: string) => void;
  handleDrop: (weekKey: string) => void;
  handleDragEnd: () => void;
  isDragging: boolean;
  dragItem: MilestoneInfo | null;
}

export const ProjectHeaderRow: React.FC<ProjectHeaderRowProps> = ({
  project,
  weeks,
  isExpanded,
  onToggleExpand,
  weeklyProjectHours,
  weekMilestones,
  stageColorMap,
  resourceCount,
  hasContinuousStage,
  setWeekMilestone,
  getMilestoneColor,
  headerBgClass,
  handleDragStart,
  handleDrop,
  handleDragEnd,
  isDragging,
  dragItem,
}) => {
  const getWeekKey = (startDate: Date) => {
    return startDate.toISOString().split('T')[0];
  };
  
  return (
    <tr className={`border-t border-b border-gray-200 ${headerBgClass} ${isDragging ? 'relative z-30' : ''}`}>
      {/* Resource count column */}
      <td className={`sticky left-0 z-10 p-2 w-12 text-center ${headerBgClass}`}>
        {/* Counter moved to the project name cell */}
      </td>

      {/* Project name cell with the counter on the right */}
      <td className={`sticky left-12 z-10 p-2 cursor-pointer ${headerBgClass}`} onClick={onToggleExpand}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0 mr-2">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <div>
              <div className="font-medium">{project.name}</div>
              <div className="text-xs text-muted-foreground">{project.code}</div>
            </div>
          </div>
          
          {/* Always show resource counter */}
          <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-brand-violet text-white text-xs font-medium">
            {resourceCount}
          </div>
        </div>
      </td>
      
      {/* Week allocation cells - always show project totals */}
      {weeks.map((week, weekIndex) => {
        const weekKey = getWeekKey(week.startDate);
        const projectHours = weeklyProjectHours[weekKey] || 0;
        const milestone = weekMilestones[weekKey];
        const milestoneColor = milestone ? getMilestoneColor(milestone) : undefined;
        const continuity = milestone?.stage ? hasContinuousStage(weekIndex, milestone) : false;
        
        return (
          <td key={weekKey} className="p-0 border-b text-center font-medium w-8 relative">
            <div className="flex flex-col items-center">
              {/* Milestone/Stage indicator area - now draggable */}
              <DraggableMilestoneVisualizer
                weekKey={weekKey}
                weekLabel={week.label}
                milestone={milestone}
                milestoneColor={milestoneColor}
                continuity={continuity}
                stageColorMap={stageColorMap}
                onSetMilestone={setWeekMilestone}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                isDragging={isDragging}
              />
              
              {/* Hours display */}
              <div className="py-[6px] px-0">
                <span className="text-[15px] font-bold">{projectHours}h</span>
              </div>
            </div>
          </td>
        );
      })}
    </tr>
  );
};
