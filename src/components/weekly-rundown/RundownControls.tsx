import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { WeekSelector } from '@/components/weekly-overview/WeekSelector';
import { PlayCircle, PauseCircle, Maximize, Minimize, Users, FolderOpen, LayoutGrid, Presentation, Settings } from 'lucide-react';
import { RundownMode, SortOption, ViewType } from './WeeklyRundownView';
import { useCardVisibility } from '@/hooks/useCardVisibility';
import { useCustomCardTypes } from '@/hooks/useCustomCards';
import { ManageCustomCardsDialog } from './ManageCustomCardsDialog';

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
  viewType,
  onViewTypeChange,
  isAutoAdvance,
  onAutoAdvanceToggle,
  isFullscreen,
  onFullscreenToggle,
  currentIndex,
  totalItems
}) => {
  const { visibility, toggleCard } = useCardVisibility();
  const { data: customCardTypes = [] } = useCustomCardTypes();

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

        {/* Card visibility menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Cards</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Visible Cards</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuCheckboxItem 
              checked={visibility.holidays} 
              onCheckedChange={(v) => toggleCard('holidays', v)}
            >
              Holidays
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={visibility.annualLeave} 
              onCheckedChange={(v) => toggleCard('annualLeave', v)}
            >
              Annual Leave
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={visibility.otherLeave} 
              onCheckedChange={(v) => toggleCard('otherLeave', v)}
            >
              Other Leave
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={visibility.notes} 
              onCheckedChange={(v) => toggleCard('notes', v)}
            >
              Notes
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
              checked={visibility.available} 
              onCheckedChange={(v) => toggleCard('available', v)}
            >
              Available This Week
            </DropdownMenuCheckboxItem>
            
            {customCardTypes.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Custom Cards</DropdownMenuLabel>
                {customCardTypes.map(card => (
                  <DropdownMenuCheckboxItem 
                    key={card.id}
                    checked={visibility[`custom_${card.id}`] || false}
                    onCheckedChange={(v) => toggleCard(`custom_${card.id}`, v)}
                  >
                    {card.icon && <span className="mr-2">{card.icon}</span>}
                    {card.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Manage custom cards button */}
        <ManageCustomCardsDialog />

        {/* Sort selector */}
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