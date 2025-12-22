import { useMemo, useState } from 'react';
import { TeamMember } from '@/components/dashboard/types';

export interface TeamFilters {
  practiceArea: string;
  department: string;
  location: string;
  searchTerm: string;
}

export const useTeamFilters = (allMembers: TeamMember[]) => {
  // State for filters matching MemberFilterRow format
  const [filters, setFilters] = useState<TeamFilters>({
    practiceArea: 'all',
    department: 'all',
    location: 'all',
    searchTerm: ''
  });
  
  // Handle filter changes
  const onFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  // Filter members based on active filters
  const filteredMembers = useMemo(() => {
    return allMembers.filter(member => {
      // Filter by search term
      if (filters.searchTerm) {
        const memberName = `${member.first_name || ''} ${member.last_name || ''}`.toLowerCase();
        const searchLower = filters.searchTerm.toLowerCase();
        
        if (!memberName.includes(searchLower) && 
            !(member.department && member.department.toLowerCase().includes(searchLower)) &&
            !(member.job_title && member.job_title.toLowerCase().includes(searchLower)) &&
            !(member.location && member.location.toLowerCase().includes(searchLower))) {
          return false;
        }
      }
      
      // Filter by practice area
      if (filters.practiceArea && filters.practiceArea !== 'all') {
        if (member.practice_area !== filters.practiceArea) return false;
      }
      
      // Filter by department
      if (filters.department && filters.department !== 'all') {
        if (member.department !== filters.department) return false;
      }
      
      // Filter by location
      if (filters.location && filters.location !== 'all') {
        if (member.location !== filters.location) return false;
      }
      
      return true;
    });
  }, [allMembers, filters]);
  
  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.practiceArea && filters.practiceArea !== 'all') count++;
    if (filters.department && filters.department !== 'all') count++;
    if (filters.location && filters.location !== 'all') count++;
    if (filters.searchTerm) count++;
    return count;
  }, [filters]);
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      practiceArea: 'all',
      department: 'all',
      location: 'all',
      searchTerm: ''
    });
  };
  
  return {
    filters,
    onFilterChange,
    filteredMembers,
    activeFiltersCount,
    clearFilters
  };
};
