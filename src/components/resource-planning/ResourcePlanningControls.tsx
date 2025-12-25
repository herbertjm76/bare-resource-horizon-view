import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addWeeks, subWeeks, format, startOfWeek } from 'date-fns';

interface ResourcePlanningControlsProps {
  selectedWeeks: number;
  onWeeksChange: (weeks: number) => void;
  startDate: Date;
  onStartDateChange: (date: Date) => void;
}

export const ResourcePlanningControls: React.FC<ResourcePlanningControlsProps> = ({
  selectedWeeks,
  onWeeksChange,
  startDate,
  onStartDateChange
}) => {
  const handlePrevious = () => {
    onStartDateChange(subWeeks(startDate, selectedWeeks));
  };

  const handleNext = () => {
    onStartDateChange(addWeeks(startDate, selectedWeeks));
  };

  const handleToday = () => {
    onStartDateChange(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const endDate = addWeeks(startDate, selectedWeeks - 1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Date Navigation */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handlePrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={handleToday}>
          Today
        </Button>
        <Button variant="outline" size="sm" onClick={handleNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground ml-2">
          {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
        </span>
      </div>

      {/* Weeks Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Show:</span>
        <Select value={String(selectedWeeks)} onValueChange={(v) => onWeeksChange(Number(v))}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4">4 weeks</SelectItem>
            <SelectItem value="8">8 weeks</SelectItem>
            <SelectItem value="12">12 weeks</SelectItem>
            <SelectItem value="16">16 weeks</SelectItem>
            <SelectItem value="24">24 weeks</SelectItem>
            <SelectItem value="52">52 weeks</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
