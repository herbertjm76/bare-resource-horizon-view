import { useState, useCallback, useMemo } from 'react';
import { format, subWeeks, startOfWeek } from 'date-fns';

export const useProjectResourcingState = () => {
  // Calculate the date one week before the current week (Monday)
  const getCurrentWeekMinus1 = () => {
    const today = new Date();
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 }); // Start on Monday
    return subWeeks(currentWeekStart, 1); // Go back one week
  };

  // Use one week before current week as the default view
  const [selectedMonth, setSelectedMonth] = useState<Date>(getCurrentWeekMinus1());
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filters, setFilters] = useState({
    office: "all",
    country: "all",
    manager: "all",
    periodToShow: 4, // Default is 1 month (4 weeks)
  });
  
  const [displayOptions, setDisplayOptions] = useState({
    showWeekends: false, // Default to not showing weekends
    selectedDays: ['mon', 'tue', 'wed', 'thu', 'fri'], // Default to weekdays only (Monday start)
    weekStartsOnSunday: false // Default: week starts on Monday
  });

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
    // based on the current week start preference
    const weekStartsOn = displayOptions.weekStartsOnSunday ? 0 : 1;
    const weekStart = startOfWeek(date, { weekStartsOn });
    setSelectedMonth(weekStart);
  }, [displayOptions.weekStartsOnSunday]);

  // Calculate the actual start date for the grid based on week start preference
  const gridStartDate = useMemo(() => {
    const weekStartsOn = displayOptions.weekStartsOnSunday ? 0 : 1;
    return startOfWeek(selectedMonth, { weekStartsOn });
  }, [selectedMonth, displayOptions.weekStartsOnSunday]);

  // Format the month label
  const monthLabel = useMemo(() => {
    return format(selectedMonth, 'MMMM yyyy');
  }, [selectedMonth]);

  return {
    selectedMonth,
    gridStartDate, // Add this new property for the grid
    searchTerm,
    filters,
    displayOptions,
    monthLabel,
    handleFilterChange,
    handlePeriodChange,
    handleDisplayOptionChange,
    handleSearchChange,
    handleMonthChange,
    setFilters,
    setSearchTerm,
    setDisplayOptions
  };
};
