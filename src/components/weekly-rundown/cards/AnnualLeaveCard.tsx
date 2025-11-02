import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Umbrella } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface LeaveEntry {
  member_id: string;
  date: string;
  hours: number;
}

interface AnnualLeaveCardProps {
  leaves: LeaveEntry[];
}

export const AnnualLeaveCard: React.FC<AnnualLeaveCardProps> = ({ leaves }) => {
  // Group by member_id with dates and hours
  const leaveByMember = leaves.reduce((acc, leave) => {
    if (!acc[leave.member_id]) {
      acc[leave.member_id] = [];
    }
    acc[leave.member_id].push({ date: leave.date, hours: leave.hours });
    return acc;
  }, {} as Record<string, Array<{ date: string; hours: number }>>);

  const memberIds = Object.keys(leaveByMember);

  // Fetch member profiles
  const { data: profiles = [] } = useQuery({
    queryKey: ['member-profiles-leave', memberIds],
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
    queryKey: ['member-invites-leave', memberIds],
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
    <Card className="h-full flex flex-col min-h-[180px] shadow-sm border border-border bg-card/50 backdrop-blur-sm min-w-[200px] max-w-[240px]">
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Umbrella className="h-3.5 w-3.5 text-muted-foreground" />
          <CardTitle className="text-xs font-semibold text-foreground uppercase">Annual Leave</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto scrollbar-grey">
        {memberIds.length === 0 ? (
          <p className="text-sm text-muted-foreground">No annual leave this week</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {memberIds.map((id) => {
              const leaveDays = leaveByMember[id];
              const profile = profiles.find((p: any) => p.id === id);
              const invite = invites.find((i: any) => i.id === id);
              
              const firstName = profile?.first_name || invite?.first_name || 'Unknown';
              const lastName = profile?.last_name || invite?.last_name || 'User';
              const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
              const avatarUrl = profile?.avatar_url || '';
              
              const getDayInitial = (dateStr: string) => {
                const date = new Date(dateStr);
                return date.toLocaleDateString('en-US', { weekday: 'short' })[0];
              };
              
              return (
                <div key={id} className="flex flex-col items-center gap-1.5">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-gradient-modern text-white text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-foreground">{firstName}</span>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {leaveDays.map((day, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5 h-5 font-bold">
                        {getDayInitial(day.date)}-{day.hours}h
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
