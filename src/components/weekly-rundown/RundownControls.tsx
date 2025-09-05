import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WeekSelector } from '@/components/weekly-overview/WeekSelector';
import { PlayCircle, PauseCircle, Maximize, Minimize, Users, FolderOpen } from 'lucide-react';
import { RundownMode, SortOption } from './WeeklyRundownView';

interface RundownControlsProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
  weekLabel: string;
  rundownMode: RundownMode;
  onModeChange: (mode: RundownMode) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  isAutoAdvance: boolean;
  onAutoAdvanceToggle: () => void;
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
  currentIndex: number;
  totalItems: number;
}

export const RundownControls: React.FC<RundownControlsProps> = ({
  selectedWeek,
  onWeekChange,
  weekLabel,
  rundownMode,
  onModeChange,
  sortOption,
  onSortChange,
  isAutoAdvance,
  onAutoAdvanceToggle,
  isFullscreen,
  onFullscreenToggle,
  currentIndex,
  totalItems
}) => {
  const onPreviousWeek = () => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() - 7);
    onWeekChange(newDate);
  };

  const onNextWeek = () => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + 7);
    onWeekChange(newDate);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between bg-card rounded-lg border p-4">
      {/* Left section - Week selector and progress */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <WeekSelector
          selectedWeek={selectedWeek}
          onPreviousWeek={onPreviousWeek}
          onNextWeek={onNextWeek}
          weekLabel={weekLabel}
        />
        
        {totalItems > 0 && (
          <div className="text-sm text-muted-foreground">
            {rundownMode === 'people' ? 'Person' : 'Project'} {currentIndex + 1} of {totalItems}
          </div>
        )}
      </div>

      {/* Right section - Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        {/* Mode toggle */}
        <div className="flex rounded-lg border p-1 bg-muted">
          <Button
            variant={rundownMode === 'people' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onModeChange('people')}
            className="flex items-center gap-2 h-8"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">People</span>
          </Button>
          <Button
            variant={rundownMode === 'projects' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onModeChange('projects')}
            className="flex items-center gap-2 h-8"
          >
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Projects</span>
          </Button>
        </div>

        {/* Sort selector */}
        <Select value={sortOption} onValueChange={onSortChange}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
            <SelectItem value="utilization">Utilization</SelectItem>
            <SelectItem value="location">Location</SelectItem>
          </SelectContent>
        </Select>

        {/* Auto-advance toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={onAutoAdvanceToggle}
          className="flex items-center gap-2 h-9"
        >
          {isAutoAdvance ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
          <span className="hidden sm:inline">Auto</span>
        </Button>

        {/* Fullscreen toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={onFullscreenToggle}
          className="h-9 w-9 p-0"
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};