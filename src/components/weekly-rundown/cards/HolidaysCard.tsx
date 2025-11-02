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
    <Card className="h-full flex flex-col min-h-[200px]">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-blue-50 dark:bg-blue-950/30 p-2 rounded-lg">
            <Calendar className="h-4 w-4 text-blue-500" />
          </div>
          <CardTitle className="text-sm font-medium">Holidays</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
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
