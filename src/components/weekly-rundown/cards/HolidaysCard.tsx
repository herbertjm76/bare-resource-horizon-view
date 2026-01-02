import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';

interface Holiday {
  id: string;
  date: string;
  end_date?: string;
  name: string;
}

interface HolidaysCardProps {
  holidays: Holiday[];
  selectedWeek?: Date;
}

export const HolidaysCard: React.FC<HolidaysCardProps> = ({ holidays, selectedWeek = new Date() }) => {
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });

  // Consolidate holidays by name and date (combine offices into one entry)
  const consolidatedHolidays = holidays.reduce((acc, holiday) => {
    const key = `${holiday.date}-${holiday.end_date || ''}-${holiday.name}`;
    if (!acc.find(h => `${h.date}-${h.end_date || ''}-${h.name}` === key)) {
      acc.push(holiday);
    }
    return acc;
  }, [] as Holiday[]);

  // Sort by date
  const sortedHolidays = consolidatedHolidays.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Split into this week and upcoming
  const thisWeekHolidays = sortedHolidays.filter(holiday => {
    const holidayDate = parseISO(holiday.date);
    return isWithinInterval(holidayDate, { start: weekStart, end: weekEnd });
  });

  const upcomingHolidays = sortedHolidays.filter(holiday => {
    const holidayDate = parseISO(holiday.date);
    return !isWithinInterval(holidayDate, { start: weekStart, end: weekEnd });
  });

  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    if (!endDate) return format(start, 'MMM d');
    
    const end = new Date(endDate);
    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    
    if (sameMonth) {
      return `${format(start, 'MMM d')}-${format(end, 'd')}`;
    }
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
  };

  const renderHoliday = (holiday: Holiday, index: number) => (
    <div key={`${holiday.id}-${index}`} className="flex items-center gap-1.5 text-sm">
      <span className="font-medium text-foreground truncate">{holiday.name}</span>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        ({formatDateRange(holiday.date, holiday.end_date)})
      </span>
    </div>
  );

  return (
    <Card className="h-full flex flex-col min-h-[120px] max-h-[25vh] shadow-sm border border-border bg-card flex-1 min-w-[180px] relative overflow-hidden">
      {/* Background watermark icon - use strokeWidth to fix overlapping lines */}
      <Calendar className="absolute -right-4 -bottom-4 h-24 w-24 text-muted-foreground/5 pointer-events-none" strokeWidth={1} />
      
      <CardHeader className="pb-1 flex-shrink-0 h-[40px] flex items-start pt-3">
        <CardTitle className="text-xs font-semibold text-foreground uppercase tracking-wide">Holidays</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto scrollbar-grey relative z-10 pr-2">
        {sortedHolidays.length === 0 ? (
          <p className="text-sm text-muted-foreground">No holidays</p>
        ) : (
          <div className="space-y-1">
            {thisWeekHolidays.length > 0 && (
              <div>
                {thisWeekHolidays.map(renderHoliday)}
              </div>
            )}
            {thisWeekHolidays.length > 0 && upcomingHolidays.length > 0 && (
              <div className="border-t border-foreground/20 my-1" />
            )}
            {upcomingHolidays.length > 0 && (
              <div>
                {upcomingHolidays.map(renderHoliday)}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
