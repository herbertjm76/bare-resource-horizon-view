
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Holiday } from './types';
import { format, isSameDay } from 'date-fns';

interface HolidayCalendarViewProps {
  holidays: Holiday[];
  selectedMonth: Date;
  onDateSelect?: (date: Date) => void;
}

export const HolidayCalendarView: React.FC<HolidayCalendarViewProps> = ({
  holidays,
  selectedMonth,
  onDateSelect
}) => {
  const getHolidaysForDate = (date: Date) => {
    return holidays.filter(holiday => isSameDay(holiday.date, date));
  };

  const modifiers = {
    holiday: (date: Date) => getHolidaysForDate(date).length > 0
  };

  const modifiersStyles = {
    holiday: { 
      backgroundColor: '#fef3c7', 
      color: '#92400e',
      fontWeight: 'bold'
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Calendar
        mode="single"
        month={selectedMonth}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        onDayClick={onDateSelect}
        className="rounded-md border"
      />
      
      {/* Holiday legend */}
      <div className="mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-200 border border-yellow-400 rounded"></div>
          <span>Holiday dates</span>
        </div>
      </div>
    </div>
  );
};
