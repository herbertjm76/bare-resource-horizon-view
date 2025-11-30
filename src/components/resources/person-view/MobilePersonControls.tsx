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
      {/* Month Navigation - Swipeable */}
      <div {...swipeHandlers} className="bg-card rounded-lg border p-3 mb-3 touch-pan-y">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="lg"
            onClick={handlePreviousMonth}
            className="h-11 w-11 p-0 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2 flex-1 justify-center">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-base">{monthLabel}</span>
          </div>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleNextMonth}
            className="h-11 w-11 p-0 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="text-xs text-center text-muted-foreground mt-2">
          Swipe left or right to change month
        </div>
      </div>

      {/* Quick Controls */}
      <div className="bg-card rounded-lg border p-3 mb-3">
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Period Selector */}
          <Select 
            value={periodToShow.toString()}
            onValueChange={(value) => onPeriodChange(parseInt(value, 10))}
          >
            <SelectTrigger className="h-11 text-sm bg-muted border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Expand/Collapse */}
          <Button
            variant="outline"
            size="lg"
            onClick={onToggleExpand}
            className="h-11 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all active:scale-95"
            disabled={totalPeople === 0}
          >
            {allExpanded ? (
              <>
                <Shrink className="h-4 w-4 mr-2" />
                <span>Collapse</span>
              </>
            ) : (
              <>
                <Expand className="h-4 w-4 mr-2" />
                <span>Expand</span>
              </>
            )}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="lg"
            className="h-11 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all active:scale-95"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="h-11 bg-muted hover:bg-gradient-modern hover:text-white hover:border-transparent transition-all active:scale-95"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};