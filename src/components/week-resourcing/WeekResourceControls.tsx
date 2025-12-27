
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Calendar, Filter, RotateCcw, LayoutGrid, LayoutList, FileDown, ChevronDown, FileText } from 'lucide-react';
import { addWeeks, subWeeks, format, startOfWeek, addDays, isToday, isSameWeek } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { FilterButton } from '@/components/resources/filters/FilterButton';
import { AdvancedFilters } from '@/components/resources/filters/AdvancedFilters';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { utils, writeFile } from 'xlsx';
import { exportToPDF } from '../weekly-overview/utils/exportToPDF';

interface WeekResourceControlsProps {
  selectedWeek: Date;
  setSelectedWeek: (date: Date) => void;
  weekLabel: string;
  filters: {
    office: string;
    searchTerm: string;
  };
  onFilterChange: (key: string, value: string) => void;
  viewMode?: 'compact' | 'expanded';
  onViewModeChange?: (mode: 'compact' | 'expanded') => void;
}

export const WeekResourceControls: React.FC<WeekResourceControlsProps> = ({
  selectedWeek,
  setSelectedWeek,
  weekLabel,
  filters,
  onFilterChange,
  viewMode = 'compact',
  onViewModeChange
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const handlePreviousWeek = () => {
    setSelectedWeek(subWeeks(selectedWeek, 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek(addWeeks(selectedWeek, 1));
  };

  const handleCurrentWeek = () => {
    const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    setSelectedWeek(currentWeek);
  };

  // Check if current week is selected
  const isCurrentWeek = isSameWeek(selectedWeek, new Date(), { weekStartsOn: 1 });

  // Generate a list of weeks (12 previous, current, 12 next for better range)
  const weekOptions = Array.from({ length: 25 }, (_, i) => {
    const weekDate = subWeeks(selectedWeek, 12 - i);
    const mondayOfWeek = startOfWeek(weekDate, { weekStartsOn: 1 });
    const sundayOfWeek = addDays(mondayOfWeek, 6);
    const label = `${format(mondayOfWeek, 'MMM d')} - ${format(sundayOfWeek, 'MMM d, yyyy')}`;
    const isCurrentOption = isSameWeek(mondayOfWeek, new Date(), { weekStartsOn: 1 });
    
    return {
      value: mondayOfWeek.toISOString(),
      label: label,
      isCurrent: isCurrentOption,
      isSelected: i === 12
    };
  });

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(val => 
    val !== '' && val !== 'all'
  ).length;

  // Mock options for filters
  const officeOptions = ['London', 'New York', 'Singapore', 'Tokyo', 'Paris'];
  const countryOptions = ['UK', 'USA', 'Singapore', 'Japan', 'France'];
  const managerOptions = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Jane Doe' },
    { id: '3', name: 'Alex Johnson' }
  ];

  // Format the selected week range for display
  const mondayOfSelected = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const sundayOfSelected = addDays(mondayOfSelected, 6);
  const weekRangeDisplay = `${format(mondayOfSelected, 'MMM d')} - ${format(sundayOfSelected, 'MMM d')}`;

  // Export functions
  const handleExportToExcel = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      try {
        // Get the table element (supporting both class names for flexibility)
        const table = document.querySelector('.resource-table-compact, .resource-table-expanded, .enhanced-weekly-table');
        
        if (!table) {
          toast.error('Could not find table data');
          setIsExporting(false);
          return;
        }
        
        // Create worksheet from table
        const ws = utils.table_to_sheet(table);
        
        // Create workbook and add worksheet
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Weekly Resource Planning');
        
        // Generate file name
        const fileName = `Weekly_Resource_Planning_${weekLabel.replace(/\s+/g, '_')}.xlsx`;
        
        // Write file and trigger download
        writeFile(wb, fileName);
        
        // Show success message
        toast.success('Export successful', { 
          description: `Exported to ${fileName}` 
        });
      } catch (error) {
        console.error('Export failed:', error);
        toast.error('Export failed', { 
          description: 'An error occurred while exporting the data.'
        });
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };

  const handleExportToPDF = async () => {
    setIsExporting(true);
    
    try {
      await exportToPDF(selectedWeek, weekLabel);
      toast.success('PDF Export successful', { 
        description: `Weekly resource planning exported to PDF`
      });
    } catch (error) {
      console.error('PDF Export failed:', error);
      toast.error('PDF Export failed', { 
        description: 'An error occurred while exporting to PDF.'
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-3">
      {/* Enhanced week navigation */}
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Week navigation - improved design */}
        <div className="flex items-center bg-background border border-border rounded-lg shadow-sm overflow-hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handlePreviousWeek} 
            className="h-9 px-3 rounded-none border-r hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous week</span>
          </Button>
          
          {/* Week selector dropdown */}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 px-3 py-2 h-9 rounded-none border-r hover:bg-gray-50 min-w-0 text-sm font-medium"
              >
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {format(selectedWeek, 'yyyy')}
                  </span>
                  <span className="font-medium truncate max-w-[120px] sm:max-w-none">
                    {weekRangeDisplay}
                  </span>
                </div>
                {isCurrentWeek && (
                  <Badge className="ml-1 bg-green-100 text-green-700 text-xs px-1.5 py-0.5 h-auto">
                    Current
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 border-b">
                <h4 className="font-medium text-sm mb-2">Select Week</h4>
                <CalendarComponent
                  mode="single"
                  selected={selectedWeek}
                  onSelect={(date) => {
                    if (date) {
                      const mondayOfWeek = startOfWeek(date, { weekStartsOn: 1 });
                      setSelectedWeek(mondayOfWeek);
                      setCalendarOpen(false);
                    }
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </div>
              <div className="p-3">
                <Select 
                  value={selectedWeek.toISOString()}
                  onValueChange={(value) => {
                    setSelectedWeek(new Date(value));
                    setCalendarOpen(false);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select week" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {weekOptions.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className={option.isCurrent ? "font-bold bg-green-50" : ""}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{option.label}</span>
                          {option.isCurrent && (
                            <Badge className="ml-2 bg-green-500 text-white text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>

          {/* Current week button */}
          {!isCurrentWeek && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCurrentWeek}
              className="h-9 px-3 rounded-none border-r hover:bg-green-50 text-green-600 transition-colors"
              title="Go to current week"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="sr-only">Current week</span>
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleNextWeek}
            className="h-9 px-3 rounded-none hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next week</span>
          </Button>
        </div>
        
        {/* Filter controls, view toggle, and export */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* View Mode Toggle */}
          {onViewModeChange && (
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(value) => value && onViewModeChange(value as 'compact' | 'expanded')}
              className="bg-background border border-border rounded-lg shadow-sm overflow-hidden"
            >
              <ToggleGroupItem 
                value="compact" 
                aria-label="Compact view"
                className="h-9 px-3 data-[state=on]:bg-gray-100 data-[state=on]:text-gray-900"
              >
                <LayoutList className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Compact</span>
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="expanded" 
                aria-label="Expanded view"
                className="h-9 px-3 data-[state=on]:bg-gray-100 data-[state=on]:text-gray-900"
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Expanded</span>
              </ToggleGroupItem>
            </ToggleGroup>
          )}

          <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 h-9 px-3 bg-background border-border shadow-sm hover:bg-accent transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden xs:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-theme-primary/10 text-theme-primary border-0 ml-0.5">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <AdvancedFilters
                filters={{
                  office: filters.office,
                  country: 'all',
                  manager: 'all',
                }}
                onFilterChange={onFilterChange}
                officeOptions={officeOptions}
                countryOptions={countryOptions}
                managerOptions={managerOptions}
                onClose={() => setFiltersOpen(false)}
                show={true}
              />
            </PopoverContent>
          </Popover>

          {/* Export dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="px-4 flex items-center gap-1" disabled={isExporting}>
                <FileDown className="h-4 w-4 mr-1" />
                <span>{isExporting ? 'Exporting...' : 'Export'}</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem 
                onClick={handleExportToPDF}
                disabled={isExporting}
                className="cursor-pointer"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export to PDF
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleExportToExcel}
                disabled={isExporting}
                className="cursor-pointer"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handlePrint}
                className="cursor-pointer"
              >
                Print View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Clear filters - enhanced visibility */}
          {activeFilterCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                onFilterChange('office', 'all');
                onFilterChange('searchTerm', '');
              }}
              className="h-9 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-50 px-3"
            >
              Clear ({activeFilterCount})
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile week label - enhanced display */}
      <div className="sm:hidden bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {weekLabel}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(selectedWeek, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          {isCurrentWeek && (
            <Badge className="bg-green-100 text-green-700">
              Current Week
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
