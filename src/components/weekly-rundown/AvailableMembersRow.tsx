import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { MemberAvailabilityCard } from './MemberAvailabilityCard';
import { AvailabilityFilters } from './AvailabilityFilters';
import { Badge } from '@/components/ui/badge';

interface AvailableMembersRowProps {
  weekStartDate: string;
  threshold?: number;
}

type SortBy = 'hours' | 'name';
type FilterBy = 'all' | 'department' | 'sector';

interface AvailableMember {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  availableHours: number;
  utilization: number;
  capacity: number;
  department?: string;
  sectors: string[];
}

export const AvailableMembersRow: React.FC<AvailableMembersRowProps> = ({
  weekStartDate,
  threshold = 80
}) => {
  const { company } = useCompany();
  const [sortBy, setSortBy] = useState<SortBy>('hours');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');

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
    queryKey: ['available-members-profiles', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, weekly_capacity, department')
        .eq('company_id', company.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id
  });

  const { data: invites = [] } = useQuery({
    queryKey: ['available-members-invites', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('invites')
        .select('id, first_name, last_name, avatar_url, weekly_capacity, department')
        .eq('company_id', company.id)
        .eq('invitation_type', 'pre_registered')
        .eq('status', 'pending');
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id
  });

  const { data: allocations = [] } = useQuery({
    queryKey: ['available-allocations', weekStartDate, company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select(`
          resource_id, 
          resource_type, 
          hours,
          projects:project_id (department)
        `)
        .eq('company_id', company.id)
        .eq('week_start_date', weekStartDate);
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id
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
    
    allocations.forEach(alloc => {
      const key = alloc.resource_id; // key only by member id so all resource types are counted
      const current = allocationMap.get(key) || 0;
      allocationMap.set(key, current + Number(alloc.hours));
      
      // Track sectors (project departments) for each member
      if (alloc.projects?.department) {
        if (!memberSectorsMap.has(key)) {
          memberSectorsMap.set(key, new Set());
        }
        memberSectorsMap.get(key)!.add(alloc.projects.department);
      }
    });

    const available = allMembers
      .map(member => {
        const key = member.id;
        const allocatedHours = allocationMap.get(key) || 0;
        const availableHours = member.capacity - allocatedHours;
        const utilization = (allocatedHours / member.capacity) * 100;
        const sectors = Array.from(memberSectorsMap.get(key) || []);

        return {
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          avatarUrl: member.avatarUrl,
          availableHours,
          utilization,
          capacity: member.capacity,
          department: member.department,
          sectors
        };
      })
      .filter(member => member.utilization < threshold)
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

  return (
    <div className="h-[75px] flex items-center gap-3 px-4 border rounded-lg bg-gradient-to-br from-card to-accent/20">
      {/* Compact inline header and filters */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Badge variant="secondary" className="h-5 text-[10px] font-medium">
          {filteredMembers.length}
        </Badge>
        
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

      {/* Member Cards with scroll container */}
      <div className="flex-1 relative h-full">
        <div className="flex gap-3 items-center h-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          {filteredMembers.map((member) => (
            <MemberAvailabilityCard
              key={member.id}
              avatarUrl={member.avatarUrl}
              firstName={member.firstName}
              lastName={member.lastName}
              availableHours={member.availableHours}
              utilization={member.utilization}
              department={member.department}
              sectors={member.sectors}
              maxHours={member.capacity}
            />
          ))}
        </div>
      </div>

      {/* Empty state - compact version */}
      {filteredMembers.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">
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
    </div>
  );
};