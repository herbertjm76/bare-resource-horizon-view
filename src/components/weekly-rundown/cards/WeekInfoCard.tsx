import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface WeekInfoCardProps {
  selectedWeek: Date;
}

export const WeekInfoCard: React.FC<WeekInfoCardProps> = ({ selectedWeek }) => {
  const today = new Date();
  const dayName = format(today, 'EEE');
  const dayNumber = format(today, 'dd');
  const monthName = format(today, 'MMM');
  const year = format(today, 'yyyy');

  return (
    <Card className="h-full min-h-[120px] max-h-[25vh] border-2 border-primary/20 shadow-md overflow-hidden w-[140px] flex-shrink-0 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/15 dark:to-primary/5 flex flex-col">
      <CardContent className="relative p-4 flex-1 flex flex-col items-center justify-center">
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
