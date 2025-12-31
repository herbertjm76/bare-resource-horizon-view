
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useResourceAllocationsDB, useDateRangeAllocations } from '@/hooks/allocations';
import { logger } from '@/utils/logger';

interface UseAllocationInputProps {
  projectId: string;
  resourceId: string;
  resourceType: 'active' | 'pre_registered';
  onAllocationChange: (resourceId: string, weekKey: string, hours: number) => void;
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
    
    Object.entries(allocations).forEach(([weekKey, hours]) => {
      initialValues[weekKey] = hours > 0 ? hours.toString() : '';
    });
    
    setInputValues(initialValues);
  }, [allocations]);

  const handleInputChange = (weekKey: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [weekKey]: value
    }));
  };

  const handleInputBlur = (weekKey: string, value: string) => {
    const numValue = parseInt(value, 10);
    const hours = isNaN(numValue) ? 0 : numValue;
    
    logger.debug(`Saving allocation for resource ${resourceId}, week ${weekKey}: ${hours} hours`);
    
    // Save directly with week key (no conversion needed)
    saveAllocation(weekKey, hours);
    onAllocationChange(resourceId, weekKey, hours);
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
