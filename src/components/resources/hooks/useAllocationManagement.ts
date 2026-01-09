
import { useState, useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { useAppSettings } from '@/hooks/useAppSettings';
import { ProjectAllocations } from './types/resourceTypes';
import { initializeAllocations } from './services/allocationService';
import { getAllocationKey } from './utils/allocationUtils';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { generateDemoAllocations } from '@/data/demoData';
import { normalizeToWeekStart } from '@/utils/weekNormalization';

export const useAllocationManagement = (projectId: string) => {
  const [projectAllocations, setProjectAllocations] = useState<ProjectAllocations>({});
  const [isLoadingAllocations, setIsLoadingAllocations] = useState<boolean>(true);
  const { company } = useCompany();
  const { isDemoMode } = useDemoAuth();
  const { startOfWorkWeek } = useAppSettings();

  const loadDemoAllocations = async () => {
    if (!projectId) return;

    const allocs = generateDemoAllocations().filter((a) => a.project_id === projectId);
    const weekly: Record<string, number> = {};

    allocs.forEach((a) => {
      // Normalize allocation_date to company's week start (not hardcoded Monday!)
      const weekKey = normalizeToWeekStart(a.allocation_date, startOfWorkWeek);

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
      // Pass the company's startOfWorkWeek to ensure consistent normalization
      const allocations = await initializeAllocations(projectId, company.id, startOfWorkWeek);
      setProjectAllocations(allocations);
    } finally {
      setIsLoadingAllocations(false);
    }
  };

  useEffect(() => {
    if (projectId && (isDemoMode || company?.id)) {
      loadAllocations();
    }
  }, [projectId, company?.id, isDemoMode, startOfWorkWeek]);

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

