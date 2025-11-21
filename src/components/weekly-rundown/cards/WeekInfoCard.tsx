import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface WeekInfoCardProps {
  selectedWeek: Date;
}

export const WeekInfoCard: React.FC<WeekInfoCardProps> = ({ selectedWeek }) => {
  const dayName = format(selectedWeek, 'EEE');
  const dayNumber = format(selectedWeek, 'dd');
  const monthName = format(selectedWeek, 'MMM');
  const year = format(selectedWeek, 'yyyy');

  return (
    <Card className="h-full border shadow-sm overflow-hidden sm:min-w-[140px] sm:max-w-[160px] bg-white">
      <CardContent className="relative p-4 h-full flex flex-col items-center justify-center">
        <Calendar className="h-5 w-5 text-primary opacity-70 mb-2" />
        <div className="text-center space-y-0.5">
          <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">{dayName}</p>
          <p className="text-4xl font-bold text-foreground leading-none">{dayNumber}</p>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{monthName}</p>
          <p className="text-[10px] font-medium text-muted-foreground/70">{year}</p>
        </div>
      </CardContent>
    </Card>
  );
};
