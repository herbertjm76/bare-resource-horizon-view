
import { useState, useCallback, useMemo } from 'react';
import { format } from 'date-fns';

export const useProjectResourcingState = () => {
  // Use the current month as the default view
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filters, setFilters] = useState({
    office: "all",
    country: "all",
    manager: "all",
    periodToShow: 12, // Default is 12 weeks
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
        // Add weekend days if they're not already in the list
        setDisplayOptions(prev => {
          const updatedDays = [...prev.selectedDays];
          if (!updatedDays.includes('sat')) updatedDays.push('sat');
          if (!updatedDays.includes('sun')) updatedDays.push('sun');
          
          return {
            ...prev,
            selectedDays: updatedDays
          };
        });
      } else {
        // Remove weekend days from the selectedDays
        setDisplayOptions(prev => ({
          ...prev,
          selectedDays: prev.selectedDays.filter(day => day !== 'sat' && day !== 'sun')
        }));
      }
    }
  };
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  
  const handleMonthChange = useCallback((date: Date) => {
    setSelectedMonth(date);
  }, []);

  // Format the month label
  const monthLabel = useMemo(() => {
    return format(selectedMonth, 'MMMM yyyy');
  }, [selectedMonth]);

  return {
    selectedMonth,
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
