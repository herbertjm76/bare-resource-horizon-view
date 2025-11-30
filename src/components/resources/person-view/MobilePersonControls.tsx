import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Expand, Shrink, Download, Settings } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MobilePersonControlsProps {
  startDate: Date;
  onMonthChange: (date: Date) => void;
  periodToShow: number;
  onPeriodChange: (period: number) => void;
  allExpanded: boolean;
  onToggleExpand: () => void;
  totalPeople: number;
}

export const MobilePersonControls: React.FC<MobilePersonControlsProps> = ({
  startDate,
  onMonthChange,
  periodToShow,
  onPeriodChange,
  allExpanded,
  onToggleExpand,
  totalPeople
}) => {
  const handlePreviousMonth = () => {
    onMonthChange(subMonths(startDate, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(startDate, 1));
  };

  // Swipe handlers for month navigation
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNextMonth(),
    onSwipedRight: () => handlePreviousMonth(),
    preventScrollOnSwipe: false,
    trackMouse: false,
    delta: 50
  });

  const monthLabel = format(startDate, 'MMM yyyy');

  const periodOptions = [
    { value: '1', label: '1 Week' },
    { value: '4', label: '1 Month' },
    { value: '8', label: '2 Months' },
    { value: '12', label: '3 Months' },
    { value: '16', label: '4 Months' }
  ];

  return (
    <div className="lg:hidden">
      {/* Compact Header with Month Navigation - No Period Selector */}
      <div {...swipeHandlers} className="bg-card rounded-lg border p-2 mb-2 touch-pan-y">
        <div className="flex items-center justify-between gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePreviousMonth}
            className="h-9 w-9 p-0 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2 flex-1 justify-center">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium text-sm">{monthLabel}</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleNextMonth}
            className="h-9 w-9 p-0 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};