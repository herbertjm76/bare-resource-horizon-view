
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addYears, subYears } from 'date-fns';

interface HolidayYearNavigationProps {
  currentYear: Date;
  onYearChange: (year: Date) => void;
}

export const HolidayYearNavigation: React.FC<HolidayYearNavigationProps> = ({
  currentYear,
  onYearChange
}) => {
  const goToPreviousYear = () => {
    onYearChange(subYears(currentYear, 1));
  };

  const goToNextYear = () => {
    onYearChange(addYears(currentYear, 1));
  };

  const goToCurrentYear = () => {
    onYearChange(new Date());
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={goToPreviousYear}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">
          {format(currentYear, 'yyyy')}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={goToCurrentYear}
          className="text-sm text-muted-foreground"
        >
          Current Year
        </Button>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={goToNextYear}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
