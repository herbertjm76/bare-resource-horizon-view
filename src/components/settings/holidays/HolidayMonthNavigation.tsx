
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';

interface HolidayMonthNavigationProps {
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
}

export const HolidayMonthNavigation: React.FC<HolidayMonthNavigationProps> = ({
  currentMonth,
  onMonthChange
}) => {
  const goToPreviousMonth = () => {
    onMonthChange(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1));
  };

  const goToCurrentMonth = () => {
    onMonthChange(new Date());
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={goToPreviousMonth}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={goToCurrentMonth}
          className="text-sm text-muted-foreground"
        >
          Today
        </Button>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={goToNextMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
