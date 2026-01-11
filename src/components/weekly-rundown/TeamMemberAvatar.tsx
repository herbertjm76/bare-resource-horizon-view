import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StandardizedBadge } from '@/components/ui/standardized-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Pencil, Trash2, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MemberVacationPopover } from './MemberVacationPopover';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useCompany } from '@/context/CompanyContext';
import { formatDualAllocationValue } from '@/utils/allocationDisplay';
import {
  getAllocationInputConfig,
  hoursToInputDisplay,
  parseInputToHours,
} from '@/utils/allocationInput';
import { deleteResourceAllocation, saveResourceAllocation } from '@/hooks/allocations/api';

interface TeamMemberAvatarProps {
  member: {
    id: string;
    name: string;
    avatar?: string;
    hours: number;
  };
  projectId: string;
  /** YYYY-MM-DD week start (already normalized to company week start) */
  weekStartDate: string;
  onUpdate: () => void;
}

export const TeamMemberAvatar: React.FC<TeamMemberAvatarProps> = ({
  member,
  projectId,
  weekStartDate,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const queryClient = useQueryClient();
  const { company } = useCompany();
  const { workWeekHours, displayPreference, startOfWorkWeek } = useAppSettings();

  const capacity = workWeekHours || 40;
  const inputConfig = useMemo(
    () => getAllocationInputConfig(displayPreference, capacity),
    [displayPreference, capacity]
  );

  const nameParts = member.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts[nameParts.length - 1] || '';

  // Keep input in sync with latest value when not actively editing
  useEffect(() => {
    if (!isEditing) {
      setEditedValue(hoursToInputDisplay(member.hours, capacity, displayPreference));
    }
  }, [member.hours, capacity, displayPreference, isEditing]);

  const updateMutation = useMutation({
    mutationFn: async (newHours: number) => {
      if (!company?.id) throw new Error('Company context is missing');

      const success = await saveResourceAllocation(
        projectId,
        member.id,
        'active',
        weekStartDate,
        newHours,
        company.id,
        startOfWorkWeek
      );

      if (!success) throw new Error('Failed to save allocation');
      return true;
    },
    onSuccess: () => {
      toast.success('Allocation updated');
      // Weekly Overview is driven by streamlined-week-resource-data; keep invalidation tight.
      queryClient.invalidateQueries({ queryKey: ['streamlined-week-resource-data'] });
      setIsEditing(false);
      onUpdate();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update allocation');
      console.error('Update error:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!company?.id) throw new Error('Company context is missing');

      const success = await deleteResourceAllocation(
        projectId,
        member.id,
        'active',
        weekStartDate,
        company.id,
        startOfWorkWeek
      );

      if (!success) throw new Error('Failed to delete allocation');
      return true;
    },
    onSuccess: () => {
      toast.success('Team member removed');
      queryClient.invalidateQueries({ queryKey: ['streamlined-week-resource-data'] });
      onUpdate();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to remove team member');
      console.error('Delete error:', error);
    },
  });

  const handleSave = () => {
    const newHours = parseInputToHours(editedValue, capacity, displayPreference);

    if (!Number.isFinite(newHours) || newHours < 0) {
      toast.error('Please enter a valid number');
      return;
    }

    updateMutation.mutate(newHours);
  };

  const handleCancel = () => {
    setEditedValue(hoursToInputDisplay(member.hours, capacity, displayPreference));
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
    setShowDeleteDialog(false);
  };

  return (
    <TooltipProvider>
      <div className="relative group">
        {isEditing ? (
          <div className="flex flex-col items-center gap-2 p-2 bg-background/90 backdrop-blur-sm rounded-lg border border-border">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20 shadow-lg">
              <AvatarImage src={member.avatar} />
              <AvatarFallback className="bg-gradient-modern text-white backdrop-blur-sm text-xs">
                {firstName.charAt(0)}
                {lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <Input
              type="number"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              className="w-20 h-8 text-center"
              step={String(inputConfig.step)}
              min={String(inputConfig.min)}
              max={String(inputConfig.max)}
              placeholder={inputConfig.placeholder}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />

            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="h-7 w-7 p-0"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                className="h-7 w-7 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          <MemberVacationPopover memberId={member.id} memberName={member.name} weekStartDate={weekStartDate}>
            <div className="cursor-pointer">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <div className="relative flex flex-col items-center gap-0.5">
                    <div className="relative">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/20 shadow-lg hover:ring-primary/40 transition-all hover:scale-105">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-gradient-modern text-white backdrop-blur-sm text-xs">
                          {firstName.charAt(0)}
                          {lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Edit/Delete buttons on hover */}
                      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                          }}
                          className="h-6 w-6 p-0 rounded-full shadow-lg"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteDialog(true);
                          }}
                          className="h-6 w-6 p-0 rounded-full shadow-lg"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <p className="font-semibold text-xs text-foreground">{firstName}</p>
                      <StandardizedBadge variant="metric" size="sm">
                        {formatDualAllocationValue(member.hours, capacity, displayPreference)}
                      </StandardizedBadge>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-xs text-muted-foreground/70">Edit allocation for this week</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </MemberVacationPopover>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove team member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {member.name}'s allocation of{' '}
              {formatDualAllocationValue(member.hours, capacity, displayPreference)} from this project for
              this week.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};
