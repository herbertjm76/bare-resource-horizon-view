import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit2, Check, X, Trash2, MapPin, Clock } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue } from '@/utils/allocationDisplay';
import { useCompany } from '@/context/CompanyContext';
import { saveResourceAllocation, deleteResourceAllocation } from '@/hooks/allocations/api';
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

interface EditableTeamMemberAllocationProps {
  member: {
    id: string;
    name: string;
    avatar?: string;
    location: string;
    hours: number;
    capacityPercentage: number;
  };
  projectId: string;
  weekStartDate: string;
  capacity: number;
  onUpdate: () => void;
}

export const EditableTeamMemberAllocation: React.FC<EditableTeamMemberAllocationProps> = ({
  member,
  projectId,
  weekStartDate,
  capacity,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedHours, setEditedHours] = useState(member.hours.toString());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();
  const { displayPreference, startOfWorkWeek } = useAppSettings();
  const { company } = useCompany();

  const getCapacityColor = (percentage: number) => {
    if (percentage > 100) return 'text-destructive';
    if (percentage >= 90) return 'text-orange-500';
    if (percentage >= 60) return 'text-green-500';
    return 'text-muted-foreground';
  };

  const updateMutation = useMutation({
    mutationFn: async (newHours: number) => {
      if (!company?.id) throw new Error('No company context');
      
      // Use canonical API for saving allocations
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
      return success;
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
      if (!company?.id) throw new Error('No company context');
      
      // Use canonical API for deleting allocations
      const success = await deleteResourceAllocation(
        projectId,
        member.id,
        'active',
        weekStartDate,
        company.id,
        startOfWorkWeek
      );
      
      if (!success) throw new Error('Failed to delete allocation');
      return success;
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

  const calculatedPercentage = capacity > 0 ? (parseFloat(editedHours) / capacity) * 100 : 0;
  const displayPercentage = isEditing ? calculatedPercentage : member.capacityPercentage;

  const nameParts = member.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts[nameParts.length - 1] || '';

  return (
    <>
      <div className="glass rounded-xl p-4 hover:glass-elevated transition-all duration-300 group">
        <div className="flex items-center gap-4 mb-3">
          <Avatar className="h-10 w-10 ring-2 ring-white/20 shadow-lg">
            <AvatarImage src={member.avatar} />
            <AvatarFallback className="bg-gradient-modern text-white text-sm backdrop-blur-sm">
              {firstName.charAt(0)}{lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">
                  {member.name}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {member.location}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <Input
                        type="number"
                        value={editedHours}
                        onChange={(e) => setEditedHours(e.target.value)}
                        className="w-20 h-8 text-right"
                        step="0.5"
                        min="0"
                      />
                      <div className={`text-sm font-medium ${getCapacityColor(displayPercentage)}`}>
                        {displayPercentage.toFixed(0)}% capacity
                      </div>
                    </div>
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
                        {formatAllocationValue(member.hours, capacity, displayPreference)}
                      </div>
                      <div className={`text-sm font-medium ${getCapacityColor(member.capacityPercentage)}`}>
                        {member.capacityPercentage.toFixed(0)}% capacity
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
          </div>
        </div>
        
        <Progress 
          value={Math.min(displayPercentage, 100)} 
          className="h-2"
        />
        
        {displayPercentage > 100 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-destructive">
            <Clock className="h-3 w-3" />
            Overallocated by {(displayPercentage - 100).toFixed(0)}%
          </div>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove team member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {member.name}'s allocation of {formatAllocationValue(member.hours, capacity, displayPreference)} from this project for this week.
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
