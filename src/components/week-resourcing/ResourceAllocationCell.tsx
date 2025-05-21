
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';

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
      console.log(`Updating allocation for resource ${resourceId}, project ${projectId}, week ${weekStartDate}, hours: ${newHours}`);
      
      if (hours > 0) {
        // Update existing allocation
        const { error } = await supabase
          .from('project_resource_allocations')
          .update({ hours: newHours, updated_at: new Date().toISOString() })
          .eq('project_id', projectId)
          .eq('resource_id', resourceId)
          .eq('week_start_date', weekStartDate);
          
        if (error) throw error;
      } else {
        // Create new allocation
        const { error } = await supabase
          .from('project_resource_allocations')
          .insert({
            project_id: projectId,
            resource_id: resourceId,
            resource_type: 'active',
            hours: newHours,
            week_start_date: weekStartDate,
            company_id: company.id
          });
          
        if (error) throw error;
      }
      
      toast.success('Resource allocation updated');
    } catch (error) {
      console.error('Error updating allocation:', error);
      toast.error('Failed to update allocation');
      setValue(hours.toString());
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative">
      {isEditing ? (
        <Input
          className="w-16 h-8 text-center"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
          disabled={isSaving}
        />
      ) : (
        <div
          className="cursor-pointer w-16 h-8 flex items-center justify-center hover:bg-gray-50 rounded-md"
          onClick={() => setIsEditing(true)}
        >
          {hours > 0 ? `${hours}h` : '—'}
        </div>
      )}
    </div>
  );
};
