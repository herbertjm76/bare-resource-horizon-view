import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { MemberAvailabilityCard } from './MemberAvailabilityCard';
import { AvailabilityFilters } from './AvailabilityFilters';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AvailableMembersRowProps {
  weekStartDate: string;
  threshold?: number;
}

type SortBy = 'hours' | 'name';
type FilterBy = 'all' | 'department' | 'sector';

interface ProjectAllocation {
  projectId: string;
  projectName: string;
  projectCode: string;
  hours: number;
}

interface AvailableMember {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  availableHours: number;
  allocatedHours: number;
  utilization: number;
  capacity: number;
  department?: string;
  sectors: string[];
  projectAllocations: ProjectAllocation[];
}

export const AvailableMembersRow: React.FC<AvailableMembersRowProps> = ({
  weekStartDate,
  threshold = 80
}) => {
  const [sortBy, setSortBy] = useState<SortBy>('hours');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const membersScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const handleClearFilters = () => {
    setFilterBy('all');
    setSelectedDepartment('');
    setSelectedSector('');
  };

  const activeFilterCount = [
    selectedDepartment !== '',
    selectedSector !== '',
  ].filter(Boolean).length;

  const { data: profiles = [] } = useQuery({
    queryKey: ['available-members-profiles'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, weekly_capacity, department');
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
        .select('id, first_name, last_name, avatar_url, weekly_capacity, department')
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
          week_start_date,
          projects:project_id (
            id,
            name,
            code,
            department
          )
        `)
        .gte('week_start_date', weekStartDate)
        .lte('week_start_date', weekEndDate);
      if (error) throw error;
      return data || [];
    },
    staleTime: 60_000,
  });

  const availableMembers: AvailableMember[] = React.useMemo(() => {
    const allMembers = [
      ...profiles.map(p => ({
        id: p.id,
        firstName: p.first_name || '',
        lastName: p.last_name || '',
        avatarUrl: p.avatar_url,
        capacity: p.weekly_capacity || 40,
        department: p.department || undefined,
        type: 'active' as const
      })),
      ...invites.map(i => ({
        id: i.id,
        firstName: i.first_name || '',
        lastName: i.last_name || '',
        avatarUrl: i.avatar_url,
        capacity: i.weekly_capacity || 40,
        department: i.department || undefined,
        type: 'pre_registered' as const
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
          firstName: member.firstName,
          lastName: member.lastName,
          avatarUrl: member.avatarUrl,
          availableHours,
          allocatedHours,
          utilization,
          capacity: member.capacity,
          department: member.department,
          sectors,
          projectAllocations
        };
      })
      .sort((a, b) => {
        if (sortBy === 'hours') {
          return b.availableHours - a.availableHours;
        } else {
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        }
      });

    return available;
  }, [profiles, invites, allocations, threshold, sortBy]);

  // Get unique departments and sectors for filters
  const { departments, sectors } = React.useMemo(() => {
    const depts = new Set<string>();
    const sects = new Set<string>();
    
    availableMembers.forEach(member => {
      if (member.department) depts.add(member.department);
      member.sectors.forEach(sector => sects.add(sector));
    });
    
    return {
      departments: Array.from(depts).sort(),
      sectors: Array.from(sects).sort()
    };
  }, [availableMembers]);

  // Apply filters
  const filteredMembers = React.useMemo(() => {
    return availableMembers.filter(member => {
      if (filterBy === 'department' && selectedDepartment !== '') {
        return member.department === selectedDepartment;
      }
      if (filterBy === 'sector' && selectedSector !== '') {
        return member.sectors.includes(selectedSector);
      }
      return true;
    });
  }, [availableMembers, filterBy, selectedDepartment, selectedSector]);

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
    <div className="w-full space-y-1">
      <div className="bg-card rounded-lg border shadow-sm p-2 overflow-hidden animate-fade-in relative">
        {/* Members Avatars - Horizontal Scroll with Arrow Navigation - Desktop/Tablet */}
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
              className="overflow-x-auto overflow-y-hidden -mx-2 px-2 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex gap-1.5 sm:gap-2 items-center justify-start member-avatars-scroll min-h-[52px]">
                {filteredMembers.map((member) => (
                  <MemberAvailabilityCard
                    key={member.id}
                    avatarUrl={member.avatarUrl}
                    firstName={member.firstName}
                    lastName={member.lastName}
                    allocatedHours={member.allocatedHours}
                    projectAllocations={member.projectAllocations}
                    utilization={member.utilization}
                    threshold={threshold}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile view without arrows */}
        {filteredMembers.length > 0 && (
          <div className="block sm:hidden overflow-x-auto overflow-y-hidden -mx-2 px-2">
            <div className="flex gap-1.5 sm:gap-2 items-center justify-start member-avatars-scroll min-h-[52px]">
              {filteredMembers.map((member) => (
                <MemberAvailabilityCard
                  key={member.id}
                  avatarUrl={member.avatarUrl}
                  firstName={member.firstName}
                  lastName={member.lastName}
                  allocatedHours={member.allocatedHours}
                  projectAllocations={member.projectAllocations}
                  utilization={member.utilization}
                  threshold={threshold}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state - compact version */}
        {filteredMembers.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-3 sm:py-0">
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
              No available members
              {activeFilterCount > 0 && (
                <button 
                  onClick={handleClearFilters}
                  className="ml-1 text-primary hover:underline font-medium"
                >
                  - clear filters
                </button>
              )}
            </p>
          </div>
        )}

        {/* Filters - Bottom Right - Desktop/Tablet only */}
        <div className="hidden sm:flex absolute bottom-2 right-2 z-10">
          <AvailabilityFilters
            sortBy={sortBy}
            onSortChange={setSortBy}
            filterBy={filterBy}
            onFilterChange={setFilterBy}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            selectedSector={selectedSector}
            onSectorChange={setSelectedSector}
            departments={departments}
            sectors={sectors}
            activeFilterCount={activeFilterCount}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>

      {/* Mobile Filters Row - Only on mobile */}
      <div className="flex sm:hidden justify-end items-center gap-2 px-2 py-1 border rounded-lg bg-card/50">
        <AvailabilityFilters
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          selectedSector={selectedSector}
          onSectorChange={setSelectedSector}
          departments={departments}
          sectors={sectors}
          activeFilterCount={activeFilterCount}
          onClearFilters={handleClearFilters}
        />
      </div>
    </div>
  );
};