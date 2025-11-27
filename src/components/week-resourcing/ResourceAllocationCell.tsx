
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { saveResourceAllocation, deleteResourceAllocation } from '@/hooks/allocations/api';
import { Trash2 } from 'lucide-react';

interface ResourceAllocationCellProps {
  resourceId: string;
  projectId: string;
  hours: number;
  weekStartDate: string;
}

export const ResourceAllocationCell: React.FC<ResourceAllocationCellProps> = ({
  resourceId,
  projectId,
  hours,
  weekStartDate
}) => {
  const { company } = useCompany();
  const [value, setValue] = useState<string>(hours.toString());
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  
  // Update local state when props change
  useEffect(() => {
    setValue(hours.toString());
  }, [hours]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow valid numbers
    if (e.target.value === '' || /^\d+(\.\d{0,1})?$/.test(e.target.value)) {
      setValue(e.target.value);
    }
  };

  const handleBlur = async () => {
    if (!company?.id) return;
    
    const newHours = parseFloat(value) || 0;
    setIsEditing(false);
    
    // No change - skip update
    if (newHours === hours) return;
    
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
      setValue(hours.toString());
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
        />
      ) : (
        <>
          <div
            className="cursor-pointer w-full h-8 flex items-center justify-center hover:bg-gray-50 text-lg font-medium"
            onClick={() => setIsEditing(true)}
          >
            {hours > 0 ? hours : '—'}
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
