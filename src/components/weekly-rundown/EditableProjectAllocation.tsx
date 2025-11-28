import React, { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit2, Check, X, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
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

interface EditableProjectAllocationProps {
  memberId: string;
  projectId: string;
  projectName: string;
  projectCode: string;
  hours: number;
  percentage: number;
  color?: string;
  weekStartDate: string;
  capacity: number;
  onUpdate: () => void;
}

export const EditableProjectAllocation: React.FC<EditableProjectAllocationProps> = ({
  memberId,
  projectId,
  projectName,
  projectCode,
  hours,
  percentage,
  color,
  weekStartDate,
  capacity,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedHours, setEditedHours] = useState(hours.toString());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (newHours: number) => {
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .update({ 
          hours: newHours,
          updated_at: new Date().toISOString()
        })
        .eq('resource_id', memberId)
        .eq('project_id', projectId)
        .eq('allocation_date', weekStartDate)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Allocation updated');
      queryClient.invalidateQueries({ queryKey: ['comprehensive-weekly-allocations'] });
      setIsEditing(false);
      onUpdate();
    },
    onError: (error) => {
      toast.error('Failed to update allocation');
      console.error('Update error:', error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('project_resource_allocations')
        .delete()
        .eq('resource_id', memberId)
        .eq('project_id', projectId)
        .eq('allocation_date', weekStartDate);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Allocation removed');
      queryClient.invalidateQueries({ queryKey: ['comprehensive-weekly-allocations'] });
      onUpdate();
    },
    onError: (error) => {
      toast.error('Failed to remove allocation');
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
    setEditedHours(hours.toString());
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
    setShowDeleteDialog(false);
  };

  const calculatedPercentage = capacity > 0 ? (parseFloat(editedHours) / capacity) * 100 : 0;

  return (
    <>
      {/* Bar Segment */}
      <div
        className="h-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:brightness-110 transition-all border-r border-white/20 relative group"
        style={{
          width: `${percentage}%`,
          backgroundColor: color || 'hsl(var(--primary))',
        }}
        onClick={() => !isEditing && setIsEditing(true)}
      >
        {isEditing ? (
          <div className="flex items-center gap-1 px-2">
            <Input
              type="number"
              value={editedHours}
              onChange={(e) => setEditedHours(e.target.value)}
              className="w-14 h-7 text-xs text-center bg-white/90"
              step="0.5"
              min="0"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              disabled={updateMutation.isPending}
              className="h-6 w-6 p-0 bg-white/20 hover:bg-white/30"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              className="h-6 w-6 p-0 bg-white/20 hover:bg-white/30"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <>
            {/* Only show text label if segment is wide enough */}
            {percentage > 10 && (
              <span>{projectCode} • {hours}h</span>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
              }}
              className="absolute right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive/80 hover:bg-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove project allocation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the allocation of {hours}h for {projectName} ({projectCode}) from this week.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
