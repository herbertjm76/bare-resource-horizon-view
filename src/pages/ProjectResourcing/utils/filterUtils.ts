
export const calculateActiveFiltersCount = (
  filters: { office: string; country: string; manager: string },
  searchTerm: string,
  displayOptions: { showWeekends: boolean; selectedDays: string[]; weekStartsOnSunday: boolean }
) => {
  return (
    (filters.office !== 'all' ? 1 : 0) + 
    (filters.country !== 'all' ? 1 : 0) + 
    (filters.manager !== 'all' ? 1 : 0) +
    (searchTerm ? 1 : 0) +
    (displayOptions.showWeekends ? 1 : 0) +
    (displayOptions.selectedDays.length < 5 ? 1 : 0) +
    (displayOptions.weekStartsOnSunday ? 1 : 0)
  );
};

export const createClearFiltersFunction = (
  setFilters: Function,
  setSearchTerm: Function,
  setDisplayOptions: Function,
  currentPeriod: number
) => {
  return () => {
    setFilters({
      office: "all",
      country: "all",
      manager: "all",
      periodToShow: currentPeriod // Keep the period setting
    });
    setSearchTerm('');
    setDisplayOptions({
      showWeekends: false,
      selectedDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
      weekStartsOnSunday: false
    });
  };
};
