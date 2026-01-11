import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useCompany } from '@/context/CompanyContext';
import { parseInputToHours, hoursToInputDisplay, getAllocationInputConfig } from '@/utils/allocationInput';
import { getAllocationCapacity } from '@/utils/allocationCapacity';
import { saveResourceAllocation } from '@/hooks/allocations/api';
import { formatAllocationValue } from '@/utils/allocationDisplay';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface ResourceAllocationCellProps {
  resourceId?: string;
  projectId?: string;
  hours: number;
  weekStartDate?: string;
  memberCapacity?: number;
  /** Sum of hours from OTHER projects (excluding this one) */
  totalOtherHours?: number;
  /** Total leave hours for this person/week */
  leaveHours?: number;
  /** Whether the cell is editable */
  editable?: boolean;
  /** Callback when allocation is updated */
  onAllocationChange?: (newHours: number) => void;
}

export const ResourceAllocationCell: React.FC<ResourceAllocationCellProps> = ({
  resourceId,
  projectId,
  hours,
  weekStartDate,
  memberCapacity,
  totalOtherHours = 0,
  leaveHours = 0,
  editable = true,
  onAllocationChange,
}) => {
  const { displayPreference, workWeekHours, startOfWorkWeek } = useAppSettings();
  const { company } = useCompany();
  const queryClient = useQueryClient();

  const capacity = getAllocationCapacity({
    displayPreference,
    workWeekHours,
    memberWeeklyCapacity: memberCapacity,
  });

  // State for inline editing
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get input configuration
  const inputConfig = getAllocationInputConfig(displayPreference, capacity);

  // Format display value
  const displayValue = hours > 0 ? formatAllocationValue(hours, capacity, displayPreference, false) : '—';

  // Initialize input value when entering edit mode
  const handleStartEdit = useCallback(() => {
    if (!editable || !resourceId || !projectId || !weekStartDate || !company?.id) return;

    setInputValue(hours > 0 ? hoursToInputDisplay(hours, capacity, displayPreference) : '');
    setIsEditing(true);
  }, [editable, resourceId, projectId, weekStartDate, company?.id, hours, capacity, displayPreference]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Save allocation
  const handleSave = useCallback(async () => {
    // Guard against double-save (Enter triggers blur; blur calls save too)
    if (isSavingRef.current) return;

    if (!resourceId || !projectId || !weekStartDate || !company?.id) {
      setIsEditing(false);
      return;
    }

    const newHours = parseInputToHours(inputValue, capacity, displayPreference);

    console.debug('[alloc-debug] ResourceAllocationCell save', {
      inputValue,
      displayPreference,
      capacity,
      workWeekHours,
      memberCapacity,
      parsedHours: newHours,
      prevHours: hours,
      weekStartDate,
      projectId,
      resourceId,
    });

    // Skip save if no change
    if (newHours === hours) {
      setIsEditing(false);
      return;
    }

    isSavingRef.current = true;
    setIsSaving(true);
    try {
      const success = await saveResourceAllocation(
        projectId,
        resourceId,
        'active', // Default to active type
        weekStartDate,
        newHours,
        company.id,
        startOfWorkWeek
      );

      if (success) {
        // Dispatch event for avatar row sync
        window.dispatchEvent(
          new CustomEvent('allocation-updated', {
            detail: {
              weekKey: weekStartDate,
              resourceId,
              memberId: resourceId,
              projectId,
              hours: newHours,
            },
          })
        );

        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['comprehensive-weekly-allocations'] });
        queryClient.invalidateQueries({ queryKey: ['streamlined-week-resource-data'] });
        queryClient.invalidateQueries({ queryKey: ['available-allocations'] });

        onAllocationChange?.(newHours);
      }
    } catch (error) {
      console.error('Error saving allocation:', error);
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
      setIsEditing(false);
    }
  }, [resourceId, projectId, weekStartDate, company?.id, inputValue, capacity, displayPreference, hours, startOfWorkWeek, queryClient, onAllocationChange]);

  // Handle key events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Let blur be the single path that triggers save
        e.currentTarget.blur();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsEditing(false);
      }
    },
    []
  );

  // Check if editing is possible
  const canEdit = editable && resourceId && projectId && weekStartDate && company?.id;

  // Render edit mode
  if (isEditing) {
    return (
      <div className="allocation-input-container w-full h-full">
        <input
          ref={inputRef}
          type="number"
          min={inputConfig.min}
          max={inputConfig.max}
          step={inputConfig.step}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          placeholder={inputConfig.placeholder}
          className={cn(
            'w-full h-8 text-center text-sm font-medium border rounded',
            'bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary',
            'transition-all duration-150',
            isSaving && 'opacity-50 cursor-wait'
          )}
        />
      </div>
    );
  }

  // Render display mode
  const filledClass = hours > 0 ? 'leave-cell-filled' : '';

  return (
    <div
      className={cn(
        'allocation-input-container w-full h-full',
        filledClass,
        canEdit && 'cursor-pointer hover:bg-accent/50 transition-colors'
      )}
      onClick={canEdit ? handleStartEdit : undefined}
      onKeyDown={
        canEdit
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleStartEdit();
              }
            }
          : undefined
      }
      tabIndex={canEdit ? 0 : undefined}
      role={canEdit ? 'button' : undefined}
      aria-label={canEdit ? `Edit allocation: ${displayValue}` : undefined}
    >
      <div className="w-full h-8 flex items-center justify-center text-lg font-medium">{displayValue}</div>
    </div>
  );
};
