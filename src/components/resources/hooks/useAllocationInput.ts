
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useResourceAllocationsDB, useDateRangeAllocations } from '@/hooks/allocations';

interface UseAllocationInputProps {
  projectId: string;
  resourceId: string;
  resourceType: 'active' | 'pre_registered';
  onAllocationChange: (resourceId: string, dayKey: string, hours: number) => void;
  selectedDate?: Date;
  periodToShow?: number;
}

export const useAllocationInput = ({
  projectId,
  resourceId,
  resourceType,
  onAllocationChange,
  selectedDate,
  periodToShow
}: UseAllocationInputProps) => {
  // Use date range allocations if date parameters are provided, otherwise use the legacy hook
  const legacyHook = useResourceAllocationsDB(projectId, resourceId, resourceType);
  
  const dateRangeHook = useDateRangeAllocations({
    projectId,
    resourceId,
    resourceType,
    selectedDate: selectedDate || new Date(),
    periodToShow
  });
  
  // Use the appropriate hook based on whether date range is specified
  const { 
    allocations, 
    isLoading, 
    refreshAllocations
  } = selectedDate ? dateRangeHook : legacyHook;
  
  // Use saving state from legacy hook (which has save functionality)
  const { isSaving, saveAllocation } = legacyHook;

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
