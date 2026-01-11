import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue } from '@/utils/allocationDisplay';
import { getWeekStartDate } from '@/components/weekly-overview/utils';
import { useCompany } from '@/context/CompanyContext';
import { saveResourceAllocation } from '@/hooks/allocations/api';
import {
  getAllocationInputConfig,
  hoursToInputDisplay,
  parseInputToHours,
} from '@/utils/allocationInput';
import { useQueryClient } from '@tanstack/react-query';

interface EditProjectAllocationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
  selectedWeek: Date;
}

export const EditProjectAllocationsDialog: React.FC<EditProjectAllocationsDialogProps> = ({
  open,
  onOpenChange,
  project,
  selectedWeek,
}) => {
  const queryClient = useQueryClient();
  const { company } = useCompany();
  const { displayPreference, workWeekHours, startOfWorkWeek } = useAppSettings();
  const capacity = workWeekHours || 40;

  const inputConfig = useMemo(
    () => getAllocationInputConfig(displayPreference, capacity),
    [displayPreference, capacity]
  );

  const weekStart = useMemo(
    () => getWeekStartDate(selectedWeek, startOfWorkWeek),
    [selectedWeek, startOfWorkWeek]
  );
  const weekStartKey = useMemo(() => format(weekStart, 'yyyy-MM-dd'), [weekStart]);

  const [values, setValues] = useState<Record<string, string>>({});
  const [savingMemberId, setSavingMemberId] = useState<string | null>(null);

  // Initialize input values when dialog opens / project changes
  // Use member-specific capacity for accurate display
  useEffect(() => {
    if (!open) return;
    const next: Record<string, string> = {};
    (project?.teamMembers || []).forEach((m: any) => {
      const memberCapacity = m.weekly_capacity || m.capacity || workWeekHours || 40;
      next[m.id] = hoursToInputDisplay(Number(m.hours || 0), memberCapacity, displayPreference);
    });
    setValues(next);
  }, [open, project?.id, project?.teamMembers, workWeekHours, displayPreference]);

  // Get member-specific capacity (Phase 5: consistent capacity source)
  const getMemberCapacity = (member: any) => 
    member.weekly_capacity || member.capacity || workWeekHours || 40;

  const handleSave = async (memberId: string, memberName: string, member: any) => {
    if (!company?.id) {
      toast.error('Company context is missing');
      return;
    }
    if (!project?.id) {
      toast.error('Project is missing');
      return;
    }

    const input = values[memberId] ?? '';
    // Use member-specific capacity for accurate % to hours conversion
    const memberCapacity = getMemberCapacity(member);
    const hoursValue = parseInputToHours(input, memberCapacity, displayPreference);

    if (!Number.isFinite(hoursValue) || hoursValue < 0) {
      toast.error('Please enter a valid number');
      return;
    }

    setSavingMemberId(memberId);
    try {
      const ok = await saveResourceAllocation(
        project.id,
        memberId,
        'active',
        weekStartKey,
        hoursValue,
        company.id,
        startOfWorkWeek
      );

      if (!ok) throw new Error('Save failed');

      toast.success(`Updated allocation for ${memberName}`);

      // Optimistic UI update - immediately reflect the saved value
      setValues((prev) => ({
        ...prev,
        [memberId]: hoursToInputDisplay(hoursValue, memberCapacity, displayPreference)
      }));

      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('allocation-updated', {
        detail: { weekKey: weekStartKey, resourceId: memberId, projectId: project.id, hours: hoursValue }
      }));

      // Fire-and-forget invalidations for instant feedback (Phase 2)
      void queryClient.invalidateQueries({ queryKey: ['streamlined-week-resource-data'] });
      void queryClient.invalidateQueries({ queryKey: ['detailed-weekly-allocations'] });
      void queryClient.invalidateQueries({ queryKey: ['comprehensive-weekly-allocations'] });
      void queryClient.invalidateQueries({ queryKey: ['available-allocations'] });
    } catch (e: any) {
      toast.error(e?.message || 'Failed to save allocation');
    } finally {
      setSavingMemberId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Team Allocations - {project?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground mb-4">
            Week: {format(weekStart, 'MMM dd, yyyy')}
          </div>

          {project?.teamMembers && project.teamMembers.length > 0 ? (
            <div className="space-y-3">
              {project.teamMembers.map((member: any) => (
                <div key={member.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-xs">
                      {member.name?.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Current:{' '}
                      {formatAllocationValue(member.hours || 0, getMemberCapacity(member), displayPreference)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      inputMode="decimal"
                      value={values[member.id] ?? ''}
                      onChange={(e) => setValues((prev) => ({ ...prev, [member.id]: e.target.value }))}
                      className="w-24"
                      step={String(inputConfig.step)}
                      placeholder={inputConfig.placeholder}
                      aria-label={`Allocation for ${member.name}`}
                    />

                    <Button
                      size="sm"
                      onClick={() => handleSave(member.id, member.name, member)}
                      disabled={savingMemberId === member.id}
                    >
                      {savingMemberId === member.id ? 'Saving…' : 'Save'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No team members allocated</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
