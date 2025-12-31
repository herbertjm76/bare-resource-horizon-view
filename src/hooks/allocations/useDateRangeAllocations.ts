import { useState, useEffect, useCallback } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { fetchResourceAllocations } from './api';
import { getStandardizedDateRange } from './utils/dateRangeUtils';
import { ResourceAllocation } from './types';
import { formatDateKey } from './utils';
import { logger } from '@/utils/logger';

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
      
      logger.log(`DATE RANGE ALLOCATIONS: Fetching for ${resourceId} with range:`, dateRange);
      logger.log(`DATE RANGE ALLOCATIONS: Period: ${periodToShow ? `${periodToShow} weeks` : 'full month'}`);
      
      const allocationMap = await fetchResourceAllocations(
        projectId,
        resourceId,
        resourceType,
        company.id,
        dateRange
      );
      
      logger.log(`DATE RANGE ALLOCATIONS: Retrieved ${Object.keys(allocationMap).length} allocations`);
      setAllocations(allocationMap);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, resourceId, resourceType, company?.id, selectedDate, periodToShow, getDateRange]);

  // Setup realtime subscription for instant updates
  useEffect(() => {
    if (!projectId || !resourceId || !company?.id) return;
    
    // Fetch initial data
    fetchAllocations();
    
    // Setup realtime subscription for this resource
    const channel = supabase
      .channel('date-range-resource-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'project_resource_allocations',
        filter: `project_id=eq.${projectId} AND resource_id=eq.${resourceId} AND resource_type=eq.${resourceType}`
      }, (payload) => {
        logger.log('Real-time update received:', payload);
        
        // Handle different types of changes
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const newData = payload.new as ResourceAllocation;
          const weekKey = formatDateKey(newData.allocation_date);
          
          setAllocations(prev => ({
            ...prev,
            [weekKey]: newData.hours
          }));
        } 
        else if (payload.eventType === 'DELETE') {
          const oldData = payload.old as ResourceAllocation;
          const weekKey = formatDateKey(oldData.allocation_date);
          
          setAllocations(prev => {
            const updated = { ...prev };
            delete updated[weekKey];
            return updated;
          });
        }
      })
      .subscribe();
    
    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, resourceId, resourceType, company?.id, fetchAllocations]);

  return {
    allocations,
    isLoading,
    refreshAllocations: fetchAllocations,
    dateRange: getDateRange(selectedDate, periodToShow)
  };
}
