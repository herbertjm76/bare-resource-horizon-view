
import React from 'react';
import { StageTimelineOverlay } from './StageTimelineOverlay';

interface DayInfo {
  date: Date;
  label: string;
  dayName: string;
  monthLabel: string;
  isWeekend: boolean;
  isSunday: boolean;
  isFirstOfMonth: boolean;
  isEndOfWeek?: boolean;
  isPreviousWeek?: boolean;
  isToday?: boolean;
  isCurrentWeek?: boolean;
}

interface DailyAllocationCellProps {
  day: DayInfo;
  dayKey: string;
  projectHours: number;
  isInStageTimeline?: boolean;
  isStageStart?: boolean;
  isStageEnd?: boolean;
}

export const DailyAllocationCell: React.FC<DailyAllocationCellProps> = ({
  day,
  dayKey,
  projectHours,
  isInStageTimeline = false,
  isStageStart = false,
  isStageEnd = false
}) => {
  // Style classes - apply weekend class for consistent styling
  const isWeekendClass = day.isWeekend ? 'weekend' : '';
  const isSundayClass = day.isSunday ? 'sunday-border' : '';
  const isFirstOfMonthClass = day.isFirstOfMonth ? 'border-l-2 border-l-brand-primary/40' : '';
  const isEndOfWeekClass = day.isEndOfWeek ? 'border-r border-r-gray-300' : '';
  const isPreviousWeekClass = day.isPreviousWeek ? 'opacity-50' : '';
  const isCurrentWeekClass = day.isCurrentWeek ? 'current-week' : '';
  const isTodayClass = day.isToday ? 'today' : '';
  
  return (
    <td 
      key={dayKey} 
      className={`p-0 text-center w-[30px] ${isWeekendClass} ${isSundayClass} ${isFirstOfMonthClass} ${isEndOfWeekClass} ${isPreviousWeekClass} ${isCurrentWeekClass} ${isTodayClass}`}
    >
      <StageTimelineOverlay
        isInStageTimeline={isInStageTimeline}
        isStageStart={isStageStart}
        isStageEnd={isStageEnd}
      >
        <div className="px-0.5 py-1 text-xs">
          {projectHours > 0 ? (
            <span className="bg-white/80 rounded-lg px-1.5 py-0.5 font-medium text-sm inline-block min-w-[22px]">
              {projectHours}
            </span>
          ) : (
            <span className="text-muted-foreground"></span>
          )}
        </div>
      </StageTimelineOverlay>
    </td>
  );
};
