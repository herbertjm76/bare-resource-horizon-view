import { useState, useEffect, useMemo } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { convertHoursToInputValue, convertInputToHours } from '@/utils/allocationDisplay';
import { useResourceAllocationsDB, useDateRangeAllocations } from '@/hooks/allocations';
import { logger } from '@/utils/logger';

interface UseAllocationInputProps {
  projectId: string;
  resourceId: string;
  resourceType: 'active' | 'pre_registered';
  onAllocationChange: (resourceId: string, weekKey: string, hours: number) => void;
  selectedDate?: Date;
  periodToShow?: number;
  /** Capacity used when displayPreference is percentage (defaults to company workWeekHours). */
  capacityHours?: number;
}

export const useAllocationInput = ({
  projectId,
  resourceId,
  resourceType,
  onAllocationChange,
  selectedDate,
  periodToShow,
  capacityHours,
}: UseAllocationInputProps) => {
  const { workWeekHours, displayPreference } = useAppSettings();
  const capacity = capacityHours ?? workWeekHours;

  // Use date range allocations if date parameters are provided, otherwise use the legacy hook
  const legacyHook = useResourceAllocationsDB(projectId, resourceId, resourceType);

  const dateRangeHook = useDateRangeAllocations({
    projectId,
    resourceId,
    resourceType,
    selectedDate: selectedDate || new Date(),
    periodToShow,
  });

  // Use the appropriate hook based on whether date range is specified
  const { allocations, isLoading } = selectedDate ? dateRangeHook : legacyHook;

  // Use saving state from legacy hook (which has save functionality)
  const { isSaving, saveAllocation } = legacyHook;

  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const toDisplayString = useMemo(() => {
    return (hours: number) => {
      const displayVal = convertHoursToInputValue(hours, capacity, displayPreference);
      // Keep inputs clean (no trailing .0)
      const asNumber = Number.isFinite(displayVal) ? displayVal : 0;
      const formatted = asNumber % 1 === 0 ? String(asNumber) : asNumber.toFixed(1);
      return hours > 0 ? formatted : '';
    };
  }, [capacity, displayPreference]);

  // Initialize input values from allocations
  useEffect(() => {
    const initialValues: Record<string, string> = {};

    Object.entries(allocations).forEach(([weekKey, hours]) => {
      initialValues[weekKey] = toDisplayString(hours);
    });

    setInputValues(initialValues);
  }, [allocations, toDisplayString]);

  const handleInputChange = (weekKey: string, value: string) => {
    setInputValues((prev) => ({
      ...prev,
      [weekKey]: value,
    }));
  };

  const handleInputBlur = (weekKey: string, value: string) => {
    const numValue = parseFloat(value);
    const inputVal = Number.isFinite(numValue) ? numValue : 0;
    const hours = convertInputToHours(inputVal, capacity, displayPreference);

    logger.debug(`Saving allocation for resource ${resourceId}, key ${weekKey}: ${hours} hours`);

    saveAllocation(weekKey, hours);
    onAllocationChange(resourceId, weekKey, hours);

    // Notify other parts of the UI (e.g. AvailableMembersRow avatar utilization) to refresh instantly.
    // We keep this as a lightweight client-side event so we don't depend on Supabase Realtime.
    window.dispatchEvent(
      new CustomEvent('allocation-updated', {
        detail: { resourceId, weekKey, hours, projectId, resourceType },
      })
    );

    // Normalize what we show after save
    setInputValues((prev) => ({
      ...prev,
      [weekKey]: toDisplayString(hours),
    }));
  };

  return {
    allocations,
    inputValues,
    isLoading,
    isSaving,
    handleInputChange,
    handleInputBlur,
  };
};

