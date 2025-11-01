import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Umbrella, PartyPopper, FileText } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface WeeklySummaryCardsProps {
  selectedWeek: Date;
  memberIds: string[];
}

export const WeeklySummaryCards: React.FC<WeeklySummaryCardsProps> = ({
  selectedWeek,
  memberIds
}) => {
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekStartString = format(weekStart, 'yyyy-MM-dd');
  const weekEndString = format(weekEnd, 'yyyy-MM-dd');

  // Fetch annual leaves
  const { data: annualLeaves = [] } = useQuery({
    queryKey: ['weekly-summary-leaves', weekStartString, memberIds],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('annual_leaves')
        .select('member_id, date, hours')
        .in('member_id', memberIds.length > 0 ? memberIds : [''])
        .gte('date', weekStartString)
        .lte('date', weekEndString);
      
      if (error) throw error;
      return data || [];
    },
    enabled: memberIds.length > 0
  });

  // Fetch office holidays
  const { data: holidays = [] } = useQuery({
    queryKey: ['weekly-summary-holidays', weekStartString],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.company_id) return [];

      const { data, error } = await supabase
        .from('office_holidays')
        .select('date, name, end_date')
        .eq('company_id', user.user_metadata.company_id)
        .gte('date', weekStartString)
        .lte('date', weekEndString);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch weekly other leave
  const { data: otherLeaves = [] } = useQuery({
    queryKey: ['weekly-summary-other-leaves', weekStartString, memberIds],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.user_metadata?.company_id) return [];

      const { data, error } = await supabase
        .from('weekly_other_leave')
        .select('member_id, hours, leave_type, notes')
        .eq('company_id', user.user_metadata.company_id)
        .eq('week_start_date', weekStartString)
        .in('member_id', memberIds.length > 0 ? memberIds : ['']);
      
      if (error) throw error;
      return data || [];
    },
    enabled: memberIds.length > 0
  });

  const totalLeaveHours = annualLeaves.reduce((sum, leave) => sum + (leave.hours || 0), 0);
  const totalOtherLeaveHours = otherLeaves.reduce((sum, leave) => sum + (leave.hours || 0), 0);

  const summaryCards = [
    {
      icon: Calendar,
      title: 'Holidays',
      value: holidays.length,
      subtitle: holidays.length === 1 ? 'public holiday' : 'public holidays',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30'
    },
    {
      icon: Umbrella,
      title: 'Annual Leave',
      value: `${totalLeaveHours}h`,
      subtitle: `${annualLeaves.length} ${annualLeaves.length === 1 ? 'person' : 'people'}`,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30'
    },
    {
      icon: PartyPopper,
      title: 'Other Leave',
      value: `${totalOtherLeaveHours}h`,
      subtitle: `${otherLeaves.length} ${otherLeaves.length === 1 ? 'entry' : 'entries'}`,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30'
    },
    {
      icon: FileText,
      title: 'Notes',
      value: otherLeaves.filter(l => l.notes).length,
      subtitle: 'with notes',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {summaryCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-foreground mb-1">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                </div>
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
