import React from 'react';
import { cn } from '@/lib/utils';

interface StageTimelineOverlayProps {
  isInStageTimeline: boolean;
  isStageStart?: boolean;
  isStageEnd?: boolean;
  children: React.ReactNode;
}

export const StageTimelineOverlay: React.FC<StageTimelineOverlayProps> = ({
  isInStageTimeline,
  isStageStart = false,
  isStageEnd = false,
  children
}) => {
  return (
    <div className={cn(
      "relative",
      isInStageTimeline && "bg-primary/10",
      isStageStart && "border-l-2 border-primary",
      isStageEnd && "border-r-2 border-primary"
    )}>
      {children}
      {(isStageStart || isStageEnd) && (
        <div className={cn(
          "absolute top-0 bottom-0 w-px",
          isStageStart && "left-0 bg-primary",
          isStageEnd && "right-0 bg-primary"
        )} />
      )}
    </div>
  );
};