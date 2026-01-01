import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MemberAvailabilityCard } from './MemberAvailabilityCard';
import { MemberVacationPopover } from './MemberVacationPopover';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { useWeekResourceTeamMembers } from '@/components/week-resourcing/hooks/useWeekResourceTeamMembers';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useDragScroll } from '@/hooks/useDragScroll';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { generateDemoAllocations, generateDemoAnnualLeaves, DEMO_LOCATIONS, DEMO_HOLIDAYS, DEMO_PROJECTS, DEMO_COMPANY_ID } from '@/data/demoData';
import { logger } from '@/utils/logger';
import { format } from 'date-fns';
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

interface LeaveAllocation {
  type: 'leave' | 'holiday';
  hours: number;
  label?: string;
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
  leaveAllocations: LeaveAllocation[];
}

export const AvailableMembersRow: React.FC<AvailableMembersRowProps> = ({
  weekStartDate,
  threshold = 80,
  allMembers: externalMembers,
  sortOption = 'utilization'
}) => {
  const { isDemoMode } = useDemoAuth();
  const {
    scrollRef: membersScrollRef,
    canScrollLeft,
    canScrollRight,
    scroll: scrollMembers,
    dragHandlers,
    containerStyle,
    shouldPreventClick
  } = useDragScroll();
  const [sortAscending, setSortAscending] = React.useState(true);
  const { workWeekHours } = useAppSettings();

  // Fetch members internally if not provided externally
  const { members: fetchedMembers } = useWeekResourceTeamMembers();
  
  // Use external members if provided, otherwise use fetched members
  const allMembersFromParent = React.useMemo(() => {
    return externalMembers || fetchedMembers || [];
  }, [externalMembers, fetchedMembers]);

  const { data: allocations = [] } = useQuery({
    queryKey: ['available-allocations', weekStartDate, isDemoMode],
    queryFn: async () => {
      const weekStart = new Date(weekStartDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const weekEndDate = weekEnd.toISOString().split('T')[0];
      
      if (isDemoMode) {
        const demoAllocations = generateDemoAllocations();
        return demoAllocations
          .filter(a => a.allocation_date >= weekStartDate && a.allocation_date <= weekEndDate)
          .map(a => {
            const project = DEMO_PROJECTS.find(p => p.id === a.project_id);
            return {
              resource_id: a.resource_id,
              resource_type: a.resource_type,
              hours: a.hours,
              allocation_date: a.allocation_date,
              projects: project ? {
                id: project.id,
                name: project.name,
                code: project.code,
                department: project.department
              } : null
            };
          });
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];
      
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

  // Fetch annual leaves for the week
  const { data: leaves = [] } = useQuery({
    queryKey: ['available-leaves', weekStartDate, isDemoMode],
    queryFn: async () => {
      const weekStart = new Date(weekStartDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const weekEndDate = weekEnd.toISOString().split('T')[0];
      
      if (isDemoMode) {
        const demoLeaves = generateDemoAnnualLeaves();
        return demoLeaves
          .filter(l => l.date >= weekStartDate && l.date <= weekEndDate)
          .map(l => ({
            member_id: l.member_id,
            hours: l.hours,
            date: l.date
          }));
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];
      
      const { data, error } = await supabase
        .from('annual_leaves')
        .select('member_id, hours, date')
        .gte('date', weekStartDate)
        .lte('date', weekEndDate);
      if (error) throw error;
      return data || [];
    },
    staleTime: 60_000
  });

  // Fetch office locations to map location names to IDs
  const { data: officeLocations = [] } = useQuery({
    queryKey: ['office-locations-for-holidays', isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return DEMO_LOCATIONS.map(l => ({
          id: l.id,
          city: l.city,
          code: l.code
        }));
      }
      
      const { data, error } = await supabase
        .from('office_locations')
        .select('id, city, code');
      if (error) throw error;
      return data || [];
    },
    staleTime: 300_000
  });

  // Fetch office holidays for the week
  const { data: holidays = [] } = useQuery({
    queryKey: ['available-holidays', weekStartDate, isDemoMode],
    queryFn: async () => {
      const weekStart = new Date(weekStartDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const weekEndDate = weekEnd.toISOString().split('T')[0];
      
      if (isDemoMode) {
        return DEMO_HOLIDAYS
          .filter(h => {
            const holidayDate = format(h.date, 'yyyy-MM-dd');
            return holidayDate >= weekStartDate && holidayDate <= weekEndDate;
          })
          .map(h => ({
            id: h.id,
            name: h.name,
            date: format(h.date, 'yyyy-MM-dd'),
            end_date: null,
            location_id: h.location_id || null
          }));
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return [];
      
      const { data, error } = await supabase
        .from('office_holidays')
        .select('id, name, date, end_date, location_id')
        .or(`and(date.gte.${weekStartDate},date.lte.${weekEndDate}),and(end_date.gte.${weekStartDate},end_date.lte.${weekEndDate})`);
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
    
    // Build leave hours map by member
    const memberLeaveMap = new Map<string, number>();
    leaves.forEach(leave => {
      const current = memberLeaveMap.get(leave.member_id) || 0;
      memberLeaveMap.set(leave.member_id, current + Number(leave.hours));
    });
    
    // Create mapping from location name/code to location_id
    const locationNameToId = new Map<string, string>();
    officeLocations.forEach(loc => {
      if (loc.city) locationNameToId.set(loc.city.toLowerCase(), loc.id);
      if (loc.code) locationNameToId.set(loc.code.toLowerCase(), loc.id);
    });
    
    logger.debug('Office Locations mapping:', Object.fromEntries(locationNameToId));
    logger.debug('Holidays data:', holidays);
    
    // Build holiday hours map by location_id
    const holidayHoursByLocationId = new Map<string | null, number>();
    holidays.forEach(holiday => {
      const locationId = holiday.location_id;
      // Calculate hours for this holiday (8 hours per day)
      let holidayDays = 1;
      if (holiday.end_date && holiday.date) {
        const start = new Date(holiday.date);
        const end = new Date(holiday.end_date);
        holidayDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      }
      const hours = holidayDays * 8;
      const current = holidayHoursByLocationId.get(locationId) || 0;
      holidayHoursByLocationId.set(locationId, current + hours);
      logger.debug(`Holiday "${holiday.name}" (location_id: ${locationId}): ${holidayDays} days = ${hours}h`);
    });
    
    logger.debug('Holiday hours by location_id:', Object.fromEntries(holidayHoursByLocationId));
    
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
      const capacity = m.weekly_capacity || workWeekHours;
      const projectHours = allocationMap.get(key) || 0;
      const leaveHours = memberLeaveMap.get(key) || 0;
      
      // Get holiday hours for this member's location
      // Note: member.location is a free-text field (e.g. "Singapore", "SG", "Singapore (SG)").
      // Try multiple matching strategies to resolve the correct office_locations.id.
      const rawMemberLocation = (m.location || '').trim();
      const memberLocationKey = rawMemberLocation.toLowerCase();

      const directIdMatch = officeLocations.find((loc) => loc.id === rawMemberLocation)?.id;
      const exactMapMatch = memberLocationKey ? locationNameToId.get(memberLocationKey) : undefined;
      const partialMatch = memberLocationKey
        ? officeLocations.find((loc) => {
            const city = (loc.city || '').toLowerCase();
            const code = (loc.code || '').toLowerCase();
            return (city && memberLocationKey.includes(city)) || (code && memberLocationKey.includes(code));
          })?.id
        : undefined;

      const memberLocationId = directIdMatch || exactMapMatch || partialMatch || null;

      // Get location-specific holidays + global holidays (null location_id applies to all)
      const locationHolidayHours = memberLocationId ? (holidayHoursByLocationId.get(memberLocationId) || 0) : 0;
      const globalHolidayHours = holidayHoursByLocationId.get(null) || 0;
      const memberHolidayHours = locationHolidayHours + globalHolidayHours;
      
      // Debug first few members
      if (allMembersFromParent.indexOf(m) < 3) {
        logger.debug(`Member ${m.first_name} ${m.last_name}:`, {
          location: m.location,
          memberLocationId,
          locationHolidayHours,
          globalHolidayHours,
          memberHolidayHours,
          projectHours,
          leaveHours,
          totalAllocated: projectHours + leaveHours + memberHolidayHours
        });
      }
      
      const allocatedHours = projectHours + leaveHours + memberHolidayHours;
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
      
      // Build leave allocations
      const leaveAllocations: LeaveAllocation[] = [];
      if (leaveHours > 0) {
        leaveAllocations.push({ type: 'leave', hours: leaveHours });
      }
      if (memberHolidayHours > 0) {
        leaveAllocations.push({ type: 'holiday', hours: memberHolidayHours });
      }

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
        projectAllocations,
        leaveAllocations
      };
    });
    
    // Sort based on sortOption and sortAscending state
    return available.sort((a, b) => {
      let comparison = 0;
      
      switch (sortOption) {
        case 'utilization':
          comparison = a.utilization - b.utilization;
          break;
        case 'location':
          const locA = (a.location || '').toLowerCase();
          const locB = (b.location || '').toLowerCase();
          comparison = locA.localeCompare(locB);
          break;
        case 'department':
          const deptA = (a.department || a.practiceArea || '').toLowerCase();
          const deptB = (b.department || b.practiceArea || '').toLowerCase();
          comparison = deptA.localeCompare(deptB);
          break;
        case 'alphabetical':
        default:
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          comparison = nameA.localeCompare(nameB);
          break;
      }
      
      // Apply sort direction
      if (comparison !== 0) {
        return sortAscending ? comparison : -comparison;
      }
      
      // Alphabetical fallback for ties
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [allMembersFromParent, allocations, leaves, holidays, officeLocations, sortOption, sortAscending]);

  // Note: Scroll position checking and scroll functions are now handled by useDragScroll hook

  return (
    <div className="w-full">
      <div className="p-2 animate-fade-in relative">
        {/* Members Avatars - Horizontal Scroll with Arrow Navigation - Desktop/Tablet */}
        {availableMembers.length > 0 && (
          <div className="hidden sm:flex items-center gap-2">
            {/* Sort Toggle Button - fixed position, not overlapping */}
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0 bg-background/95 backdrop-blur-sm shadow-sm border border-border/50 hover:scale-105 transition-all"
                    onClick={() => setSortAscending(!sortAscending)}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="p-2">
                  <div className="text-xs space-y-1">
                    <p className="font-medium">Sort by {sortOption}</p>
                    <p className="text-muted-foreground">
                      Currently: {sortAscending ? 'Ascending' : 'Descending'}
                    </p>
                    <p className="text-muted-foreground italic">Click to toggle direction</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Scrollable avatar area with navigation arrows */}
            <div className="relative flex-1 min-w-0">
              {/* Left Scroll Arrow */}
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
                className="overflow-x-auto overflow-y-hidden px-4 scrollbar-hide select-none"
                style={containerStyle}
                {...dragHandlers}
              >
                <div className="flex gap-1.5 sm:gap-2 items-center justify-start member-avatars-scroll min-h-[40px]">
                {availableMembers.map((member, index) => (
                  <MemberVacationPopover
                    key={member.id}
                    memberId={member.id}
                    memberName={`${member.firstName} ${member.lastName}`}
                    weekStartDate={weekStartDate}
                  >
                    <div className={`cursor-pointer ${index === 0 ? 'ml-8' : ''}`}>
                      <MemberAvailabilityCard
                        memberId={member.id}
                        memberType={member.type}
                        firstName={member.firstName}
                        lastName={member.lastName}
                        avatarUrl={member.avatarUrl}
                        allocatedHours={member.allocatedHours}
                        utilization={member.utilization}
                        capacity={member.capacity}
                        projectAllocations={member.projectAllocations}
                        leaveAllocations={member.leaveAllocations}
                        threshold={threshold}
                        weekStartDate={weekStartDate}
                      />
                    </div>
                  </MemberVacationPopover>
                ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Mobile: Grid of avatars */}
        {availableMembers.length > 0 && (
          <div className="sm:hidden grid grid-cols-5 gap-2">
            {availableMembers.slice(0, 10).map((member) => (
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
                    firstName={member.firstName}
                    lastName={member.lastName}
                    avatarUrl={member.avatarUrl}
                    allocatedHours={member.allocatedHours}
                    utilization={member.utilization}
                    capacity={member.capacity}
                    projectAllocations={member.projectAllocations}
                    leaveAllocations={member.leaveAllocations}
                    threshold={threshold}
                    weekStartDate={weekStartDate}
                  />
                </div>
              </MemberVacationPopover>
            ))}
          </div>
        )}
        
        {availableMembers.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-4">
            No team members found
          </div>
        )}
      </div>
    </div>
  );
};
