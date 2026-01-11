/**
 * Canonical Allocation Save Hook
 * 
 * RULE BOOK: All allocation writes MUST go through this hook or the 
 * saveResourceAllocation/deleteResourceAllocation API functions.
 * 
 * This hook provides a React-friendly interface to the canonical API.
 */

import { useCallback } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { useAppSettings } from '@/hooks/useAppSettings';
import { saveResourceAllocation, deleteResourceAllocation } from '@/hooks/allocations/api';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface UseCanonicalAllocationSaveOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useCanonicalAllocationSave(options?: UseCanonicalAllocationSaveOptions) {
  const { company } = useCompany();
  const { startOfWorkWeek } = useAppSettings();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const save = useCallback(async (
    projectId: string,
    resourceId: string,
    resourceType: 'active' | 'pre_registered',
    weekKey: string,
    hours: number
  ): Promise<boolean> => {
    if (!company?.id) {
      toast({
        title: 'Error',
        description: 'No company context available',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const success = await saveResourceAllocation(
        projectId,
        resourceId,
        resourceType,
        weekKey,
        hours,
        company.id,
        startOfWorkWeek
      );

      if (success) {
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['allocations'] });
        queryClient.invalidateQueries({ queryKey: ['comprehensive-weekly-allocations'] });
        queryClient.invalidateQueries({ queryKey: ['detailed-weekly-allocations'] });
        queryClient.invalidateQueries({ queryKey: ['person-resource-data'] });
        
        // Dispatch custom event for real-time UI updates
        window.dispatchEvent(new CustomEvent('allocation-updated', {
          detail: { resourceId, projectId, weekKey, hours }
        }));
        
        options?.onSuccess?.();
      }

      return success;
    } catch (error) {
      console.error('[canonical-save] Error:', error);
      options?.onError?.(error instanceof Error ? error : new Error('Unknown error'));
      return false;
    }
  }, [company?.id, startOfWorkWeek, toast, queryClient, options]);

  const remove = useCallback(async (
    projectId: string,
    resourceId: string,
    resourceType: 'active' | 'pre_registered',
    weekKey: string
  ): Promise<boolean> => {
    if (!company?.id) {
      toast({
        title: 'Error',
        description: 'No company context available',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const success = await deleteResourceAllocation(
        projectId,
        resourceId,
        resourceType,
        weekKey,
        company.id,
        startOfWorkWeek
      );

      if (success) {
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['allocations'] });
        queryClient.invalidateQueries({ queryKey: ['comprehensive-weekly-allocations'] });
        queryClient.invalidateQueries({ queryKey: ['detailed-weekly-allocations'] });
        queryClient.invalidateQueries({ queryKey: ['person-resource-data'] });
        
        // Dispatch custom event for real-time UI updates
        window.dispatchEvent(new CustomEvent('allocation-updated', {
          detail: { resourceId, projectId, weekKey, hours: 0 }
        }));
        
        options?.onSuccess?.();
      }

      return success;
    } catch (error) {
      console.error('[canonical-delete] Error:', error);
      options?.onError?.(error instanceof Error ? error : new Error('Unknown error'));
      return false;
    }
  }, [company?.id, startOfWorkWeek, toast, queryClient, options]);

  /**
   * Bulk save allocations for a single resource across multiple projects.
   * This is the canonical way to update allocations from the ResourceAllocationDialog.
   */
  const bulkSave = useCallback(async (
    resourceId: string,
    resourceType: 'active' | 'pre_registered',
    weekKey: string,
    allocations: Record<string, number> // projectId -> hours
  ): Promise<boolean> => {
    if (!company?.id) {
      toast({
        title: 'Error',
        description: 'No company context available',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const results = await Promise.all(
        Object.entries(allocations).map(([projectId, hours]) => {
          if (hours > 0) {
            return saveResourceAllocation(
              projectId,
              resourceId,
              resourceType,
              weekKey,
              hours,
              company.id,
              startOfWorkWeek
            );
          } else {
            // Hours is 0 or less, delete the allocation
            return deleteResourceAllocation(
              projectId,
              resourceId,
              resourceType,
              weekKey,
              company.id,
              startOfWorkWeek
            );
          }
        })
      );

      const allSuccess = results.every(r => r);

      if (allSuccess) {
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['allocations'] });
        queryClient.invalidateQueries({ queryKey: ['comprehensive-weekly-allocations'] });
        queryClient.invalidateQueries({ queryKey: ['detailed-weekly-allocations'] });
        queryClient.invalidateQueries({ queryKey: ['person-resource-data'] });
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('allocation-updated', {
          detail: { resourceId, weekKey }
        }));
        
        options?.onSuccess?.();
      }

      return allSuccess;
    } catch (error) {
      console.error('[canonical-bulk-save] Error:', error);
      options?.onError?.(error instanceof Error ? error : new Error('Unknown error'));
      return false;
    }
  }, [company?.id, startOfWorkWeek, toast, queryClient, options]);

  return { save, remove, bulkSave };
}
