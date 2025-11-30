import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { MemberAvailabilityCard } from './MemberAvailabilityCard';
import { MemberVacationPopover } from './MemberVacationPopover';
import { MemberFilterTabs } from './MemberFilterTabs';
import { MemberSearchSort, SortOption } from './MemberSearchSort';
import { VirtualizedMemberList } from './VirtualizedMemberList';
import { UtilizationZone, ZoneCounts, AvailableMember as SharedAvailableMember, ProjectAllocation } from '@/types/weekly-overview';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AvailableMembersRowProps {
  weekStartDate: string;
  threshold?: number;
  filters?: {
    practiceArea: string;
    department: string;
    location: string;
    searchTerm: string;
  };
}

export const AvailableMembersRow: React.FC<AvailableMembersRowProps> = ({
  weekStartDate,
  threshold = 80,
  filters
}) => {
  const membersScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const [activeZone, setActiveZone] = React.useState<UtilizationZone>('needs-attention');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortBy, setSortBy] = React.useState<SortOption>('available-hours');

  const { data: profiles = [] } = useQuery({
    queryKey: ['available-members-profiles'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, weekly_capacity, department, practice_area, location');
      if (error) throw error;
      return data || [];
    },
    staleTime: 60_000,
  });

  const { data: invites = [] } = useQuery({
    queryKey: ['available-members-invites'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];
      const { data, error } = await supabase
        .from('invites')
        .select('id, first_name, last_name, avatar_url, weekly_capacity, department, practice_area, location')
        .eq('invitation_type', 'pre_registered')
        .eq('status', 'pending');
      if (error) throw error;
      return data || [];
    },
    staleTime: 60_000,
  });

  const { data: allocations = [] } = useQuery({
    queryKey: ['available-allocations', weekStartDate],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];
      
      // Calculate the full week range (Monday to Sunday)
      const weekStart = new Date(weekStartDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const weekEndDate = weekEnd.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select(`
          resource_id, 
          resource_type, 
          hours,
          allocation_date,
          projects:project_id (
            id,
            name,
            code,
            department
          )
        `)
        .gte('allocation_date', weekStartDate)
        .lte('allocation_date', weekEndDate);
      if (error) throw error;
      return data || [];
    },
    staleTime: 60_000,
  });

  const availableMembers: SharedAvailableMember[] = React.useMemo(() => {
    const allMembers = [
      ...profiles.map(p => ({
        id: p.id,
        firstName: p.first_name || '',
        lastName: p.last_name || '',
        avatarUrl: p.avatar_url,
        capacity: p.weekly_capacity || 40,
        department: p.department || undefined,
        practiceArea: p.practice_area || undefined,
        location: p.location || undefined,
        memberType: 'active' as const
      })),
      ...invites.map(i => ({
        id: i.id,
        firstName: i.first_name || '',
        lastName: i.last_name || '',
        avatarUrl: i.avatar_url,
        capacity: i.weekly_capacity || 40,
        department: i.department || undefined,
        practiceArea: i.practice_area || undefined,
        location: i.location || undefined,
        memberType: 'pre_registered' as const
      }))
    ];

    const allocationMap = new Map<string, number>();
    const memberSectorsMap = new Map<string, Set<string>>();
    const memberProjectsMap = new Map<string, Map<string, { name: string; code: string; hours: number }>>();
    
    allocations.forEach(alloc => {
      const key = alloc.resource_id;
      const current = allocationMap.get(key) || 0;
      allocationMap.set(key, current + Number(alloc.hours));
      
      // Track sectors (project departments) for each member
      if (alloc.projects?.department) {
        if (!memberSectorsMap.has(key)) {
          memberSectorsMap.set(key, new Set());
        }
        memberSectorsMap.get(key)!.add(alloc.projects.department);
      }
      
      // Track project allocations for each member
      if (alloc.projects) {
        if (!memberProjectsMap.has(key)) {
          memberProjectsMap.set(key, new Map());
        }
        const projectsMap = memberProjectsMap.get(key)!;
        const projectId = alloc.projects.id;
        
        if (projectsMap.has(projectId)) {
          const existing = projectsMap.get(projectId)!;
          existing.hours += Number(alloc.hours);
        } else {
          projectsMap.set(projectId, {
            name: alloc.projects.name,
            code: alloc.projects.code || alloc.projects.name,
            hours: Number(alloc.hours)
          });
        }
      }
    });

    const available = allMembers
      .map(member => {
        const key = member.id;
        const allocatedHours = allocationMap.get(key) || 0;
        const availableHours = member.capacity - allocatedHours;
        const utilization = (allocatedHours / member.capacity) * 100;
        const sectors = Array.from(memberSectorsMap.get(key) || []);
        
        // Get project allocations
        const projectsMap = memberProjectsMap.get(key);
        const projectAllocations: ProjectAllocation[] = projectsMap 
          ? Array.from(projectsMap.entries()).map(([projectId, data]) => ({
              projectId,
              projectName: data.name,
              projectCode: data.code,
              hours: data.hours
            }))
          : [];

        return {
          id: member.id,
          memberType: member.memberType,
          firstName: member.firstName,
          lastName: member.lastName,
          avatarUrl: member.avatarUrl,
          availableHours,
          allocatedHours,
          utilization,
          weeklyCapacity: member.capacity,
          department: member.department || null,
          practiceArea: member.practiceArea || null,
          location: member.location || '',
          sectors,
          projectAllocations
        };
      })
      .filter(member => {
        // Apply filters
        if (!filters) return true;

        // Practice Area filter (from project allocations)
        if (filters.practiceArea && filters.practiceArea !== 'all') {
          if (!member.sectors.includes(filters.practiceArea)) return false;
        }

        // Department filter
        if (filters.department && filters.department !== 'all') {
          if (member.department !== filters.department) return false;
        }

        // Location filter - we don't have location in this data, so skip
        // Search term filter
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
          if (!fullName.includes(searchLower)) return false;
        }

        return true;
      });

    return available;
  }, [profiles, invites, allocations, threshold, filters]);

  // Apply local search and sort
  const searchedAndSortedMembers = React.useMemo(() => {
    let result = [...availableMembers];

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(member => {
        const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
        return fullName.includes(searchLower);
      });
    }

    // Apply sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB);
        case 'utilization':
          return b.utilization - a.utilization;
        case 'available-hours':
          return b.availableHours - a.availableHours;
        default:
          return 0;
      }
    });

    return result;
  }, [availableMembers, searchTerm, sortBy]);

  // Calculate zone counts
  const zoneCounts: ZoneCounts = React.useMemo(() => {
    return {
      'needs-attention': searchedAndSortedMembers.filter(m => m.utilization > 100 || m.utilization < 60).length,
      'available': searchedAndSortedMembers.filter(m => m.utilization < threshold).length,
      'at-capacity': searchedAndSortedMembers.filter(m => m.utilization >= threshold && m.utilization <= 100).length,
      'over-allocated': searchedAndSortedMembers.filter(m => m.utilization > 100).length,
      'all': searchedAndSortedMembers.length,
    };
  }, [searchedAndSortedMembers, threshold]);

  // Apply zone filtering
  const filteredMembers = React.useMemo(() => {
    if (activeZone === 'all') return searchedAndSortedMembers;
    
    return searchedAndSortedMembers.filter(m => {
      const util = m.utilization;
      switch (activeZone) {
        case 'needs-attention':
          return util > 100 || util < 60;
        case 'available':
          return util < threshold;
        case 'at-capacity':
          return util >= threshold && util <= 100;
        case 'over-allocated':
          return util > 100;
        default:
          return true;
      }
    });
  }, [searchedAndSortedMembers, activeZone, threshold]);

  // Check scroll position for arrows
  const checkScrollPosition = React.useCallback(() => {
    const container = membersScrollRef.current;
    if (!container) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  React.useEffect(() => {
    const container = membersScrollRef.current;
    if (!container) return;

    checkScrollPosition();
    container.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [checkScrollPosition, filteredMembers]);

  const scrollMembers = (direction: 'left' | 'right') => {
    const container = membersScrollRef.current;
    if (!container) return;
    
    const scrollAmount = 200;
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  return (
    <div className="w-full space-y-4">
      {/* Search and Sort */}
      <MemberSearchSort
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Filter Tabs */}
      <MemberFilterTabs
        activeZone={activeZone}
        onZoneChange={setActiveZone}
        zoneCounts={zoneCounts}
      />

      {/* Member List Container */}
      <div className="rounded-lg border bg-card p-4 animate-fade-in relative shadow-[0_4px_8px_-2px_hsl(var(--border))]">
        {/* Members Avatars - Virtualized with Arrow Navigation */}
        {filteredMembers.length > 0 && (
          <div className="hidden sm:block relative">
            {/* Left Arrow */}
            {canScrollLeft && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-8 w-8 bg-background/95 backdrop-blur-sm shadow-lg hover:scale-110 transition-all"
                onClick={() => scrollMembers('left')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            
            {/* Right Arrow */}
            {canScrollRight && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-8 w-8 bg-background/95 backdrop-blur-sm shadow-lg hover:scale-110 transition-all"
                onClick={() => scrollMembers('right')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
            
            <div 
              ref={membersScrollRef}
              className="overflow-x-auto overflow-y-hidden pl-14 pr-2 scrollbar-hide h-24"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <VirtualizedMemberList
                members={filteredMembers}
                weekStartDate={weekStartDate}
                threshold={threshold}
              />
            </div>
          </div>
        )}

        {/* Mobile view without arrows */}
        {filteredMembers.length > 0 && (
          <div className="block sm:hidden overflow-x-auto overflow-y-hidden px-2 h-24">
            <VirtualizedMemberList
              members={filteredMembers}
              weekStartDate={weekStartDate}
              threshold={threshold}
            />
          </div>
        )}

        {/* Empty state */}
        {filteredMembers.length === 0 && searchedAndSortedMembers.length > 0 && (
          <div className="flex-1 flex items-center justify-center py-6">
            <p className="text-sm text-muted-foreground text-center">
              No members in this category
            </p>
          </div>
        )}
        
        {searchedAndSortedMembers.length === 0 && availableMembers.length > 0 && (
          <div className="flex-1 flex items-center justify-center py-6">
            <p className="text-sm text-muted-foreground text-center">
              No members match your search
            </p>
          </div>
        )}
        
        {availableMembers.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-6">
            <p className="text-sm text-muted-foreground text-center">
              No available members
            </p>
          </div>
        )}
      </div>
    </div>
  );
};