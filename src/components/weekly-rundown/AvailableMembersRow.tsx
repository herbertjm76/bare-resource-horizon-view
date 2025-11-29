import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { MemberAvailabilityCard } from './MemberAvailabilityCard';
import { MemberVacationPopover } from './MemberVacationPopover';
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

type SortBy = 'hours' | 'name';
type FilterBy = 'all' | 'department' | 'practiceArea';

interface ProjectAllocation {
  projectId: string;
  projectName: string;
  projectCode: string;
  hours: number;
}

interface AvailableMember {
  id: string;
  type: 'active' | 'pre_registered';
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
  threshold = 80,
  filters
}) => {
  const membersScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

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
          type: member.type,
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
      })
      .sort((a, b) => b.availableHours - a.availableHours);

    return available;
  }, [profiles, invites, allocations, threshold, filters]);

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
  }, [checkScrollPosition, availableMembers]);

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
    <div className="w-full">
      <div className="rounded-lg border bg-card p-1.5 overflow-hidden animate-fade-in relative shadow-[0_4px_8px_-2px_hsl(var(--border))]">
        {/* Members Avatars - Horizontal Scroll with Arrow Navigation - Desktop/Tablet */}
        {availableMembers.length > 0 && (
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
              <div className="flex gap-1.5 sm:gap-2 items-center justify-center member-avatars-scroll min-h-[40px]">
                {availableMembers.map((member) => (
                  <MemberVacationPopover
                    key={member.id}
                    memberId={member.id}
                    memberName={`${member.firstName} ${member.lastName}`}
                    weekStartDate={weekStartDate}
                  >
                    <MemberAvailabilityCard
                      memberId={member.id}
                      memberType={member.type}
                      avatarUrl={member.avatarUrl}
                      firstName={member.firstName}
                      lastName={member.lastName}
                      allocatedHours={member.allocatedHours}
                      projectAllocations={member.projectAllocations}
                      utilization={member.utilization}
                      threshold={threshold}
                      weekStartDate={weekStartDate}
                      disableDialog={true}
                    />
                  </MemberVacationPopover>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile view without arrows */}
        {availableMembers.length > 0 && (
          <div className="block sm:hidden overflow-x-auto overflow-y-hidden -mx-2 px-2">
            <div className="flex gap-1.5 sm:gap-2 items-center justify-start member-avatars-scroll min-h-[40px]">
              {availableMembers.map((member) => (
                <MemberVacationPopover
                  key={member.id}
                  memberId={member.id}
                  memberName={`${member.firstName} ${member.lastName}`}
                  weekStartDate={weekStartDate}
                >
                  <MemberAvailabilityCard
                    memberId={member.id}
                    memberType={member.type}
                    avatarUrl={member.avatarUrl}
                    firstName={member.firstName}
                    lastName={member.lastName}
                    allocatedHours={member.allocatedHours}
                    projectAllocations={member.projectAllocations}
                    utilization={member.utilization}
                    threshold={threshold}
                    weekStartDate={weekStartDate}
                    disableDialog={true}
                  />
                </MemberVacationPopover>
              ))}
            </div>
          </div>
        )}

        {/* Empty state - compact version */}
        {availableMembers.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-3 sm:py-0">
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
              No available members
            </p>
          </div>
        )}
      </div>
    </div>
  );
};