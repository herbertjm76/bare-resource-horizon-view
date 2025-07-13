import { useState, useEffect, useCallback } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { fetchResourceAllocations } from './api';
import { getStandardizedDateRange } from './utils/dateRangeUtils';

interface UseDateRangeAllocationsProps {
  projectId: string;
  resourceId: string;
  resourceType: 'active' | 'pre_registered';
  selectedDate: Date; // This could be a month start date or specific date
  periodToShow?: number; // Number of weeks to show, default to month-based
}

export function useDateRangeAllocations({
  projectId,
  resourceId,
  resourceType,
  selectedDate,
  periodToShow
}: UseDateRangeAllocationsProps) {
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();

  // Calculate standardized date range based on the view
  const getDateRange = useCallback((date: Date, period?: number) => {
    return getStandardizedDateRange(date, period);
  }, []);

  // Fetch allocations with consistent date range
  const fetchAllocations = useCallback(async () => {
    if (!projectId || !resourceId || !company?.id) return;
    
    setIsLoading(true);
    try {
      const dateRange = getDateRange(selectedDate, periodToShow);
      
      console.log(`🔍 DATE RANGE ALLOCATIONS: Fetching for ${resourceId} with range:`, dateRange);
      console.log(`🔍 DATE RANGE ALLOCATIONS: Period: ${periodToShow ? `${periodToShow} weeks` : 'full month'}`);
      
      const allocationMap = await fetchResourceAllocations(
        projectId,
        resourceId,
        resourceType,
        company.id,
        dateRange
      );
      
      console.log(`🔍 DATE RANGE ALLOCATIONS: Retrieved ${Object.keys(allocationMap).length} allocations`);
      setAllocations(allocationMap);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, resourceId, resourceType, company?.id, selectedDate, periodToShow, getDateRange]);

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

  return {
    allocations,
    isLoading,
    refreshAllocations: fetchAllocations,
    dateRange: getDateRange(selectedDate, periodToShow)
  };
}