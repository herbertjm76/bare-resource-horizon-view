
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatDateKey } from './utils';
import { logger } from '@/utils/logger';

export interface ResourceUtilization {
  resourceId: string;
  totalHours: number;
  weeklyHours: Record<string, number>;
  utilization: number;
  capacity: number;
}

/**
 * Custom hook to track resource utilization across projects
 * 
 * @param resourceIds - Array of resource IDs to track
 * @param weekKeys - Array of week keys to track allocations for
 * @param resourceType - Type of resource (active or pre-registered)
 * @returns Object containing resource utilization data and functions
 */
export function useResourceUtilization(
  resourceIds: string[] = [],
  weekKeys: string[] = [],
  resourceType: 'active' | 'pre_registered' = 'active'
) {
  const [utilizations, setUtilizations] = useState<Record<string, ResourceUtilization>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { companyId } = useCompanyId();
  const { workWeekHours } = useAppSettings();
  
  // Use company's configured work week hours as standard capacity
  const standardCapacity = workWeekHours;

  // Fetch utilization data for the given resources and weeks
  const fetchUtilization = useCallback(async () => {
    if (!companyId || resourceIds.length === 0 || weekKeys.length === 0) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const formattedWeekKeys = weekKeys.map(weekKey => formatDateKey(weekKey));
      
      // Fetch all allocations for the specified resources and weeks
      const { data: allocations, error } = await supabase
        .from('project_resource_allocations')
        .select(`
          resource_id,
          allocation_date,
          hours,
          project:projects(id, name)
        `)
        .eq('resource_type', resourceType)
        .eq('company_id', companyId)
        .in('resource_id', resourceIds)
        .in('allocation_date', formattedWeekKeys);
      
      if (error) throw error;
      
      // Process the allocation data into a structured format
      const utilizationMap: Record<string, ResourceUtilization> = {};
      
      // Initialize utilization data for all resources
      resourceIds.forEach(resourceId => {
        utilizationMap[resourceId] = {
          resourceId,
          totalHours: 0,
          weeklyHours: {},
          utilization: 0,
          capacity: standardCapacity * weekKeys.length
        };
        
        // Initialize all weeks with 0 hours
        weekKeys.forEach(weekKey => {
          const formattedWeekKey = formatDateKey(weekKey);
          utilizationMap[resourceId].weeklyHours[formattedWeekKey] = 0;
        });
      });
      
      // Process allocations
      (allocations || []).forEach(allocation => {
        const { resource_id, allocation_date, hours } = allocation;
        const resourceUtil = utilizationMap[resource_id];
        
        if (resourceUtil) {
          // Update weekly hours
          resourceUtil.weeklyHours[allocation_date] = 
            (resourceUtil.weeklyHours[allocation_date] || 0) + Number(hours);
          
          // Update total hours
          resourceUtil.totalHours += Number(hours);
          
          // Calculate utilization percentage (total hours / capacity)
          resourceUtil.utilization = 
            (resourceUtil.totalHours / resourceUtil.capacity) * 100;
        }
      });
      
      setUtilizations(utilizationMap);
    } catch (error) {
      logger.error('Error fetching resource utilization:', error);
    } finally {
      setIsLoading(false);
    }
  }, [companyId, resourceIds, weekKeys, resourceType, standardCapacity]);
  
  // Refresh utilization data when dependencies change
  useEffect(() => {
    fetchUtilization();
  }, [fetchUtilization]);
  
  // Get utilization data for a specific resource
  const getResourceUtilization = useCallback((resourceId: string): ResourceUtilization => {
    return utilizations[resourceId] || {
      resourceId,
      totalHours: 0,
      weeklyHours: {},
      utilization: 0,
      capacity: standardCapacity * weekKeys.length
    };
  }, [utilizations, weekKeys.length]);
  
  // Calculate overall team utilization
  const getTeamUtilization = useCallback((): number => {
    const totalHours = Object.values(utilizations).reduce((sum, util) => sum + util.totalHours, 0);
    const totalCapacity = standardCapacity * weekKeys.length * resourceIds.length;
    return totalCapacity > 0 ? (totalHours / totalCapacity) * 100 : 0;
  }, [utilizations, weekKeys.length, resourceIds.length]);

  return {
    utilizations,
    isLoading,
    getResourceUtilization,
    getTeamUtilization,
    refreshUtilization: fetchUtilization
  };
}
