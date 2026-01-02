import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Umbrella } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StandardizedBadge } from '@/components/ui/standardized-badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { formatAllocationValue, formatCapacityValue } from '@/utils/allocationDisplay';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { DEMO_TEAM_MEMBERS } from '@/data/demoData';

interface LeaveEntry {
  member_id: string;
  date: string;
  hours: number;
}

interface LeaveCardProps {
  leaves: LeaveEntry[];
}

export const LeaveCard: React.FC<LeaveCardProps> = ({ leaves }) => {
  const { workWeekHours, displayPreference } = useAppSettings();
  const { isDemoMode } = useDemoAuth();
  const capacity = workWeekHours;

  // Group by member_id with dates and hours
  const leaveByMember = leaves.reduce((acc, leave) => {
    if (!acc[leave.member_id]) {
      acc[leave.member_id] = [];
    }
    acc[leave.member_id].push({ date: leave.date, hours: leave.hours });
    return acc;
  }, {} as Record<string, Array<{ date: string; hours: number }>>);

  const memberIds = Object.keys(leaveByMember);

  // Fetch member profiles (skip in demo mode)
  const { data: profiles = [] } = useQuery({
    queryKey: ['member-profiles-leave', memberIds],
    queryFn: async () => {
      if (memberIds.length === 0) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, weekly_capacity')
        .in('id', memberIds);
      
      if (error) throw error;
      return data || [];
    },
    enabled: memberIds.length > 0 && !isDemoMode
  });

  // Fetch pre-registered invites (skip in demo mode)
  const { data: invites = [] } = useQuery({
    queryKey: ['member-invites-leave', memberIds],
    queryFn: async () => {
      if (memberIds.length === 0) return [];
      const { data, error } = await supabase
        .from('invites')
        .select('id, first_name, last_name, weekly_capacity')
        .in('id', memberIds)
        .eq('invitation_type', 'pre_registered');
      
      if (error) throw error;
      return data || [];
    },
    enabled: memberIds.length > 0 && !isDemoMode
  });

  // In demo mode, use demo team members data
  const demoProfiles = isDemoMode
    ? DEMO_TEAM_MEMBERS.filter(m => memberIds.includes(m.id))
    : [];

  // Combine real profiles with demo profiles
  const allProfiles = isDemoMode ? demoProfiles : profiles;

  return (
    <Card className="h-full flex flex-col min-h-[140px] max-h-[140px] shadow-sm border border-border bg-card flex-1 min-w-[180px] relative overflow-hidden">
      {/* Background watermark icon */}
      <Umbrella className="absolute -right-4 -bottom-4 h-24 w-24 text-muted-foreground/5 pointer-events-none" />
      
      <CardHeader className="pb-1 flex-shrink-0 h-[40px] flex items-start pt-3">
        <CardTitle className="text-xs font-semibold text-foreground uppercase tracking-wide">Leave</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto scrollbar-grey relative z-10">
        {memberIds.length === 0 ? (
          <p className="text-sm text-muted-foreground">No leave this week</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            <TooltipProvider delayDuration={0}>
              {memberIds.map((id) => {
                const leaveDays = leaveByMember[id];
                const profile = allProfiles.find((p: any) => p.id === id);
                const invite = invites.find((i: any) => i.id === id);

                const firstName = profile?.first_name || invite?.first_name || 'Unknown';
                const lastName = profile?.last_name || invite?.last_name || 'User';
                const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
                const avatarUrl = profile?.avatar_url || '';
                
                // Calculate total hours and percentage
                const totalHours = leaveDays.reduce((sum, day) => sum + day.hours, 0);
                const memberCapacity = profile?.weekly_capacity || invite?.weekly_capacity || capacity;
                const percentage = Math.round((totalHours / memberCapacity) * 100);
                
                return (
                  <Tooltip key={id}>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center gap-1.5 cursor-pointer">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={avatarUrl} />
                          <AvatarFallback className="bg-gradient-modern text-white text-xs">{initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-foreground">{firstName}</span>
                        <StandardizedBadge variant="metric" size="sm">
                          {percentage}%
                        </StandardizedBadge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="p-3">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{firstName} {lastName}</p>
                        <p className="text-xs text-muted-foreground">{formatAllocationValue(totalHours, memberCapacity, displayPreference)} of {formatCapacityValue(memberCapacity, displayPreference)} capacity</p>
                        <div className="border-t border-border pt-1 mt-1 space-y-0.5">
                          {leaveDays.map((day, idx) => (
                            <p key={idx} className="text-xs">
                              {format(new Date(day.date), 'EEE, MMM d')}: {formatAllocationValue(day.hours, memberCapacity, displayPreference)}
                            </p>
                          ))}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>
        )}
      </CardContent>
    </Card>
  );
};