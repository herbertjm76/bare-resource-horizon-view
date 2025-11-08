import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StandardizedBadge } from '@/components/ui/standardized-badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

interface AvailableMembersRowProps {
  weekStartDate: string;
  threshold?: number;
}

interface AvailableMember {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  availableHours: number;
}

export const AvailableMembersRow: React.FC<AvailableMembersRowProps> = ({
  weekStartDate,
  threshold = 80
}) => {
  const { company } = useCompany();

  const { data: profiles = [] } = useQuery({
    queryKey: ['available-members-profiles', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, weekly_capacity')
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
        .select('id, first_name, last_name, avatar_url, weekly_capacity')
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
        .select('resource_id, resource_type, hours')
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
        type: 'active' as const
      })),
      ...invites.map(i => ({
        id: i.id,
        firstName: i.first_name || '',
        lastName: i.last_name || '',
        avatarUrl: i.avatar_url,
        capacity: i.weekly_capacity || 40,
        type: 'pre_registered' as const
      }))
    ];

    const allocationMap = new Map<string, number>();
    allocations.forEach(alloc => {
      const key = `${alloc.resource_id}:${alloc.resource_type}`;
      const current = allocationMap.get(key) || 0;
      allocationMap.set(key, current + Number(alloc.hours));
    });

    const available = allMembers
      .map(member => {
        const key = `${member.id}:${member.type}`;
        const allocatedHours = allocationMap.get(key) || 0;
        const availableHours = member.capacity - allocatedHours;
        const utilization = (allocatedHours / member.capacity) * 100;

        return {
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          avatarUrl: member.avatarUrl,
          availableHours,
          utilization
        };
      })
      .filter(m => m.utilization < threshold)
      .sort((a, b) => b.availableHours - a.availableHours);

    return available;
  }, [profiles, invites, allocations, threshold]);

  return availableMembers.length === 0 ? null : (
    <div className="flex gap-3 items-center pb-2 overflow-x-auto scrollbar-grey px-1">
      {availableMembers.map((member) => {
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
  );
};