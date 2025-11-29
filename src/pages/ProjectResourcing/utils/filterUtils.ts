
export const calculateActiveFiltersCount = (
  filters: { office: string; country: string; manager: string; status: string },
  searchTerm: string,
  displayOptions: { showWeekends: boolean; selectedDays: string[]; weekStartsOnSunday: boolean }
) => {
  return (
    (filters.office !== 'all' ? 1 : 0) + 
    (filters.country !== 'all' ? 1 : 0) + 
    (filters.manager !== 'all' ? 1 : 0) +
    (filters.status !== 'all' && filters.status !== 'Active' ? 1 : 0) + // Don't count default Active status
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
      status: "Active", // Reset to Active as default
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
