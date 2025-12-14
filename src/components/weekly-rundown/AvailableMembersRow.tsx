import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MemberAvailabilityCard } from './MemberAvailabilityCard';
import { MemberVacationPopover } from './MemberVacationPopover';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { useWeekResourceTeamMembers } from '@/components/week-resourcing/hooks/useWeekResourceTeamMembers';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AvailableMembersRowProps {
  weekStartDate: string;
  threshold?: number;
  sortOption?: 'alphabetical' | 'utilization' | 'location' | 'department';
  filters?: {
    practiceArea: string;
    department: string;
    location: string;
    searchTerm: string;
  };
  // Accept pre-sorted and pre-filtered members from parent to ensure consistency
  allMembers?: Array<{
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
    weekly_capacity?: number;
    department?: string | null;
    practice_area?: string | null;
    location?: string | null;
    status?: string;
  }>;
}

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
  practiceArea?: string;
  location?: string;
  sectors: string[];
  projectAllocations: ProjectAllocation[];
}

export const AvailableMembersRow: React.FC<AvailableMembersRowProps> = ({
  weekStartDate,
  threshold = 80,
  filters,
  allMembers: externalMembers
}) => {
  const membersScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const [sortAscending, setSortAscending] = React.useState(true); // true = underutilized first

  // Fetch members internally if not provided externally
  const { members: fetchedMembers } = useWeekResourceTeamMembers();
  
  // Use external members if provided, otherwise use fetched members
  const baseMembers = externalMembers || fetchedMembers || [];
  
  // Apply filters to members
  const allMembersFromParent = React.useMemo(() => {
    if (!filters) return baseMembers;
    
    return baseMembers.filter(member => {
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
      // Filter by search term
      if (filters.searchTerm) {
        const fullName = `${member.first_name || ''} ${member.last_name || ''}`.toLowerCase();
        if (!fullName.includes(filters.searchTerm.toLowerCase())) return false;
      }
      return true;
    });
  }, [baseMembers, filters]);

  const { data: allocations = [] } = useQuery({
    queryKey: ['available-allocations', weekStartDate],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];
      
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
    staleTime: 60_000
  });

  const availableMembers: AvailableMember[] = React.useMemo(() => {
    // Build allocation maps for utilization calculation
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

    // Map members to AvailableMember format
    // Parent provides filtered members, but we apply our own utilization sorting
    const available = allMembersFromParent.map(m => {
      const key = m.id;
      const capacity = m.weekly_capacity || 40;
      const allocatedHours = allocationMap.get(key) || 0;
      const availableHours = capacity - allocatedHours;
      const utilization = capacity > 0 ? (allocatedHours / capacity) * 100 : 0;
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
        id: m.id,
        type: (m.status === 'pre_registered' ? 'pre_registered' : 'active') as 'active' | 'pre_registered',
        firstName: m.first_name || '',
        lastName: m.last_name || '',
        avatarUrl: m.avatar_url,
        availableHours,
        allocatedHours,
        utilization,
        capacity,
        department: m.department || undefined,
        practiceArea: m.practice_area || undefined,
        location: m.location || undefined,
        sectors,
        projectAllocations
      };
    });
    
    // Sort by utilization based on sortAscending state
    return available.sort((a, b) => {
      // Sort by utilization
      if (a.utilization !== b.utilization) {
        return sortAscending 
          ? a.utilization - b.utilization  // Ascending: underutilized first
          : b.utilization - a.utilization; // Descending: overutilized first
      }
      // Alphabetical fallback for ties
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [allMembersFromParent, allocations, sortAscending]);

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
      <div className="p-2 animate-fade-in relative">
        {/* Members Avatars - Horizontal Scroll with Arrow Navigation - Desktop/Tablet */}
        {availableMembers.length > 0 && (
          <div className="hidden sm:block relative">
            {/* Sort Toggle Button - positioned at far left */}
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-8 w-8 bg-background/95 backdrop-blur-sm shadow-lg hover:scale-110 transition-all"
                    onClick={() => setSortAscending(!sortAscending)}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="p-2">
                  <div className="text-xs space-y-1">
                    <p className="font-medium">Sort by utilization</p>
                    <p className="text-muted-foreground">
                      Currently: {sortAscending ? 'Underutilized first' : 'Overutilized first'}
                    </p>
                    <p className="text-muted-foreground italic">Click to toggle</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Left Scroll Arrow */}
            {canScrollLeft && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-10 top-1/2 -translate-y-1/2 z-20 h-8 w-8 bg-background/95 backdrop-blur-sm shadow-lg hover:scale-110 transition-all"
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
              className="overflow-x-auto overflow-y-hidden pl-14 pr-2 scrollbar-hide"
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
                    <div className="cursor-pointer">
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
                    </div>
                  </MemberVacationPopover>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile view without arrows */}
        {availableMembers.length > 0 && (
          <div className="block sm:hidden overflow-x-auto overflow-y-hidden px-2">
            <div className="flex gap-1.5 sm:gap-2 items-center justify-start member-avatars-scroll min-h-[40px]">
              {availableMembers.map((member) => (
                <MemberVacationPopover
                  key={member.id}
                  memberId={member.id}
                  memberName={`${member.firstName} ${member.lastName}`}
                  weekStartDate={weekStartDate}
                >
                  <div className="cursor-pointer">
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
                  </div>
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