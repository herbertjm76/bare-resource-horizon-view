
import { useState, useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { ProjectAllocations } from './types/resourceTypes';
import { initializeAllocations } from './services/allocationService';
import { getAllocationKey } from './utils/allocationUtils';

export const useAllocationManagement = (projectId: string) => {
  const [projectAllocations, setProjectAllocations] = useState<ProjectAllocations>({});
  const [isLoadingAllocations, setIsLoadingAllocations] = useState<boolean>(true);
  const { company } = useCompany();

  // Initialize project allocations from database
  const loadAllocations = async () => {
    if (!projectId || !company?.id) return;
    
    setIsLoadingAllocations(true);
    
    try {
      const allocations = await initializeAllocations(projectId, company.id);
      setProjectAllocations(allocations);
    } finally {
      setIsLoadingAllocations(false);
    }
  };

  // Load resource allocations when the component mounts or project/company changes
  useEffect(() => {
    if (projectId && company?.id) {
      loadAllocations();
    }
  }, [projectId, company?.id]);

  // Handle resource allocation changes (for UI updates)
  const handleAllocationChange = (resourceId: string, weekKey: string, hours: number) => {
    const allocationKey = getAllocationKey(resourceId, weekKey);
    
    setProjectAllocations(prev => ({
      ...prev,
      [allocationKey]: hours
    }));
  };

  // Remove all allocations for a resource from local state
  const removeResourceAllocations = (resourceId: string) => {
    setProjectAllocations(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        if (key.startsWith(`${resourceId}:`)) {
          delete updated[key];
        }
      });
      return updated;
    });
  };

  return {
    projectAllocations,
    isLoadingAllocations,
    handleAllocationChange,
    removeResourceAllocations,
    getAllocationKey
  };
};
