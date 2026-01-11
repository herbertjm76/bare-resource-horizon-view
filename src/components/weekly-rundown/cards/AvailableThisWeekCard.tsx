import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StandardizedBadge } from '@/components/ui/standardized-badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAvailableValue } from '@/utils/allocationDisplay';

interface AvailableThisWeekCardProps {
  weekStartDate: string;
  threshold?: number; // Show members with utilization < threshold (default 80)
}

interface AvailableMember {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  capacity: number;
  allocatedHours: number;
  availableHours: number;
  utilization: number;
}

export const AvailableThisWeekCard: React.FC<AvailableThisWeekCardProps> = ({
  weekStartDate,
  threshold = 80
}) => {
  const { company } = useCompany();
  const { displayPreference, workWeekHours } = useAppSettings();

  // Fetch all active members and pre-registered invites
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

  // Fetch allocations for the week
  // RULEBOOK: Intentionally fetches both 'active' and 'pre_registered' allocations
  // because this card shows availability for ALL members including pre-registered invites
  const { data: allocations = [] } = useQuery({
    queryKey: ['available-allocations', weekStartDate, company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('resource_id, resource_type, hours')
        .eq('company_id', company.id)
        .eq('allocation_date', weekStartDate);
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id
  });

  // Calculate available members
  const availableMembers: AvailableMember[] = React.useMemo(() => {
    const allMembers = [
      ...profiles.map(p => ({
        id: p.id,
        firstName: p.first_name || '',
        lastName: p.last_name || '',
        avatarUrl: p.avatar_url,
        capacity: p.weekly_capacity || workWeekHours,
        type: 'active' as const
      })),
      ...invites.map(i => ({
        id: i.id,
        firstName: i.first_name || '',
        lastName: i.last_name || '',
        avatarUrl: i.avatar_url,
        capacity: i.weekly_capacity || workWeekHours,
        type: 'pre_registered' as const
      }))
    ];

    // Calculate allocated hours per member
    const allocationMap = new Map<string, number>();
    allocations.forEach(alloc => {
      const key = alloc.resource_id; // key only by member id so all resource types are counted
      const current = allocationMap.get(key) || 0;
      allocationMap.set(key, current + Number(alloc.hours));
    });

    // Filter and calculate availability
    const available = allMembers
      .map(member => {
        const key = member.id;
        const allocatedHours = allocationMap.get(key) || 0;
        const availableHours = member.capacity - allocatedHours;
        const utilization = (allocatedHours / member.capacity) * 100;

        return {
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          avatarUrl: member.avatarUrl,
          capacity: member.capacity,
          allocatedHours,
          availableHours,
          utilization
        };
      })
      .filter(m => m.utilization < threshold) // Show only members with < threshold% utilization
      .sort((a, b) => b.availableHours - a.availableHours); // Sort by most available hours first

    return available;
  }, [profiles, invites, allocations, threshold]);

  return (
    <Card className="h-full flex flex-col min-h-[180px] shadow-sm border border-border bg-card sm:min-w-[220px] sm:max-w-[280px] relative overflow-hidden">
      {/* Background watermark icon */}
      <UserCheck className="absolute -right-4 -bottom-4 h-24 w-24 text-muted-foreground/5 pointer-events-none" />
      
      <CardHeader className="flex-shrink-0 pb-1 h-[40px] flex items-start pt-3">
        <CardTitle className="text-xs font-semibold text-foreground uppercase tracking-wide">
          Available This Week
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-x-auto scrollbar-grey relative z-10">
        {availableMembers.length === 0 ? (
          <p className="text-sm text-muted-foreground">All team members fully allocated</p>
        ) : (
          <div className="flex gap-3 pb-2">
            {availableMembers.map((member) => {
              const initials = `${member.firstName[0] || ''}${member.lastName[0] || ''}`.toUpperCase();
              
              return (
                <div key={member.id} className="flex flex-col items-center gap-1.5">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={member.avatarUrl} />
                    <AvatarFallback className="bg-gradient-modern text-white text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-foreground">{member.firstName}</span>
                  <StandardizedBadge variant="metric" size="sm">
                    {formatAvailableValue(member.availableHours, member.capacity, displayPreference)}
                  </StandardizedBadge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
