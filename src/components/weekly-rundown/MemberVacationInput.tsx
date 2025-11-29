import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface MemberVacationInputProps {
  memberId: string;
  memberName: string;
  weekStartDate: string;
}

export const MemberVacationInput: React.FC<MemberVacationInputProps> = ({
  memberId,
  memberName,
  weekStartDate
}) => {
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const [dailyHours, setDailyHours] = useState<Record<string, string>>({});

  // Calculate the 5 weekdays (Mon-Fri)
  const weekDays = React.useMemo(() => {
    const weekStart = new Date(weekStartDate);
    const days = [];
    for (let i = 0; i < 5; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      days.push({
        dateKey: day.toISOString().split('T')[0],
        dayName: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i]
      });
    }
    return days;
  }, [weekStartDate]);

  // Load existing vacation hours
  useEffect(() => {
    const loadVacationHours = async () => {
      if (!company?.id) return;

      const dates = weekDays.map(d => d.dateKey);

      const { data } = await supabase
        .from('annual_leaves')
        .select('date, hours')
        .eq('member_id', memberId)
        .eq('company_id', company.id)
        .in('date', dates);

      if (data) {
        const hoursMap: Record<string, string> = {};
        data.forEach(leave => {
          hoursMap[leave.date] = leave.hours.toString();
        });
        setDailyHours(hoursMap);
      }
    };

    loadVacationHours();
  }, [memberId, weekStartDate, company?.id, weekDays]);

  const handleHoursChange = async (dateKey: string, value: string) => {
    setDailyHours(prev => ({ ...prev, [dateKey]: value }));

    if (!company?.id) return;

    const hours = parseFloat(value) || 0;
    
    try {
      // Delete existing entry for this date
      await supabase
        .from('annual_leaves')
        .delete()
        .eq('member_id', memberId)
        .eq('company_id', company.id)
        .eq('date', dateKey);

      // Insert new entry if hours > 0
      if (hours > 0) {
        await supabase
          .from('annual_leaves')
          .insert({
            member_id: memberId,
            company_id: company.id,
            date: dateKey,
            hours: hours
          });
      }

      queryClient.invalidateQueries({ queryKey: ['weekly-leave-details'] });
      queryClient.invalidateQueries({ queryKey: ['available-allocations'] });
      queryClient.invalidateQueries({ queryKey: ['member-workload'] });
      queryClient.invalidateQueries({ queryKey: ['available-members-profiles'] });
    } catch (error) {
      console.error('Error saving vacation hours:', error);
      toast.error('Failed to save vacation hours');
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-foreground">
        Vacation Hours - {memberName}
      </div>
      <div className="flex gap-2">
        {weekDays.map(day => (
          <div key={day.dateKey} className="flex-1 space-y-1">
            <div className="text-xs text-center text-muted-foreground font-medium">
              {day.dayName}
            </div>
            <Input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={dailyHours[day.dateKey] || ''}
              onChange={(e) => setDailyHours(prev => ({ ...prev, [day.dateKey]: e.target.value }))}
              onBlur={(e) => handleHoursChange(day.dateKey, e.target.value)}
              placeholder="0"
              className="w-full h-9 text-center text-sm"
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Enter vacation hours for each day (auto-saves on blur)
      </p>
    </div>
  );
};
