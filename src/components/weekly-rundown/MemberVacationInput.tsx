import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Calendar } from 'lucide-react';

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
  const [hours, setHours] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!company?.id) return;

    const totalHours = parseInt(hours) || 0;
    setIsSaving(true);

    try {
      // Parse week start date
      const weekStart = new Date(weekStartDate);
      
      // Calculate days in the week (Monday to Sunday)
      const daysInWeek = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        daysInWeek.push(day.toISOString().split('T')[0]);
      }

      // Distribute hours across weekdays (Monday to Friday)
      const hoursPerDay = Math.floor(totalHours / 5);
      const remainderHours = totalHours % 5;

      // Delete existing leave records for this week
      await supabase
        .from('annual_leaves')
        .delete()
        .eq('company_id', company.id)
        .eq('member_id', memberId)
        .in('date', daysInWeek);

      if (totalHours > 0) {
        // Insert new leave records
        const leaveRecords = [];
        for (let i = 0; i < 5; i++) { // Monday to Friday
          const dayHours = hoursPerDay + (i < remainderHours ? 1 : 0);
          if (dayHours > 0) {
            leaveRecords.push({
              company_id: company.id,
              member_id: memberId,
              date: daysInWeek[i],
              hours: dayHours
            });
          }
        }

        if (leaveRecords.length > 0) {
          const { error } = await supabase
            .from('annual_leaves')
            .insert(leaveRecords);

          if (error) throw error;
        }
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['weekly-leave-details'] });
      queryClient.invalidateQueries({ queryKey: ['available-allocations'] });
      queryClient.invalidateQueries({ queryKey: ['member-workload'] });
      
      toast.success(`Vacation hours saved for ${memberName}`);
      setHours(''); // Clear input after save
    } catch (error) {
      console.error('Error saving vacation hours:', error);
      toast.error('Failed to save vacation hours');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-3 bg-muted/50 rounded-lg space-y-2 animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Calendar className="h-4 w-4" />
        <span>Vacation Hours for {memberName}</span>
      </div>
      <div className="flex gap-2">
        <Input
          type="number"
          min="0"
          max="40"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="Enter hours (0-40)"
          className="flex-1"
          disabled={isSaving}
        />
        <Button 
          onClick={handleSave}
          disabled={isSaving || !hours}
          size="sm"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Hours will be distributed across weekdays (Mon-Fri)
      </p>
    </div>
  );
};
