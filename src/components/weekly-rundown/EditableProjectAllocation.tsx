import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, Trash2, AlertTriangle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';
import { saveResourceAllocation, deleteResourceAllocation } from '@/hooks/allocations/api';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName } from '@/utils/projectDisplay';
import { getTotalAllocationWarningStatus } from '@/hooks/allocations/utils/utilizationUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
// RULEBOOK: Use canonical input parsing utilities
import { 
  parseInputToHours, 
  hoursToInputDisplay, 
  formatHoursForDisplay,
  getAllocationInputConfig 
} from '@/utils/allocationInput';

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
  /** Sum of hours from OTHER projects (excluding this one) */
  totalOtherHours?: number;
  /** Total leave hours for this person/week */
  leaveHours?: number;
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
  totalOtherHours = 0,
  leaveHours = 0,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();
  const { company } = useCompany();
  const { projectDisplayPreference, displayPreference, workWeekHours, allocationWarningThreshold, allocationDangerThreshold, allocationMaxLimit, startOfWorkWeek } = useAppSettings();
  
  const effectiveCapacity = capacity || workWeekHours;
  
  // RULEBOOK: Use canonical input utilities for consistent hours<->display conversion
  const [editedValue, setEditedValue] = useState(() => 
    hoursToInputDisplay(hours, effectiveCapacity, displayPreference)
  );
  
  // Reset editedValue whenever the hours prop changes (e.g., after save or external update)
  useEffect(() => {
    if (!isEditing) {
      setEditedValue(hoursToInputDisplay(hours, effectiveCapacity, displayPreference));
    }
  }, [hours, effectiveCapacity, displayPreference, isEditing]);
  
  const displayText = getProjectDisplayName({ code: projectCode, name: projectName }, projectDisplayPreference);
  const formattedHours = formatHoursForDisplay(hours, effectiveCapacity, displayPreference);
  const inputConfig = getAllocationInputConfig(displayPreference, effectiveCapacity);

  // RULEBOOK: Calculate warning status using canonical parsing
  const warningStatus = useMemo(() => {
    // Use canonical parsing to convert input to hours
    const currentProjectHours = parseInputToHours(editedValue, effectiveCapacity, displayPreference);
    
    return getTotalAllocationWarningStatus(
      currentProjectHours,
      totalOtherHours,
      leaveHours,
      effectiveCapacity,
      displayPreference,
      allocationWarningThreshold,
      allocationDangerThreshold,
      allocationMaxLimit
    );
  }, [editedValue, displayPreference, effectiveCapacity, totalOtherHours, leaveHours, allocationWarningThreshold, allocationDangerThreshold, allocationMaxLimit]);

  const updateMutation = useMutation({
    mutationFn: async (newHours: number) => {
      if (!company?.id) {
        throw new Error('Company context is missing');
      }

      const success = await saveResourceAllocation(
        projectId,
        memberId,
        'active',
        weekStartDate,
        newHours,
        company.id,
        startOfWorkWeek
      );

      if (!success) {
        throw new Error('Failed to save allocation');
      }
    },
    onSuccess: () => {
      toast.success('Allocation updated');
      queryClient.invalidateQueries({ queryKey: ['comprehensive-weekly-allocations'] });
      queryClient.invalidateQueries({ queryKey: ['detailed-weekly-allocations'] });
      queryClient.invalidateQueries({ queryKey: ['streamlined-week-resource-data'] });
      queryClient.invalidateQueries({ queryKey: ['available-allocations'] });
      queryClient.invalidateQueries({ queryKey: ['available-members-profiles'] });
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
      if (!company?.id) {
        throw new Error('Company context is missing');
      }

      const success = await deleteResourceAllocation(
        projectId,
        memberId,
        'active',
        weekStartDate,
        company.id,
        startOfWorkWeek
      );

      if (!success) {
        throw new Error('Failed to delete allocation');
      }
    },
    onSuccess: () => {
      toast.success('Allocation removed');
      queryClient.invalidateQueries({ queryKey: ['comprehensive-weekly-allocations'] });
      queryClient.invalidateQueries({ queryKey: ['detailed-weekly-allocations'] });
      queryClient.invalidateQueries({ queryKey: ['streamlined-week-resource-data'] });
      queryClient.invalidateQueries({ queryKey: ['available-allocations'] });
      queryClient.invalidateQueries({ queryKey: ['available-members-profiles'] });
      onUpdate();
    },
    onError: (error) => {
      toast.error('Failed to remove allocation');
      console.error('Delete error:', error);
    }
  });

  const handleSave = () => {
    // RULEBOOK: Use canonical parsing for consistent input handling
    const newHours = parseInputToHours(editedValue, effectiveCapacity, displayPreference);
    
    if (newHours < 0) {
      toast.error('Please enter a valid number');
      return;
    }
    
    // Calculate total allocation for validation
    const totalHours = newHours + totalOtherHours + leaveHours;
    const totalPercentage = effectiveCapacity > 0 ? (totalHours / effectiveCapacity) * 100 : 0;
    
    // Validate against max limit using TOTAL allocation
    if (totalPercentage > allocationMaxLimit) {
      if (displayPreference === 'percentage') {
        toast.error(`Total allocation cannot exceed ${allocationMaxLimit}% (currently ${Math.round(totalPercentage)}%)`);
      } else {
        const maxHours = (effectiveCapacity * allocationMaxLimit) / 100;
        toast.error(`Total allocation cannot exceed ${Math.round(maxHours)}h (currently ${Math.round(totalHours)}h)`);
      }
      return;
    }
    
    updateMutation.mutate(newHours);
  };

  const handleCancel = () => {
    setEditedValue(hoursToInputDisplay(hours, effectiveCapacity, displayPreference));
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
    setShowDeleteDialog(false);
  };

  const calculatedPercentage = effectiveCapacity > 0 ? (parseFloat(editedValue) / (displayPreference === 'percentage' ? 100 : effectiveCapacity)) * 100 : 0;

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
            {warningStatus.level !== 'normal' && (
              <AlertTriangle className={`h-3 w-3 flex-shrink-0 ${warningStatus.level === 'warning' ? 'text-amber-500' : 'text-destructive'}`} />
            )}
            <TooltipProvider>
              <Tooltip open={warningStatus.level !== 'normal'}>
                <TooltipTrigger asChild>
                  <Input
                    type="number"
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    className={`w-14 h-7 text-xs text-center bg-background/90 ${warningStatus.textClass || 'text-foreground'} ${warningStatus.borderClass} ${warningStatus.bgClass}`}
                    step={String(inputConfig.step)}
                    min={String(inputConfig.min)}
                    max={String(inputConfig.max)}
                    placeholder={inputConfig.placeholder}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave();
                      if (e.key === 'Escape') handleCancel();
                    }}
                  />
                </TooltipTrigger>
                {warningStatus.message && (
                  <TooltipContent side="top" className={warningStatus.level === 'warning' ? 'bg-amber-500 text-white' : 'bg-destructive text-destructive-foreground'}>
                    <p>{warningStatus.message}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
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
              <span>{displayText} • {formattedHours}</span>
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
              This will remove the allocation of {formattedHours} for {projectName} ({projectCode}) from this week.
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
