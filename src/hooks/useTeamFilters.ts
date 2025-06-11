
import { useMemo, useState } from 'react';
import { Profile } from '@/components/dashboard/types';

type FilterType = 'all' | 'department' | 'location';

export const useTeamFilters = (allMembers: Profile[]) => {
  // State for active filters
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [filterValue, setFilterValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Get unique departments and locations for filters
  const departments = useMemo(() => {
    const depts = new Set<string>();
    allMembers.forEach(member => {
      if (member.department) depts.add(member.department);
    });
    return Array.from(depts).sort();
  }, [allMembers]);
  
  const locations = useMemo(() => {
    const locs = new Set<string>();
    allMembers.forEach(member => {
      if (member.location) locs.add(member.location);
    });
    return Array.from(locs).sort();
  }, [allMembers]);
  
  // Filter members based on active filters and search query
  const filteredMembers = useMemo(() => {
    return allMembers.filter(member => {
      // Filter by search query
      if (searchQuery) {
        const memberName = `${member.first_name || ''} ${member.last_name || ''}`.toLowerCase();
        const searchLower = searchQuery.toLowerCase();
        
        // Search in name, department, job_title, or location
        if (!memberName.includes(searchLower) && 
            !(member.department && member.department.toLowerCase().includes(searchLower)) &&
            !(member.job_title && member.job_title.toLowerCase().includes(searchLower)) &&
            !(member.location && member.location.toLowerCase().includes(searchLower))) {
          return false;
        }
      }
      
      // Apply department/location filter if active
      if (activeFilter === 'department' && filterValue) {
        return member.department === filterValue;
      } else if (activeFilter === 'location' && filterValue) {
        return member.location === filterValue;
      }
      
      return true;
    });
  }, [allMembers, activeFilter, filterValue, searchQuery]);
  
  // Calculate active filters count for filter button
  const activeFiltersCount = (activeFilter === 'all' ? 0 : 1) + (searchQuery ? 1 : 0);
  
  // Clear all filters
  const clearFilters = () => {
    setActiveFilter('all');
    setFilterValue('');
    setSearchQuery('');
  };
  
  return {
    activeFilter,
    setActiveFilter,
    filterValue,
    setFilterValue,
    searchQuery,
    setSearchQuery,
    departments,
    locations,
    filteredMembers,
    activeFiltersCount,
    clearFilters
  };
};
