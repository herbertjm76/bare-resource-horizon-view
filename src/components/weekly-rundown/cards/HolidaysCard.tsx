import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Holiday {
  id: string;
  date: string;
  end_date?: string;
  name: string;
}

interface HolidaysCardProps {
  holidays: Holiday[];
}

export const HolidaysCard: React.FC<HolidaysCardProps> = ({ holidays }) => {
  // Deduplicate holidays by date and name
  const uniqueHolidays = holidays.reduce((acc, holiday) => {
    const key = `${holiday.date}-${holiday.name}`;
    if (!acc.find(h => `${h.date}-${h.name}` === key)) {
      acc.push(holiday);
    }
    return acc;
  }, [] as Holiday[]);

  return (
    <Card className="h-full flex flex-col min-h-[140px] max-h-[140px] shadow-sm border border-border bg-card flex-1 min-w-[180px] relative overflow-hidden">
      {/* Background watermark icon - use strokeWidth to fix overlapping lines */}
      <Calendar className="absolute -right-4 -bottom-4 h-24 w-24 text-muted-foreground/5 pointer-events-none" strokeWidth={1} />
      
      <CardHeader className="pb-2 flex-shrink-0 h-[44px] flex items-start pt-4">
        <CardTitle className="text-xs font-semibold text-foreground uppercase tracking-wide">Holidays</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto scrollbar-grey relative z-10">
        {uniqueHolidays.length === 0 ? (
          <p className="text-sm text-muted-foreground">No holidays this week</p>
        ) : (
          <div className="space-y-2">
            {uniqueHolidays.map((holiday) => (
              <div key={holiday.id} className="flex flex-col text-sm">
                <span className="font-medium text-foreground">{holiday.name}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(holiday.date), 'MMM d')}
                  {holiday.end_date && ` - ${format(new Date(holiday.end_date), 'MMM d')}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
