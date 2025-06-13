
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
    selectedDays: ['mon', 'tue', 'wed', 'thu', 'fri'], // Default to weekdays only
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
    
    // Ensure weekend toggle and selectedDays stay in sync
    if (option === 'showWeekends') {
      const showWeekends = value as boolean;
      
      if (showWeekends) {
        // Show all days (weekdays + weekends)
        setDisplayOptions(prev => ({
          ...prev,
          selectedDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
        }));
      } else {
        // Show only weekdays
        setDisplayOptions(prev => ({
          ...prev,
          selectedDays: ['mon', 'tue', 'wed', 'thu', 'fri']
        }));
      }
    }
  };
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
  const handleMonthChange = useCallback((date: Date) => {
    // When user selects a date, we need to convert it to the Monday of that week
    // to maintain consistency with our week-based system
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    setSelectedMonth(weekStart);
  }, []);

  // Calculate the actual start date for the grid (should be Monday of selected week)
  const gridStartDate = useMemo(() => {
    return startOfWeek(selectedMonth, { weekStartsOn: 1 });
  }, [selectedMonth]);

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
