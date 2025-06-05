
import React from 'react';
import { format, startOfWeek } from 'date-fns';
import { Calendar } from 'lucide-react';

interface WeeklyOverviewHeaderProps {
  selectedWeek: Date;
}

export const WeeklyOverviewHeader: React.FC<WeeklyOverviewHeaderProps> = ({
  selectedWeek
}) => {
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekLabel = format(weekStart, 'MMMM d, yyyy');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile-first header */}
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-primary flex items-center gap-2 sm:gap-3">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-brand-violet flex-shrink-0" />
              <span className="break-words">Weekly Overview</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Resource allocation for the week of {weekLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
