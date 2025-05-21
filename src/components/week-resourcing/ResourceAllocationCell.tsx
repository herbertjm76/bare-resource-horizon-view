
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface ResourceAllocationCellProps {
  hours: number;
  resourceId: string;
  projectId: string;
  weekStartDate: string;
}

export const ResourceAllocationCell: React.FC<ResourceAllocationCellProps> = ({
  hours,
  resourceId,
  projectId,
  weekStartDate
}) => {
  const [value, setValue] = useState(hours.toString());
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { company } = useCompany();
  const queryClient = useQueryClient();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Restrict to numbers only
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    setValue(newValue);
  };
  
  const handleStartEdit = () => {
    setIsEditing(true);
  };
  
  const handleBlur = async () => {
    setIsEditing(false);
    const numericValue = parseInt(value) || 0;
    
    // If the value hasn't changed, do nothing
    if (numericValue === hours) {
      return;
    }
    
    if (!company?.id) {
      toast.error("Company ID is missing");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Check if we already have an allocation
      const { data: existingAllocation } = await supabase
        .from('project_resource_allocations')
        .select('id')
        .eq('resource_id', resourceId)
        .eq('project_id', projectId)
        .eq('week_start_date', weekStartDate)
        .eq('company_id', company.id)
        .maybeSingle();
      
      if (existingAllocation) {
        // Update existing allocation
        if (numericValue === 0) {
          // Delete if the value is 0
          await supabase
            .from('project_resource_allocations')
            .delete()
            .eq('id', existingAllocation.id);
        } else {
          // Update with new value
          await supabase
            .from('project_resource_allocations')
            .update({ hours: numericValue })
            .eq('id', existingAllocation.id);
        }
      } else if (numericValue > 0) {
        // Create new allocation
        await supabase
          .from('project_resource_allocations')
          .insert({
            resource_id: resourceId,
            project_id: projectId,
            week_start_date: weekStartDate,
            hours: numericValue,
            resource_type: 'active',
            company_id: company.id
          });
      }
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['week-resource-allocations'] });
      
    } catch (error) {
      console.error('Error saving allocation:', error);
      toast.error('Failed to save allocation');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setValue(hours.toString());
      setIsEditing(false);
    }
  };

  return (
    <div className={`resource-cell ${isSaving ? 'opacity-50' : ''}`}>
      {isEditing ? (
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-16 h-8 text-center"
          autoFocus
        />
      ) : (
        <div 
          className={`
            cursor-pointer py-1 px-2 rounded hover:bg-muted
            ${parseFloat(hours.toString()) > 0 ? 'bg-blue-50' : ''}
          `}
          onClick={handleStartEdit}
        >
          {parseFloat(hours.toString()) > 0 ? `${hours}h` : '-'}
        </div>
      )}
    </div>
  );
};
