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
  return (
    <Card className="h-full flex flex-col min-h-[180px] shadow-sm border border-border bg-card/50 backdrop-blur-sm sm:min-w-[200px] sm:max-w-[240px]">
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <CardTitle className="text-xs font-semibold text-foreground uppercase">Holidays</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto scrollbar-grey">
        {holidays.length === 0 ? (
          <p className="text-sm text-muted-foreground">No holidays this week</p>
        ) : (
          <div className="space-y-2">
            {holidays.map((holiday) => (
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
