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
  const [totalHours, setTotalHours] = useState<string>('');

  // Load existing vacation hours for the week
  useEffect(() => {
    const loadVacationHours = async () => {
      if (!company?.id) return;

      const weekStart = new Date(weekStartDate);
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        weekDays.push(day.toISOString().split('T')[0]);
      }

      const { data } = await supabase
        .from('annual_leaves')
        .select('hours')
        .eq('member_id', memberId)
        .eq('company_id', company.id)
        .in('date', weekDays);

      if (data && data.length > 0) {
        const total = data.reduce((sum, leave) => sum + Number(leave.hours), 0);
        setTotalHours(total.toString());
      }
    };

    loadVacationHours();
  }, [memberId, weekStartDate, company?.id]);

  const handleHoursChange = async (value: string) => {
    setTotalHours(value);

    if (!company?.id) return;

    const hours = parseFloat(value) || 0;
    
    try {
      const weekStart = new Date(weekStartDate);
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        weekDays.push(day.toISOString().split('T')[0]);
      }

      // Delete existing leave records for this week
      await supabase
        .from('annual_leaves')
        .delete()
        .eq('member_id', memberId)
        .eq('company_id', company.id)
        .in('date', weekDays);

      // Insert new leave records distributed across weekdays (Mon-Fri)
      if (hours > 0) {
        const hoursPerDay = Math.floor(hours / 5);
        const remainderHours = hours % 5;
        
        const leaveRecords = [];
        for (let i = 0; i < 5; i++) { // Monday to Friday only
          const dayHours = hoursPerDay + (i < remainderHours ? 1 : 0);
          if (dayHours > 0) {
            leaveRecords.push({
              member_id: memberId,
              company_id: company.id,
              date: weekDays[i],
              hours: dayHours
            });
          }
        }

        if (leaveRecords.length > 0) {
          await supabase
            .from('annual_leaves')
            .insert(leaveRecords);
        }
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
    <div className="w-full">
      <Input
        type="number"
        min="0"
        max="40"
        step="1"
        value={totalHours}
        onChange={(e) => setTotalHours(e.target.value)}
        onBlur={(e) => handleHoursChange(e.target.value)}
        placeholder="0"
        className="w-full h-10 text-center text-sm"
      />
    </div>
  );
};
