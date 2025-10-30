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
        .eq('week_start_date', weekStartDate)
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
        .eq('week_start_date', weekStartDate);

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
      <div className="glass rounded-lg p-2.5 hover:glass-elevated transition-all duration-300 group">
        <div className="flex items-center gap-2.5">
          {/* Color Pill */}
          <div 
            className="w-1 h-6 rounded-full flex-shrink-0"
            style={{ backgroundColor: color || 'hsl(var(--primary))' }}
          />
          
          {/* Project Info */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm font-semibold text-foreground">
              {projectCode}
            </span>
            <span className="text-sm text-muted-foreground truncate">
              {projectName}
            </span>
          </div>
          
          {/* Hours Badge */}
          {!isEditing && (
            <div className="px-2.5 py-1 bg-primary/10 rounded-full">
              <span className="text-sm font-semibold text-primary">
                {hours}h
              </span>
            </div>
          )}
          
          {/* Edit Controls */}
          {isEditing ? (
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={editedHours}
                onChange={(e) => setEditedHours(e.target.value)}
                className="w-16 h-7 text-sm text-right"
                step="0.5"
                min="0"
              />
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
          ) : (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-7 w-7 p-0"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowDeleteDialog(true)}
                className="h-7 w-7 p-0 text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
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
