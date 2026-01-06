
import { useState, useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { ProjectAllocations } from './types/resourceTypes';
import { initializeAllocations } from './services/allocationService';
import { getAllocationKey } from './utils/allocationUtils';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { generateDemoAllocations } from '@/data/demoData';

export const useAllocationManagement = (projectId: string) => {
  const [projectAllocations, setProjectAllocations] = useState<ProjectAllocations>({});
  const [isLoadingAllocations, setIsLoadingAllocations] = useState<boolean>(true);
  const { company } = useCompany();
  const { isDemoMode } = useDemoAuth();

  const loadDemoAllocations = async () => {
    if (!projectId) return;

    const allocs = generateDemoAllocations().filter((a) => a.project_id === projectId);
    const weekly: Record<string, number> = {};

    allocs.forEach((a) => {
      // Convert allocation_date to the week start (Monday)
      const allocationDate = new Date(a.allocation_date + 'T00:00:00');
      const dayOfWeek = allocationDate.getDay();
      const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(allocationDate);
      monday.setDate(allocationDate.getDate() + daysToMonday);
      const weekKey = monday.toISOString().split('T')[0];

      const key = getAllocationKey(a.resource_id, weekKey);
      weekly[key] = (weekly[key] || 0) + Number(a.hours);
    });

    setProjectAllocations(weekly);
  };

  // Initialize project allocations
  const loadAllocations = async () => {
    if (!projectId) {
      setIsLoadingAllocations(false);
      return;
    }

    setIsLoadingAllocations(true);

    try {
      if (isDemoMode) {
        await loadDemoAllocations();
        setIsLoadingAllocations(false);
        return;
      }

      if (!company?.id) {
        setIsLoadingAllocations(false);
        return;
      }
      const allocations = await initializeAllocations(projectId, company.id);
      setProjectAllocations(allocations);
    } finally {
      setIsLoadingAllocations(false);
    }
  };

  useEffect(() => {
    if (projectId && (isDemoMode || company?.id)) {
      loadAllocations();
    }
  }, [projectId, company?.id, isDemoMode]);

  const handleAllocationChange = (resourceId: string, weekKey: string, hours: number) => {
    const allocationKey = getAllocationKey(resourceId, weekKey);

    setProjectAllocations((prev) => ({
      ...prev,
      [allocationKey]: hours,
    }));
  };

  const removeResourceAllocations = (resourceId: string) => {
    setProjectAllocations((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
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
    getAllocationKey,
  };
};

