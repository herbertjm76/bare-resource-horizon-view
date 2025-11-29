import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';

interface MemberVacationPopoverProps {
  memberId: string;
  memberName: string;
  weekStartDate: string;
  children: React.ReactNode;
}

export const MemberVacationPopover: React.FC<MemberVacationPopoverProps> = ({
  memberId,
  memberName,
  weekStartDate,
  children
}) => {
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const [dailyHours, setDailyHours] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);

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

  // Load existing vacation hours when popover opens
  useEffect(() => {
    if (!open || !company?.id) return;

    const loadVacationHours = async () => {
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
  }, [open, memberId, weekStartDate, company?.id, weekDays]);

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
      
      toast.success('Vacation hours saved');
    } catch (error) {
      console.error('Error saving vacation hours:', error);
      toast.error('Failed to save vacation hours');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start" side="bottom">
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium text-sm">{memberName}</h4>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Vacation Hours (Mon-Fri)</Label>
            <div className="grid grid-cols-5 gap-2">
              {weekDays.map(day => (
                <div key={day.dateKey} className="space-y-1">
                  <Label className="text-xs text-center block">{day.dayName}</Label>
                  <Input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={dailyHours[day.dateKey] || ''}
                    onChange={(e) => setDailyHours(prev => ({ ...prev, [day.dateKey]: e.target.value }))}
                    onBlur={(e) => handleHoursChange(day.dateKey, e.target.value)}
                    placeholder="0"
                    className="h-9 text-center text-xs px-1"
                  />
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Auto-saves on blur
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
