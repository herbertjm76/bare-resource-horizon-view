import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Umbrella, PartyPopper, FileText, Megaphone } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StandardizedBadge } from '@/components/ui/standardized-badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAppSettings } from '@/hooks/useAppSettings';

interface CardDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardType: string;
  cardLabel: string;
  data: any;
}

export const CardDetailDialog: React.FC<CardDetailDialogProps> = ({
  open,
  onOpenChange,
  cardType,
  cardLabel,
  data
}) => {
  const { workWeekHours } = useAppSettings();
  const capacity = workWeekHours;

  const getIcon = () => {
    switch (cardType) {
      case 'holidays': return <Calendar className="h-5 w-5" />;
      case 'annualLeave': return <Umbrella className="h-5 w-5" />;
      case 'otherLeave': return <PartyPopper className="h-5 w-5" />;
      case 'notes': return <FileText className="h-5 w-5" />;
      case 'announcements': return <Megaphone className="h-5 w-5" />;
      default: return null;
    }
  };

  // For leave cards, we need to fetch member profiles
  const memberIds = cardType === 'annualLeave' || cardType === 'otherLeave' 
    ? [...new Set((data || []).map((d: any) => d.member_id))] as string[]
    : [];

  const { data: profiles = [] } = useQuery({
    queryKey: ['detail-profiles', memberIds],
    queryFn: async () => {
      if (memberIds.length === 0) return [];
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, weekly_capacity')
        .in('id', memberIds);
      if (error) throw error;
      return profileData || [];
    },
    enabled: memberIds.length > 0 && open
  });

  const { data: invites = [] } = useQuery({
    queryKey: ['detail-invites', memberIds],
    queryFn: async () => {
      if (memberIds.length === 0) return [];
      const { data: inviteData, error } = await supabase
        .from('invites')
        .select('id, first_name, last_name, weekly_capacity')
        .in('id', memberIds)
        .eq('invitation_type', 'pre_registered');
      if (error) throw error;
      return inviteData || [];
    },
    enabled: memberIds.length > 0 && open
  });

  const renderContent = () => {
    switch (cardType) {
      case 'holidays':
        const holidays = data || [];
        if (holidays.length === 0) {
          return <p className="text-muted-foreground">No holidays this week</p>;
        }
        return (
          <div className="space-y-3">
            {holidays.map((holiday: any) => (
              <div key={holiday.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{holiday.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(holiday.date), 'EEEE, MMMM d, yyyy')}
                    {holiday.end_date && ` - ${format(new Date(holiday.end_date), 'EEEE, MMMM d, yyyy')}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'annualLeave':
        const leaves = data || [];
        if (leaves.length === 0) {
          return <p className="text-muted-foreground">No leave this week</p>;
        }
        // Group by member
        const leaveByMember = leaves.reduce((acc: any, leave: any) => {
          if (!acc[leave.member_id]) acc[leave.member_id] = [];
          acc[leave.member_id].push({ date: leave.date, hours: leave.hours });
          return acc;
        }, {});
        
        return (
          <div className="space-y-4">
            {Object.keys(leaveByMember).map((memberId) => {
              const leaveDays = leaveByMember[memberId];
              const profile = profiles.find((p: any) => p.id === memberId);
              const invite = invites.find((i: any) => i.id === memberId);
              const firstName = profile?.first_name || invite?.first_name || 'Unknown';
              const lastName = profile?.last_name || invite?.last_name || 'User';
              const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
              const avatarUrl = profile?.avatar_url || '';
              const totalHours = leaveDays.reduce((sum: number, d: any) => sum + d.hours, 0);
              const memberCapacity = profile?.weekly_capacity || invite?.weekly_capacity || capacity;
              const percentage = Math.round((totalHours / memberCapacity) * 100);

              return (
                <div key={memberId} className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback className="bg-gradient-modern text-white text-sm">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{firstName} {lastName}</p>
                      <p className="text-sm text-muted-foreground">{totalHours}h of {memberCapacity}h capacity ({percentage}%)</p>
                    </div>
                    <StandardizedBadge variant="metric">{percentage}%</StandardizedBadge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {leaveDays.map((day: any, idx: number) => (
                      <div key={idx} className="text-sm bg-background p-2 rounded">
                        <span className="text-muted-foreground">{format(new Date(day.date), 'EEE, MMM d')}:</span>{' '}
                        <span className="font-medium">{day.hours}h</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'otherLeave':
        const otherLeaves = data || [];
        if (otherLeaves.length === 0) {
          return <p className="text-muted-foreground">No other leave this week</p>;
        }
        // Group by member
        const otherByMember = otherLeaves.reduce((acc: any, leave: any) => {
          if (!acc[leave.member_id]) acc[leave.member_id] = { hours: 0, notes: leave.notes };
          acc[leave.member_id].hours += leave.hours;
          return acc;
        }, {});
        
        return (
          <div className="space-y-4">
            {Object.keys(otherByMember).map((memberId) => {
              const leaveData = otherByMember[memberId];
              const profile = profiles.find((p: any) => p.id === memberId);
              const invite = invites.find((i: any) => i.id === memberId);
              const firstName = profile?.first_name || invite?.first_name || 'Unknown';
              const lastName = profile?.last_name || invite?.last_name || 'User';
              const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
              const avatarUrl = profile?.avatar_url || '';

              return (
                <div key={memberId} className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback className="bg-gradient-modern text-white text-sm">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{firstName} {lastName}</p>
                      <p className="text-sm text-muted-foreground">{leaveData.hours}h</p>
                    </div>
                  </div>
                  {leaveData.notes && (
                    <p className="mt-2 text-sm text-muted-foreground italic">{leaveData.notes}</p>
                  )}
                </div>
              );
            })}
          </div>
        );

      case 'notes':
        const notes = data || [];
        if (notes.length === 0) {
          return <p className="text-muted-foreground">No notes this week</p>;
        }
        return (
          <div className="space-y-3">
            {notes.map((note: any) => (
              <div key={note.id} className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(note.start_date), 'MMM d')}
                    {note.end_date && ` - ${format(new Date(note.end_date), 'MMM d')}`}
                  </span>
                </div>
                <p className="text-foreground">{note.description}</p>
              </div>
            ))}
          </div>
        );

      default:
        return <p className="text-muted-foreground">No additional details available</p>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-[60vw] max-h-[80vh] sm:max-w-[60vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {cardLabel}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          {renderContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
