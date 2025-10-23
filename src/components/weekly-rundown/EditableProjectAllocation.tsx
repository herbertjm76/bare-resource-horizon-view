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
      <div className="glass rounded-xl p-4 hover:glass-elevated transition-all duration-300 group">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 flex-1">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: color || 'hsl(var(--primary))' }}
            />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-foreground truncate">
                {projectName}
              </div>
              <div className="text-sm text-muted-foreground">
                {projectCode}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={editedHours}
                  onChange={(e) => setEditedHours(e.target.value)}
                  className="w-20 h-8 text-right"
                  step="0.5"
                  min="0"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="h-8 w-8 p-0"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <div className="text-right">
                  <div className="font-semibold text-foreground">
                    {hours}h
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {percentage.toFixed(0)}% of total
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowDeleteDialog(true)}
                    className="h-8 w-8 p-0 text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <Progress 
          value={isEditing ? Math.min(calculatedPercentage, 100) : percentage} 
          className="h-2"
        />
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
