import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';

interface OtherLeaveSectionProps {
  memberId: string;
  weekStartDate: string;
  onUpdate?: () => void;
}

export const OtherLeaveSection: React.FC<OtherLeaveSectionProps> = ({
  memberId,
  weekStartDate,
  onUpdate
}) => {
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const [hours, setHours] = useState<number>(0);
  const [leaveType, setLeaveType] = useState<string>('other');
  const [notes, setNotes] = useState<string>('');

  const { data: otherLeave } = useQuery({
    queryKey: ['other-leave-person-card', memberId, weekStartDate, company?.id],
    queryFn: async () => {
      if (!company?.id) return null;
      const { data, error } = await supabase
        .from('weekly_other_leave')
        .select('*')
        .eq('member_id', memberId)
        .eq('week_start_date', weekStartDate)
        .eq('company_id', company.id)
        .maybeSingle();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!company?.id
  });

  useEffect(() => {
    if (otherLeave) {
      setHours(Number(otherLeave.hours) || 0);
      setLeaveType(otherLeave.leave_type || 'other');
      setNotes(otherLeave.notes || '');
    }
  }, [otherLeave]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!company?.id) throw new Error('No company ID');
      const { data, error } = await supabase
        .from('weekly_other_leave')
        .upsert({
          member_id: memberId,
          week_start_date: weekStartDate,
          hours: hours,
          leave_type: leaveType,
          notes: notes || null,
          company_id: company.id
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['other-leave-person-card'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-summary-other-leaves'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-other-leave'] });
      toast.success('Other leave updated');
      onUpdate?.();
    },
    onError: (error) => {
      toast.error('Failed to update other leave');
      console.error(error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!otherLeave?.id) return;
      const { error } = await supabase
        .from('weekly_other_leave')
        .delete()
        .eq('id', otherLeave.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['other-leave-person-card'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-summary-other-leaves'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-other-leave'] });
      setHours(0);
      setLeaveType('other');
      setNotes('');
      toast.success('Other leave removed');
      onUpdate?.();
    },
    onError: (error) => {
      toast.error('Failed to remove other leave');
      console.error(error);
    }
  });

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Other Leave
      </h3>
      
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          type="number"
          placeholder="Hours"
          value={hours || ''}
          onChange={(e) => setHours(Number(e.target.value) || 0)}
          className="w-20"
          min="0"
        />
        
        <Select value={leaveType} onValueChange={setLeaveType}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sick">Sick</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="training">Training</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        
        <Input
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="flex-1 min-w-[150px]"
        />
        
        <Button 
          size="sm" 
          onClick={() => updateMutation.mutate()}
          disabled={updateMutation.isPending}
        >
          {otherLeave ? 'Update' : 'Save'}
        </Button>
        
        {otherLeave && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            Clear
          </Button>
        )}
      </div>
      
      {otherLeave && (
        <div className="text-xs text-muted-foreground">
          Current: {otherLeave.hours}h ({otherLeave.leave_type})
          {otherLeave.notes && ` - ${otherLeave.notes}`}
        </div>
      )}
    </div>
  );
};
