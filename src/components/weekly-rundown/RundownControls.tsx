import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { WeekSelector } from '@/components/weekly-overview/WeekSelector';
import { PlayCircle, PauseCircle, Users, FolderOpen, LayoutGrid, Presentation } from 'lucide-react';
import { RundownMode, SortOption, ViewType } from './WeeklyRundownView';

interface RundownControlsProps {
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
  weekLabel: string;
  rundownMode: RundownMode;
  onModeChange: (mode: RundownMode) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewType: ViewType;
  onViewTypeChange: (view: ViewType) => void;
  isAutoAdvance: boolean;
  onAutoAdvanceToggle: () => void;
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
  viewType,
  onViewTypeChange,
  isAutoAdvance,
  onAutoAdvanceToggle,
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
            variant={rundownMode === 'people' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onModeChange('people')}
            className={`flex items-center gap-2 h-8 ${rundownMode === 'people' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">People</span>
          </Button>
          <Button
            variant={rundownMode === 'projects' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onModeChange('projects')}
            className={`flex items-center gap-2 h-8 ${rundownMode === 'projects' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
          >
            <FolderOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Projects</span>
          </Button>
        </div>

        {/* View type toggle */}
        <div className="flex rounded-lg border p-1 bg-muted">
          <Button
            variant={viewType === 'carousel' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewTypeChange('carousel')}
            className={`flex items-center gap-2 h-8 ${viewType === 'carousel' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
          >
            <Presentation className="h-4 w-4" />
            <span className="hidden sm:inline">Carousel</span>
          </Button>
          <Button
            variant={viewType === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewTypeChange('grid')}
            className={`flex items-center gap-2 h-8 ${viewType === 'grid' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Grid</span>
          </Button>
        </div>

        {/* Sort selector with visual indicator */}
        <div className="flex items-center gap-1.5">
          <Select value={sortOption} onValueChange={onSortChange}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="utilization">Utilization</SelectItem>
              <SelectItem value="location">Location</SelectItem>
              <SelectItem value="department">Department</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Sort Indicator Badge */}
          <Badge 
            variant="default" 
            className="bg-gradient-modern text-white text-xs px-2 py-0.5 h-6 whitespace-nowrap"
          >
            {sortOption === 'alphabetical' && 'A-Z'}
            {sortOption === 'utilization' && '% High→Low'}
            {sortOption === 'location' && 'Location A-Z'}
            {sortOption === 'department' && 'Dept A-Z'}
          </Badge>
        </div>

        {/* Auto-advance toggle - only show for carousel view */}
        {viewType === 'carousel' && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAutoAdvanceToggle}
            className="flex items-center gap-2 h-9"
          >
            {isAutoAdvance ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
            <span className="hidden sm:inline">Auto</span>
          </Button>
        )}


      </div>
    </div>
  );
};