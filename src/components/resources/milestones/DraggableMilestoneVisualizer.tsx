
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { MilestoneVisualizer } from './MilestoneVisualizer';
import { MilestoneInfo, Continuity } from './types';

interface DraggableMilestoneVisualizerProps {
  weekKey: string;
  weekLabel: string;
  milestone: MilestoneInfo | undefined;
  milestoneColor: string | undefined;
  continuity: Continuity;
  stageColorMap: Record<string, string>;
  onSetMilestone: (weekKey: string, milestoneInfo: MilestoneInfo) => void;
  onDragStart: (weekKey: string) => void;
  onDrop: (weekKey: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

// Define the drag and drop item types
const ItemTypes = {
  MILESTONE: 'milestone',
};

export const DraggableMilestoneVisualizer: React.FC<DraggableMilestoneVisualizerProps> = ({
  weekKey,
  weekLabel,
  milestone,
  milestoneColor,
  continuity,
  stageColorMap,
  onSetMilestone,
  onDragStart,
  onDrop,
  onDragEnd,
  isDragging,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Set up drag functionality if there's a milestone
  const [{ isDragging: isCurrentlyDragging }, drag] = useDrag(() => ({
    type: ItemTypes.MILESTONE,
    item: () => {
      // Signal that drag has started with this weekKey
      onDragStart(weekKey);
      return { weekKey, milestone };
    },
    end: () => {
      // Signal that drag has ended
      onDragEnd();
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: !!milestone && milestone.type !== 'none',
  }), [weekKey, milestone, onDragStart, onDragEnd]);

  // Set up drop functionality
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.MILESTONE,
    drop: () => {
      // Signal that item was dropped on this week
      onDrop(weekKey);
      return { weekKey };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [weekKey, onDrop]);

  // Combine the refs
  const combineRefs = (el: HTMLDivElement | null) => {
    ref.current = el;
    drag(el);
    drop(el);
  };

  // Apply styles based on drag and drop state
  const dropIndicatorStyle = isOver && canDrop ? 'border-2 border-dashed border-primary' : '';
  const dragStyle = isCurrentlyDragging ? 'opacity-50' : '';

  return (
    <div 
      ref={combineRefs}
      className={`cursor-grab ${dropIndicatorStyle} ${dragStyle}`}
    >
      <MilestoneVisualizer
        weekKey={weekKey}
        weekLabel={weekLabel}
        milestone={milestone}
        milestoneColor={milestoneColor}
        continuity={continuity}
        stageColorMap={stageColorMap}
        onSetMilestone={onSetMilestone}
      />
    </div>
  );
};
