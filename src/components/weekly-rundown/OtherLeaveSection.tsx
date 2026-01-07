import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Palmtree } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { usePermissions } from '@/hooks/usePermissions';

interface OtherLeaveSectionProps {
  memberId: string;
  weekStartDate: string;
  onUpdate?: () => void;
  variant?: 'default' | 'compact';
}

export const OtherLeaveSection: React.FC<OtherLeaveSectionProps> = ({
  memberId,
  weekStartDate,
  onUpdate,
  variant = 'default'
}) => {
  const { company } = useCompany();
  const { isAdmin, permissionsBootstrapping } = usePermissions();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
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
    } else {
      setHours(0);
      setLeaveType('other');
      setNotes('');
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
      setOpen(false);
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
      setOpen(false);
      onUpdate?.();
    },
    onError: (error) => {
      toast.error('Failed to remove other leave');
      console.error(error);
    }
  });

  // While permissions are resolving, render a stable disabled control instead of "disappearing"
  if (permissionsBootstrapping) {
    return variant === 'compact' ? (
      <Button
        disabled
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-full border border-dashed border-muted-foreground/50"
        title="Loading permissions…"
      >
        <Palmtree className="h-3.5 w-3.5" />
      </Button>
    ) : (
      <Button disabled variant="outline" size="sm" title="Loading permissions…" className="glass">
        <Plus className="h-3 w-3 mr-1.5" />
        Add Other Leave
      </Button>
    );
  }

  // If not admin/owner, don't render any buttons
  if (!isAdmin) {
    return null;
  }

  return (
    <>
      {variant === 'compact' ? (
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full border border-dashed border-muted-foreground/50 hover:border-primary hover:bg-primary/10"
        >
          <Palmtree className="h-3.5 w-3.5" />
        </Button>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          size="sm"
          className="glass hover:glass-elevated"
        >
          <Plus className="h-3 w-3 mr-1.5" />
          Add Other Leave
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{otherLeave ? 'Edit' : 'Add'} Other Leave</DialogTitle>
            <DialogDescription>
              {otherLeave ? 'Update' : 'Add'} other leave for the week starting {weekStartDate}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                placeholder="Hours"
                value={hours || ''}
                onChange={(e) => setHours(Number(e.target.value) || 0)}
                min="0"
                step="0.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leaveType">Leave Type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger id="leaveType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sick">Sick</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            {otherLeave && (
              <Button 
                variant="outline"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                Delete
              </Button>
            )}
            <Button
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending || hours <= 0}
              className="bg-gradient-start hover:bg-gradient-mid text-white"
            >
              {updateMutation.isPending ? 'Saving...' : (otherLeave ? 'Update' : 'Save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
