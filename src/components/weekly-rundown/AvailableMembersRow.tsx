import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StandardizedBadge } from '@/components/ui/standardized-badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

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
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');

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
      const key = `${alloc.resource_id}:${alloc.resource_type}`;
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
        const key = `${member.id}:${member.type}`;
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
      if (filterBy === 'department' && selectedDepartment !== 'all') {
        return member.department === selectedDepartment;
      }
      if (filterBy === 'sector' && selectedSector !== 'all') {
        return member.sectors.includes(selectedSector);
      }
      return true;
    });
  }, [availableMembers, filterBy, selectedDepartment, selectedSector]);

  if (filteredMembers.length === 0) {
    return null;
  }

  return (
    <div className="flex items-start gap-3">
      {/* Compact Stacked Filters */}
      <div className="flex flex-col gap-1.5 flex-shrink-0 min-w-[150px]">
        {/* Filter Type Selector */}
        <div className="flex items-center gap-1.5 bg-muted/50 rounded-md p-1">
          <Filter className="h-3.5 w-3.5 text-muted-foreground ml-1" />
          <Select value={filterBy} onValueChange={(value) => {
            setFilterBy(value as FilterBy);
            setSelectedDepartment('all');
            setSelectedSector('all');
          }}>
            <SelectTrigger className="h-7 text-xs border-0 bg-transparent shadow-none focus:ring-0 px-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Available</SelectItem>
              <SelectItem value="department">By Department</SelectItem>
              <SelectItem value="sector">By Sector</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Department Filter */}
        {filterBy === 'department' && departments.length > 0 && (
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="h-7 text-xs bg-background">
              <SelectValue placeholder="Select dept" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Sector Filter */}
        {filterBy === 'sector' && sectors.length > 0 && (
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="h-7 text-xs bg-background">
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {sectors.map(sector => (
                <SelectItem key={sector} value={sector}>{sector}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5 bg-muted/50 rounded-md p-1">
          <span className="text-[10px] text-muted-foreground ml-1 uppercase tracking-wide">Sort</span>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
            <SelectTrigger className="h-7 text-xs border-0 bg-transparent shadow-none focus:ring-0 px-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hours">By Hours</SelectItem>
              <SelectItem value="name">By Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Avatars Row */}
      <div className="flex gap-3 items-center overflow-x-auto scrollbar-grey px-1 flex-1">
        {filteredMembers.map((member) => {
          const initials = `${member.firstName[0] || ''}${member.lastName[0] || ''}`.toUpperCase();
          
          return (
            <div key={member.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <Avatar className="h-9 w-9">
                <AvatarImage src={member.avatarUrl} />
                <AvatarFallback className="bg-gradient-modern text-white text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-foreground">{member.firstName}</span>
              <StandardizedBadge variant="metric" size="sm">
                {member.availableHours}h
              </StandardizedBadge>
            </div>
          );
        })}
      </div>
    </div>
  );
};