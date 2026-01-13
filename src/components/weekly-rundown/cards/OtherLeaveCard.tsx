import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PartyPopper } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue } from '@/utils/allocationDisplay';

interface OtherLeaveEntry {
  member_id: string;
  hours: number;
}

interface OtherLeaveCardProps {
  leaves: OtherLeaveEntry[];
}

export const OtherLeaveCard: React.FC<OtherLeaveCardProps> = ({ leaves }) => {
  const { displayPreference, workWeekHours } = useAppSettings();
  const capacity = workWeekHours;

  // Group by member_id and sum hours
  const leaveByMember = leaves.reduce((acc, leave) => {
    if (!acc[leave.member_id]) {
      acc[leave.member_id] = 0;
    }
    acc[leave.member_id] += leave.hours;
    return acc;
  }, {} as Record<string, number>);

  const memberIds = Object.keys(leaveByMember);

  // Fetch member profiles
  const { data: profiles = [] } = useQuery({
    queryKey: ['member-profiles-other-leave', memberIds],
    queryFn: async () => {
      if (memberIds.length === 0) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', memberIds);
      
      if (error) throw error;
      return data || [];
    },
    enabled: memberIds.length > 0
  });

  // Fetch pre-registered invites
  const { data: invites = [] } = useQuery({
    queryKey: ['member-invites-other-leave', memberIds],
    queryFn: async () => {
      if (memberIds.length === 0) return [];
      const { data, error } = await supabase
        .from('invites')
        .select('id, first_name, last_name')
        .in('id', memberIds)
        .in('invitation_type', ['pre_registered', 'email_invite']);
      
      if (error) throw error;
      return data || [];
    },
    enabled: memberIds.length > 0
  });

  return (
    <Card className="h-full flex flex-col min-h-[120px] max-h-[25vh] shadow-sm border border-border bg-card flex-1 min-w-[180px] relative overflow-hidden">
      {/* Background watermark icon */}
      <PartyPopper className="absolute -right-4 -bottom-4 h-24 w-24 text-muted-foreground/5 pointer-events-none" />
      
      <CardHeader className="pb-1 flex-shrink-0 h-[40px] flex items-start pt-3">
        <CardTitle className="text-xs font-semibold text-foreground uppercase tracking-wide">Other Leave</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto scrollbar-grey relative z-10">
        {memberIds.length === 0 ? (
          <p className="text-sm text-muted-foreground">No other leave this week</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {memberIds.map((id) => {
              const hours = leaveByMember[id];
              const profile = profiles.find((p: any) => p.id === id);
              const invite = invites.find((i: any) => i.id === id);
              
              const firstName = profile?.first_name || invite?.first_name || 'Unknown';
              const lastName = profile?.last_name || invite?.last_name || 'User';
              const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
              const avatarUrl = profile?.avatar_url || '';
              
              return (
                <div key={id} className="flex flex-col items-center gap-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-gradient-modern text-white text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-foreground">{formatAllocationValue(hours, capacity, displayPreference)}</span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
