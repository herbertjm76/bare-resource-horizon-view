import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-2 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-500" />
            </div>
            <CardTitle className="text-sm font-medium">Holidays</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => navigate('/settings/holidays')}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
