import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StandardizedBadge } from "@/components/ui/standardized-badge";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, Trash2, Plus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MemberVacationPopover } from './MemberVacationPopover';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatDualAllocationValue } from '@/utils/allocationDisplay';

interface TeamMemberAvatarProps {
  member: {
    id: string;
    name: string;
    avatar?: string;
    hours: number;
  };
  projectId: string;
  weekStartDate: string;
  onUpdate: () => void;
}

export const TeamMemberAvatar: React.FC<TeamMemberAvatarProps> = ({
  member,
  projectId,
  weekStartDate,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedHours, setEditedHours] = useState(member.hours.toString());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();
  const { workWeekHours, displayPreference } = useAppSettings();
  const capacity = workWeekHours;

  const nameParts = member.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts[nameParts.length - 1] || '';

  const updateMutation = useMutation({
    mutationFn: async (newHours: number) => {
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .update({ 
          hours: newHours,
          updated_at: new Date().toISOString()
        })
        .eq('resource_id', member.id)
        .eq('project_id', projectId)
        .eq('allocation_date', weekStartDate)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Hours updated');
      queryClient.invalidateQueries({ queryKey: ['comprehensive-weekly-allocations'] });
      setIsEditing(false);
      onUpdate();
    },
    onError: (error) => {
      toast.error('Failed to update hours');
      console.error('Update error:', error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('project_resource_allocations')
        .delete()
        .eq('resource_id', member.id)
        .eq('project_id', projectId)
        .eq('allocation_date', weekStartDate);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Team member removed');
      queryClient.invalidateQueries({ queryKey: ['comprehensive-weekly-allocations'] });
      onUpdate();
    },
    onError: (error) => {
      toast.error('Failed to remove team member');
      console.error('Delete error:', error);
    }
  });

  const handleSave = () => {
    const newHours = parseFloat(editedHours);
    if (isNaN(newHours) || newHours < 0) {
      toast.error('Please enter a valid number');
      return;
    }
    updateMutation.mutate(newHours);
  };

  const handleCancel = () => {
    setEditedHours(member.hours.toString());
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
                {firstName.charAt(0)}{lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Input
              type="number"
              value={editedHours}
              onChange={(e) => setEditedHours(e.target.value)}
              className="w-20 h-8 text-center"
              step="0.5"
              min="0"
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
          <MemberVacationPopover
            memberId={member.id}
            memberName={member.name}
            weekStartDate={weekStartDate}
          >
            <div className="cursor-pointer">
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <div className="relative flex flex-col items-center gap-2">
                    <div className="relative">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/20 shadow-lg hover:ring-primary/40 transition-all hover:scale-105">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-gradient-modern text-white backdrop-blur-sm text-xs">
                          {firstName.charAt(0)}{lastName.charAt(0)}
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
                          <Check className="h-3 w-3" />
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
                    
                    {/* Name and hours below avatar */}
                    <div className="flex flex-col items-center gap-1">
                      <p className="font-semibold text-sm text-foreground">{firstName}</p>
                      <StandardizedBadge variant="metric" size="sm">
                        {formatDualAllocationValue(member.hours, capacity, displayPreference)}
                      </StandardizedBadge>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-xs text-muted-foreground/70">Click to add hours or leave</p>
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
              This will remove {member.name}'s allocation of {formatDualAllocationValue(member.hours, capacity, displayPreference)} from this project for this week.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};
