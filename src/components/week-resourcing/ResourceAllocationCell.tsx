
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { saveResourceAllocation, deleteResourceAllocation } from '@/hooks/allocations/api';
import { Trash2 } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { convertToHours, convertFromHours } from '@/utils/displayFormatters';

interface ResourceAllocationCellProps {
  resourceId: string;
  projectId: string;
  hours: number;
  weekStartDate: string;
  memberCapacity?: number;
}

export const ResourceAllocationCell: React.FC<ResourceAllocationCellProps> = ({
  resourceId,
  projectId,
  hours,
  weekStartDate,
  memberCapacity
}) => {
  const { company } = useCompany();
  const { displayPreference, workWeekHours } = useAppSettings();
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
    if (displayPreference === 'percentage' && inputValue > 200) {
      toast.error('Allocation cannot exceed 200%');
      return false;
    }
    // For hours, cap at 200% of capacity
    const maxHours = capacity * 2;
    if (displayPreference === 'hours' && inputValue > maxHours) {
      toast.error(`Allocation cannot exceed ${maxHours}h (200% of capacity)`);
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
        <Input
          className="w-full h-8 text-center p-0 text-lg font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          type="number"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
          disabled={isSaving}
          placeholder={displayPreference === 'percentage' ? '%' : 'h'}
        />
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
