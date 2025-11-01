import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Umbrella } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface LeaveEntry {
  member_id: string;
  hours: number;
}

interface AnnualLeaveCardProps {
  leaves: LeaveEntry[];
}

export const AnnualLeaveCard: React.FC<AnnualLeaveCardProps> = ({ leaves }) => {
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-orange-50 dark:bg-orange-950/30 p-2 rounded-lg">
            <Umbrella className="h-4 w-4 text-orange-500" />
          </div>
          <CardTitle className="text-sm font-medium">Annual Leave</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {memberIds.length === 0 ? (
          <p className="text-sm text-muted-foreground">No annual leave this week</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {memberIds.map((id) => {
              const hours = leaveByMember[id];
              const profile = profiles.find((p: any) => p.id === id);
              const initials = `${profile?.first_name?.[0] || ''}${profile?.last_name?.[0] || ''}`.toUpperCase() || '??';
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
