
import { useState, useEffect, useMemo } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { format, startOfWeek } from 'date-fns';

interface WeeklyResourceDataHook {
  members: any[];
  projects: any[];
  memberTotals: Record<string, number>;
  projectTotals: Record<string, number>;
  allocationMap: Map<string, number>;
  weekStartDate: string;
  isLoading: boolean;
  error: string | null;
}

export const useWeeklyResourceData = (
  selectedWeek: Date,
  filters: {
    office: string;
    country: string;
    manager: string;
    searchTerm: string;
  }
): WeeklyResourceDataHook => {
  const { projects, isLoading: projectsLoading } = useProjects();
  const { teamMembers, isLoading: membersLoading } = useTeamMembersData(true);
  const [error, setError] = useState<string | null>(null);

  // Get week start date
  const weekStartDate = format(startOfWeek(selectedWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd');

  // Filter members based on filters
  const filteredMembers = useMemo(() => {
    let filtered = teamMembers;

    if (filters.office !== 'all') {
      filtered = filtered.filter(member => member.location === filters.office);
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(member => 
        `${member.first_name || ''} ${member.last_name || ''}`.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [teamMembers, filters]);

  // Mock allocation data for now
  const allocationMap = useMemo(() => {
    const map = new Map<string, number>();
    
    // Generate some mock allocation data
    filteredMembers.forEach(member => {
      projects.forEach(project => {
        const key = `${member.id}:${project.id}`;
        // Random allocation between 0-20 hours
        const allocation = Math.floor(Math.random() * 21);
        if (allocation > 0) {
          map.set(key, allocation);
        }
      });
    });
    
    return map;
  }, [filteredMembers, projects]);

  // Calculate member totals
  const memberTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    
    filteredMembers.forEach(member => {
      let total = 0;
      projects.forEach(project => {
        const key = `${member.id}:${project.id}`;
        total += allocationMap.get(key) || 0;
      });
      totals[member.id] = total;
    });
    
    return totals;
  }, [filteredMembers, projects, allocationMap]);

  // Calculate project totals
  const projectTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    
    projects.forEach(project => {
      let total = 0;
      filteredMembers.forEach(member => {
        const key = `${member.id}:${project.id}`;
        total += allocationMap.get(key) || 0;
      });
      totals[project.id] = total;
    });
    
    return totals;
  }, [filteredMembers, projects, allocationMap]);

  const isLoading = projectsLoading || membersLoading;

  return {
    members: filteredMembers,
    projects,
    memberTotals,
    projectTotals,
    allocationMap,
    weekStartDate,
    isLoading,
    error
  };
};
