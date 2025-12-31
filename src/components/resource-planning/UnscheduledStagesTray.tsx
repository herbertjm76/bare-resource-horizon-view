import React from 'react';
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface StageWithDates {
  id: string;
  stageName: string;
  startDate: Date | null;
  contractedWeeks: number;
  color: string;
  orderIndex: number;
}

interface UnscheduledStagesTrayProps {
  stages: StageWithDates[];
  isOpen: boolean;
  onToggle: () => void;
  onStageClick: (e: React.MouseEvent, stage: StageWithDates) => void;
  onDragStart: (e: React.DragEvent, stage: StageWithDates) => void;
}

export const UnscheduledStagesTray: React.FC<UnscheduledStagesTrayProps> = ({
  stages,
  isOpen,
  onToggle,
  onStageClick,
  onDragStart,
}) => {
  const unscheduledStages = stages.filter(s => !s.startDate);

  if (unscheduledStages.length === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors",
            "hover:bg-muted/80 text-muted-foreground hover:text-foreground",
            isOpen && "bg-muted text-foreground"
          )}
        >
          {isOpen ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
          <span className="font-medium">
            {unscheduledStages.length} unscheduled
          </span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-1.5">
        <div className="flex flex-wrap gap-1.5 pl-1">
          {unscheduledStages.map((stage) => (
            <Tooltip key={stage.stageName}>
              <TooltipTrigger asChild>
                <div
                  draggable
                  className={cn(
                    "flex items-center gap-1 h-6 px-2 rounded-md text-[10px] font-medium",
                    "text-white shadow-sm cursor-grab",
                    "hover:ring-2 hover:ring-primary hover:ring-offset-1",
                    "active:cursor-grabbing active:opacity-75"
                  )}
                  style={{ backgroundColor: stage.color }}
                  onClick={(e) => onStageClick(e, stage)}
                  onDragStart={(e) => onDragStart(e, stage)}
                >
                  <GripVertical className="h-3 w-3 text-white/60 shrink-0" />
                  <span className="truncate max-w-[80px]">{stage.stageName}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <p className="font-medium">{stage.stageName}</p>
                  <p className="text-muted-foreground">{stage.contractedWeeks} weeks duration</p>
                  <p className="text-primary mt-1">Drag to timeline or click to set date</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
