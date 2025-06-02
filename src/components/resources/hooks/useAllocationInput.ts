
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useResourceAllocationsDB } from '@/hooks/allocations';

interface UseAllocationInputProps {
  projectId: string;
  resourceId: string;
  resourceType: 'active' | 'pre_registered';
  onAllocationChange: (resourceId: string, dayKey: string, hours: number) => void;
}

export const useAllocationInput = ({
  projectId,
  resourceId,
  resourceType,
  onAllocationChange
}: UseAllocationInputProps) => {
  const { 
    allocations, 
    isLoading, 
    isSaving, 
    saveAllocation 
  } = useResourceAllocationsDB(projectId, resourceId, resourceType);

  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  // Initialize input values from allocations
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    
    Object.entries(allocations).forEach(([dayKey, hours]) => {
      initialValues[dayKey] = hours > 0 ? hours.toString() : '';
    });
    
    setInputValues(initialValues);
  }, [allocations]);

  const handleInputChange = (dayKey: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [dayKey]: value
    }));
  };

  const handleInputBlur = (dayKey: string, value: string) => {
    const numValue = parseInt(value, 10);
    const hours = isNaN(numValue) ? 0 : numValue;
    
    console.log(`Saving allocation for resource ${resourceId}, day ${dayKey}: ${hours} hours`);
    
    saveAllocation(dayKey, hours);
    onAllocationChange(resourceId, dayKey, hours);
  };

  return {
    allocations,
    inputValues,
    isLoading,
    isSaving,
    handleInputChange,
    handleInputBlur
  };
};
