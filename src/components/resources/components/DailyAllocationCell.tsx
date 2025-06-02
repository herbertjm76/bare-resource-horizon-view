
import React from 'react';

interface DayInfo {
  date: Date;
  label: string;
  dayName: string;
  monthLabel: string;
  isWeekend: boolean;
  isSunday: boolean;
  isFirstOfMonth: boolean;
  isEndOfWeek?: boolean;
}

interface DailyAllocationCellProps {
  day: DayInfo;
  dayKey: string;
  projectHours: number;
}

export const DailyAllocationCell: React.FC<DailyAllocationCellProps> = ({
  day,
  dayKey,
  projectHours
}) => {
  // Style classes - apply weekend class for consistent styling
  const isWeekendClass = day.isWeekend ? 'weekend' : '';
  const isSundayClass = day.isSunday ? 'sunday-border' : '';
  const isFirstOfMonthClass = day.isFirstOfMonth ? 'border-l-2 border-l-brand-primary/40' : '';
  const isEndOfWeekClass = day.isEndOfWeek ? 'border-r border-r-gray-300' : '';
  
  return (
    <td 
      key={dayKey} 
      className={`p-0 text-center w-[30px] ${isWeekendClass} ${isSundayClass} ${isFirstOfMonthClass} ${isEndOfWeekClass}`}
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
    </td>
  );
};
