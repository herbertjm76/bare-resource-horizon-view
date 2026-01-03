
import React from 'react';
import { format, startOfWeek } from 'date-fns';
import { Calendar, Maximize, Minimize } from 'lucide-react';
import { useAppSettings, WeekStartDay } from '@/hooks/useAppSettings';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const getWeekStartsOn = (weekStartDay: WeekStartDay): 0 | 1 | 6 => {
  return weekStartDay === 'Sunday' ? 0 : weekStartDay === 'Saturday' ? 6 : 1;
};

interface WeeklyOverviewHeaderProps {
  selectedWeek: Date;
  isFullscreen?: boolean;
  onFullscreenToggle?: () => void;
}

export const WeeklyOverviewHeader: React.FC<WeeklyOverviewHeaderProps> = ({
  selectedWeek,
  isFullscreen,
  onFullscreenToggle
}) => {
  const { startOfWorkWeek } = useAppSettings();
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: getWeekStartsOn(startOfWorkWeek) });
  const weekLabel = format(weekStart, 'MMMM d, yyyy');

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 py-2">
      {/* Left side: Icon, Title, Description */}
      <div className="flex items-center gap-2 min-w-0">
        <Calendar className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-theme-primary" />
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-foreground truncate">
          Weekly Overview
        </h1>
        <span className="text-muted-foreground hidden sm:inline">•</span>
        <p className="text-sm text-muted-foreground hidden sm:block truncate">
          Week of {weekLabel}
        </p>
      </div>

      {/* Right side: Fullscreen toggle */}
      {typeof window !== 'undefined' && window.innerWidth >= 768 && onFullscreenToggle && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onFullscreenToggle}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
