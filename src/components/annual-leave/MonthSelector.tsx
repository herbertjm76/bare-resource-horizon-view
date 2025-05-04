
import React from 'react';
import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthSelectorProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({ 
  selectedMonth, 
  onMonthChange 
}) => {
  const handlePreviousMonth = () => {
    onMonthChange(subMonths(selectedMonth, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(selectedMonth, 1));
  };

  return (
    <div className="flex items-center justify-between py-2 px-4 bg-card rounded-md shadow-sm">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handlePreviousMonth}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous month</span>
      </Button>
      
      <h2 className="text-lg font-semibold">
        {format(selectedMonth, 'MMMM yyyy')}
      </h2>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleNextMonth}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next month</span>
      </Button>
    </div>
  );
};
