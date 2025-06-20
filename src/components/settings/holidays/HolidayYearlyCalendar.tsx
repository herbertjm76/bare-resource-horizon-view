
import React from 'react';
import { Holiday } from './types';
import { format, startOfYear, endOfYear, eachMonthOfInterval, isSameMonth, isSameDay } from 'date-fns';

interface HolidayYearlyCalendarProps {
  holidays: Holiday[];
  selectedYear: Date;
  onDateSelect?: (date: Date) => void;
}

export const HolidayYearlyCalendar: React.FC<HolidayYearlyCalendarProps> = ({
  holidays,
  selectedYear,
  onDateSelect
}) => {
  const yearStart = startOfYear(selectedYear);
  const yearEnd = endOfYear(selectedYear);
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  const getHolidaysForMonth = (month: Date) => {
    return holidays.filter(holiday => isSameMonth(holiday.date, month));
  };

  const getHolidaysForDate = (date: Date) => {
    return holidays.filter(holiday => isSameDay(holiday.date, date));
  };

  const getDaysInMonth = (month: Date) => {
    const days = [];
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    // Add empty cells for days before month starts
    const startDay = monthStart.getDay();
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= monthEnd.getDate(); day++) {
      days.push(new Date(month.getFullYear(), month.getMonth(), day));
    }
    
    return days;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {months.map((month) => {
        const monthHolidays = getHolidaysForMonth(month);
        const days = getDaysInMonth(month);
        
        return (
          <div key={month.toISOString()} className="border rounded-lg p-4">
            <h3 className="font-semibold text-center mb-3">
              {format(month, 'MMMM')}
            </h3>
            
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-muted-foreground">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center p-1 font-medium">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="h-8"></div>;
                }
                
                const dayHolidays = getHolidaysForDate(day);
                const hasHolidays = dayHolidays.length > 0;
                
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => onDateSelect?.(day)}
                    className={`
                      h-8 text-xs rounded transition-colors
                      ${hasHolidays 
                        ? 'bg-yellow-200 text-yellow-800 font-bold hover:bg-yellow-300' 
                        : 'hover:bg-gray-100'
                      }
                    `}
                    title={dayHolidays.map(h => h.name).join(', ')}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
            
            {/* Holiday list for this month */}
            {monthHolidays.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="space-y-1">
                  {monthHolidays.slice(0, 3).map((holiday) => (
                    <div key={holiday.id} className="text-xs text-muted-foreground truncate">
                      {format(holiday.date, 'd')} - {holiday.name}
                    </div>
                  ))}
                  {monthHolidays.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{monthHolidays.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
