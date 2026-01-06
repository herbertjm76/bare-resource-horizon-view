import React from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface WeekInfoCardProps {
  selectedWeek: Date;
}

export const WeekInfoCard: React.FC<WeekInfoCardProps> = ({ selectedWeek }) => {
  const today = new Date();
  const dayName = format(today, 'EEE').toUpperCase();
  const dayNumber = format(today, 'dd');
  const monthName = format(today, 'MMM').toUpperCase();

  return (
    <Card className="h-full min-h-[120px] w-[120px] flex-shrink-0 bg-muted/50 dark:bg-muted/30 border border-border/50 shadow-sm rounded-xl overflow-hidden">
      <div className="h-full flex flex-col items-center justify-center p-3">
        <Calendar className="h-4 w-4 text-muted-foreground mb-1.5" strokeWidth={1.5} />
        <span className="text-[11px] font-medium text-muted-foreground tracking-wide">{dayName}</span>
        <span className="text-3xl font-bold text-foreground leading-tight my-0.5">{dayNumber}</span>
        <span className="text-xs font-semibold text-muted-foreground tracking-wider">{monthName}</span>
      </div>
    </Card>
  );
};
