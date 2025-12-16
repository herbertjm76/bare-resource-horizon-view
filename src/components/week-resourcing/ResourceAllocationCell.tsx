

import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { saveResourceAllocation, deleteResourceAllocation } from '@/hooks/allocations/api';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { convertToHours, convertFromHours } from '@/utils/displayFormatters';
import { getTotalAllocationWarningStatus } from '@/hooks/allocations/utils/utilizationUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ResourceAllocationCellProps {
  resourceId: string;
  projectId: string;
  hours: number;
  weekStartDate: string;
  memberCapacity?: number;
  /** Sum of hours from OTHER projects (excluding this one) */
  totalOtherHours?: number;
  /** Total leave hours for this person/week */
  leaveHours?: number;
}

export const ResourceAllocationCell: React.FC<ResourceAllocationCellProps> = ({
  resourceId,
  projectId,
  hours,
  weekStartDate,
  memberCapacity,
  totalOtherHours = 0,
  leaveHours = 0
}) => {
  const { company } = useCompany();
  const { displayPreference, workWeekHours, allocationWarningThreshold, allocationDangerThreshold, allocationMaxLimit } = useAppSettings();
  const capacity = memberCapacity || workWeekHours;
  
  // Convert hours to display value based on preference
  const getDisplayValue = (h: number) => {
    if (displayPreference === 'percentage') {
      return capacity > 0 ? ((h / capacity) * 100).toString() : '0';
    }
    return h.toString();
  };
  
  const [value, setValue] = useState<string>(getDisplayValue(hours));
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  
  // Calculate warning status based on TOTAL allocation (this project + other projects + leave)
  const warningStatus = useMemo(() => {
    const inputValue = parseFloat(value) || 0;
    // Convert input to hours if in percentage mode
    const currentProjectHours = displayPreference === 'percentage' 
      ? (inputValue / 100) * capacity 
      : inputValue;
    
    return getTotalAllocationWarningStatus(
      currentProjectHours,
      totalOtherHours,
      leaveHours,
      capacity,
      displayPreference,
      allocationWarningThreshold,
      allocationDangerThreshold,
      allocationMaxLimit
    );
  }, [value, displayPreference, capacity, totalOtherHours, leaveHours, allocationWarningThreshold, allocationDangerThreshold, allocationMaxLimit]);

  // Update local state when props change
  useEffect(() => {
    setValue(getDisplayValue(hours));
  }, [hours, displayPreference, capacity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow valid numbers
    if (e.target.value === '' || /^\d+(\.\d{0,1})?$/.test(e.target.value)) {
      setValue(e.target.value);
    }
  };

  const validateInput = (inputValue: number): boolean => {
    // Convert to hours if in percentage mode
    const newHours = displayPreference === 'percentage' 
      ? (inputValue / 100) * capacity 
      : inputValue;
    
    // Calculate total allocation
    const totalHours = newHours + totalOtherHours + leaveHours;
    const totalPercentage = capacity > 0 ? (totalHours / capacity) * 100 : 0;
    
    if (totalPercentage > allocationMaxLimit) {
      if (displayPreference === 'percentage') {
        toast.error(`Total allocation cannot exceed ${allocationMaxLimit}% (currently ${Math.round(totalPercentage)}%)`);
      } else {
        const maxHours = (capacity * allocationMaxLimit) / 100;
        toast.error(`Total allocation cannot exceed ${Math.round(maxHours)}h (currently ${Math.round(totalHours)}h)`);
      }
      return false;
    }
    return true;
  };

  const handleBlur = async () => {
    if (!company?.id) return;
    
    const inputValue = parseFloat(value) || 0;
    
    // Validate before saving
    if (!validateInput(inputValue)) {
      setValue(getDisplayValue(hours));
      setIsEditing(false);
      return;
    }
    
    // Convert display value back to hours if needed
    const newHours = displayPreference === 'percentage' 
      ? (inputValue / 100) * capacity 
      : inputValue;
    
    setIsEditing(false);
    
    // No change - skip update
    if (Math.abs(newHours - hours) < 0.01) return;
    
    setIsSaving(true);
    
    try {
      await saveResourceAllocation(
        projectId,
        resourceId,
        'active',
        weekStartDate,
        newHours,
        company.id
      );
    } catch (error) {
      console.error('Error updating allocation:', error);
      toast.error('Failed to update allocation');
      setValue(getDisplayValue(hours));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!company?.id || hours === 0) return;
    
    setIsSaving(true);
    
    try {
      await deleteResourceAllocation(
        projectId,
        resourceId,
        'active',
        weekStartDate,
        company.id
      );
      toast.success('Allocation deleted');
    } catch (error) {
      console.error('Error deleting allocation:', error);
      toast.error('Failed to delete allocation');
    } finally {
      setIsSaving(false);
    }
  };

  const filledClass = hours > 0 ? 'leave-cell-filled' : '';
  const displayValue = displayPreference === 'percentage' 
    ? `${Math.round((hours / capacity) * 100)}%` 
    : hours;

  return (
    <div 
      className={`allocation-input-container w-full h-full ${filledClass} relative group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditing ? (
        <div className="flex items-center gap-1 w-full">
          {warningStatus.level !== 'normal' && (
            <AlertTriangle className={`h-4 w-4 flex-shrink-0 ${warningStatus.level === 'warning' ? 'text-amber-500' : 'text-destructive'}`} />
          )}
          <TooltipProvider>
            <Tooltip open={warningStatus.level !== 'normal'}>
              <TooltipTrigger asChild>
                <Input
                  className={`w-full h-8 text-center p-0 text-lg font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${warningStatus.borderClass} ${warningStatus.bgClass} ${warningStatus.textClass}`}
                  type="number"
                  value={value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoFocus
                  disabled={isSaving}
                  placeholder={displayPreference === 'percentage' ? '%' : 'h'}
                />
              </TooltipTrigger>
              {warningStatus.message && (
                <TooltipContent side="top" className={warningStatus.level === 'warning' ? 'bg-amber-500 text-white' : 'bg-destructive text-destructive-foreground'}>
                  <p>{warningStatus.message}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <>
          <div
            className="cursor-pointer w-full h-8 flex items-center justify-center hover:bg-gray-50 text-lg font-medium"
            onClick={() => setIsEditing(true)}
          >
            {hours > 0 ? displayValue : '—'}
          </div>
          {hours > 0 && isHovered && !isSaving && (
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-0 right-0 h-full w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
              onClick={handleDelete}
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          )}
        </>
      )}
    </div>
  );
};
