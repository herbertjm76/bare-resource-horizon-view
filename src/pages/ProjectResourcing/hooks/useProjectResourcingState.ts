import { useState, useCallback, useMemo, useEffect } from 'react';
import { format, startOfWeek } from 'date-fns';
import { useAppSettings, WeekStartDay } from '@/hooks/useAppSettings';

const SORT_PREFERENCES_KEY = 'project-sort-preferences';

// Helper to convert WeekStartDay to date-fns weekStartsOn value
const getWeekStartsOn = (weekStartDay: WeekStartDay): 0 | 1 | 6 => {
  return weekStartDay === 'Sunday' ? 0 : weekStartDay === 'Saturday' ? 6 : 1;
};

export const useProjectResourcingState = () => {
  const { startOfWorkWeek } = useAppSettings();
  
  // Derive weekStartsOnSunday from company settings - single source of truth
  const weekStartsOnSundayFromSettings = startOfWorkWeek === 'Sunday';
  
  // Calculate the start of the current week based on company settings
  const getCurrentWeekStart = useCallback(() => {
    const today = new Date();
    return startOfWeek(today, { weekStartsOn: getWeekStartsOn(startOfWorkWeek) });
  }, [startOfWorkWeek]);

  // Load sort preferences from localStorage
  const loadSortPreferences = () => {
    try {
      const stored = localStorage.getItem(SORT_PREFERENCES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading sort preferences:', error);
    }
    return { sortBy: 'created', sortDirection: 'asc' };
  };

  const initialPreferences = loadSortPreferences();

  // Use current week as the default view
  const [selectedMonth, setSelectedMonth] = useState<Date>(getCurrentWeekStart());
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filters, setFilters] = useState({
    office: "all",
    country: "all",
    manager: "all",
    status: "Active", // Default to Active projects only
    periodToShow: 4, // Default is 1 month (4 weeks)
  });

  const [sortBy, setSortBy] = useState<'name' | 'code' | 'status' | 'created'>(initialPreferences.sortBy);

  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialPreferences.sortDirection);
  
  // Initialize displayOptions using company settings as default
  const [displayOptions, setDisplayOptions] = useState(() => ({
    showWeekends: false,
    selectedDays: weekStartsOnSundayFromSettings 
      ? ['sun', 'mon', 'tue', 'wed', 'thu'] 
      : ['mon', 'tue', 'wed', 'thu', 'fri'],
    weekStartsOnSunday: weekStartsOnSundayFromSettings
  }));
  
  // Keep weekStartsOnSunday in sync if company setting changes
  useEffect(() => {
    setDisplayOptions(prev => {
      if (prev.weekStartsOnSunday !== weekStartsOnSundayFromSettings) {
        const newSelectedDays = prev.showWeekends
          ? ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
          : weekStartsOnSundayFromSettings
            ? ['sun', 'mon', 'tue', 'wed', 'thu']
            : ['mon', 'tue', 'wed', 'thu', 'fri'];
        return {
          ...prev,
          weekStartsOnSunday: weekStartsOnSundayFromSettings,
          selectedDays: newSelectedDays
        };
      }
      return prev;
    });
  }, [weekStartsOnSundayFromSettings]);

  // Save sort preferences to localStorage whenever they change
  useEffect(() => {
    try {
      const preferences = { sortBy, sortDirection };
      localStorage.setItem(SORT_PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving sort preferences:', error);
    }
  }, [sortBy, sortDirection]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handlePeriodChange = (period: number) => {
    setFilters(prev => ({
      ...prev,
      periodToShow: period
    }));
  };
  
  const handleDisplayOptionChange = (option: string, value: boolean | string[]) => {
    setDisplayOptions(prev => ({
      ...prev,
      [option]: value
    }));
    
    // Handle special cases for week start and weekend changes
    if (option === 'showWeekends') {
      const showWeekends = value as boolean;
      const currentWeekStartsOnSunday = displayOptions.weekStartsOnSunday;
      
      if (showWeekends) {
        // Show all days
        setDisplayOptions(prev => ({
          ...prev,
          selectedDays: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
        }));
      } else {
        // Show only weekdays based on current week start preference
        if (currentWeekStartsOnSunday) {
          // Sunday start: weekdays are Sun, Mon, Tue, Wed, Thu
          setDisplayOptions(prev => ({
            ...prev,
            selectedDays: ['sun', 'mon', 'tue', 'wed', 'thu']
          }));
        } else {
          // Monday start: weekdays are Mon, Tue, Wed, Thu, Fri
          setDisplayOptions(prev => ({
            ...prev,
            selectedDays: ['mon', 'tue', 'wed', 'thu', 'fri']
          }));
        }
      }
    }
    
    if (option === 'weekStartsOnSunday') {
      const startsOnSunday = value as boolean;
      const currentShowWeekends = displayOptions.showWeekends;
      
      if (currentShowWeekends) {
        // If showing weekends, keep all days
        setDisplayOptions(prev => ({
          ...prev,
          selectedDays: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
        }));
      } else {
        // Update weekdays based on new week start preference
        if (startsOnSunday) {
          // Sunday start: weekdays are Sun, Mon, Tue, Wed, Thu
          setDisplayOptions(prev => ({
            ...prev,
            selectedDays: ['sun', 'mon', 'tue', 'wed', 'thu']
          }));
        } else {
          // Monday start: weekdays are Mon, Tue, Wed, Thu, Fri
          setDisplayOptions(prev => ({
            ...prev,
            selectedDays: ['mon', 'tue', 'wed', 'thu', 'fri']
          }));
        }
      }
    }
  };
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
  const handleMonthChange = useCallback((date: Date) => {
    // When user selects a date, we need to convert it to the start of that week
    // based on the company's work week start preference
    const weekStartsOn = getWeekStartsOn(startOfWorkWeek);
    const weekStart = startOfWeek(date, { weekStartsOn });
    setSelectedMonth(weekStart);
  }, [startOfWorkWeek]);

  // Calculate the actual start date for the grid based on company work week preference
  const gridStartDate = useMemo(() => {
    const weekStartsOn = getWeekStartsOn(startOfWorkWeek);
    return startOfWeek(selectedMonth, { weekStartsOn });
  }, [selectedMonth, startOfWorkWeek]);

  // Format the month label
  const monthLabel = useMemo(() => {
    return format(selectedMonth, 'MMMM yyyy');
  }, [selectedMonth]);

  const handleSortChange = (value: 'name' | 'code' | 'status' | 'created') => {
    setSortBy(value);
  };

  const handleSortDirectionToggle = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return {
    selectedMonth,
    gridStartDate, // Add this new property for the grid
    searchTerm,
    filters,
    displayOptions,
    sortBy,
    sortDirection,
    monthLabel,
    handleFilterChange,
    handlePeriodChange,
    handleDisplayOptionChange,
    handleSearchChange,
    handleMonthChange,
    handleSortChange,
    handleSortDirectionToggle,
    setFilters,
    setSearchTerm,
    setDisplayOptions
  };
};
