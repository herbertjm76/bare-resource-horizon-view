
import { useState } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { useAllocationsFetch } from './useAllocationsFetch';
import { useAllocationsMutations } from './useAllocationsMutations';
import { useAllocationsRealtime } from './useAllocationsRealtime';
import { UseResourceAllocationsResult } from './types';

export * from './types';

export function useResourceAllocationsDB(
  projectId: string, 
  resourceId: string, 
  resourceType: 'active' | 'pre_registered'
): UseResourceAllocationsResult {
  const { company } = useCompany();
  
  const {
    allocations,
    setAllocations,
    isLoading,
    fetchAllocations
  } = useAllocationsFetch(projectId, resourceId, resourceType, company?.id);
  
  const {
    isSaving,
    saveAllocation,
    deleteAllocation
  } = useAllocationsMutations(projectId, resourceId, resourceType, company?.id, setAllocations);
  
  // Setup realtime subscription
  useAllocationsRealtime(
    projectId, 
    resourceId, 
    resourceType, 
    company?.id, 
    setAllocations, 
    fetchAllocations
  );

  return {
    allocations,
    isLoading,
    isSaving,
    saveAllocation,
    deleteAllocation,
    refreshAllocations: fetchAllocations
  };
}
