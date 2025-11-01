import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Umbrella } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
          <div className="flex flex-col gap-4">
            {memberIds.map((id) => {
              const leaveDays = leaveByMember[id];
              const profile = profiles.find((p: any) => p.id === id);
              const firstName = profile?.first_name || 'Unknown';
              const lastName = profile?.last_name || 'User';
              const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
              const avatarUrl = profile?.avatar_url || '';
              
              return (
                <div key={id} className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground mb-1">
                      {firstName} {lastName}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {leaveDays.map((day, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: {day.hours}h
                        </div>
                      ))}
                    </div>
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
