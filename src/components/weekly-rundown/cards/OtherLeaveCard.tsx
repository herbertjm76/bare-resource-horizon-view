import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PartyPopper } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface OtherLeaveEntry {
  member_id: string;
  hours: number;
}

interface OtherLeaveCardProps {
  leaves: OtherLeaveEntry[];
}

export const OtherLeaveCard: React.FC<OtherLeaveCardProps> = ({ leaves }) => {
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
        .eq('invitation_type', 'pre_registered');
      
      if (error) throw error;
      return data || [];
    },
    enabled: memberIds.length > 0
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-purple-50 dark:bg-purple-950/30 p-2 rounded-lg">
            <PartyPopper className="h-4 w-4 text-purple-500" />
          </div>
          <CardTitle className="text-sm font-medium">Other Leave</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
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
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-foreground">{hours}h</span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
