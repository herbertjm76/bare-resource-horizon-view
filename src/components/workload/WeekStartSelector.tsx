
import React from 'react';
import { WeekCalendarSelector } from './WeekCalendarSelector';

interface WeekStartSelectorProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
  className?: string;
}

export const WeekStartSelector: React.FC<WeekStartSelectorProps> = ({
  selectedWeek,
  onWeekChange,
  className
}) => {
  return (
    <WeekCalendarSelector
      selectedWeek={selectedWeek}
      onWeekChange={onWeekChange}
      className={className}
    />
  );
};
