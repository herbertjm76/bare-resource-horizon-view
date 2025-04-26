
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DatePickerNavigationProps {
  currentMonth: number;
  currentYear: number;
  months: string[];
  years: number[];
  onMonthChange: (index: number) => void;
  onYearChange: (year: number) => void;
  onNavigateMonth: (direction: 'prev' | 'next') => void;
}

export const DatePickerNavigation = ({
  currentMonth,
  currentYear,
  months,
  years,
  onMonthChange,
  onYearChange,
  onNavigateMonth
}: DatePickerNavigationProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => onNavigateMonth('prev')}
        type="button"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex gap-2">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="h-8 px-2 min-w-[100px]"
              type="button"
            >
              {months[currentMonth]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            className="max-h-[300px] overflow-y-auto z-[60]"
          >
            {months.map((month, index) => (
              <DropdownMenuItem 
                key={month} 
                onSelect={() => onMonthChange(index)}
                className={cn(
                  "cursor-pointer",
                  currentMonth === index && "bg-accent text-accent-foreground"
                )}
              >
                {month}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="h-8 px-2 min-w-[70px]"
              type="button"
            >
              {currentYear}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            className="max-h-[300px] overflow-y-auto z-[60]"
          >
            {years.map((year) => (
              <DropdownMenuItem 
                key={year} 
                onSelect={() => onYearChange(year)}
                className={cn(
                  "cursor-pointer",
                  currentYear === year && "bg-accent text-accent-foreground"
                )}
              >
                {year}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => onNavigateMonth('next')}
        type="button"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
