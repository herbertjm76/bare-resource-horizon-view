import { useCallback, useEffect } from 'react';
import { dashboardDataService } from '@/services/dashboardDataService';
import { useCompany } from '@/context/CompanyContext';

export const useDashboardCache = () => {
  const { company } = useCompany();

  // Clear cache when company changes
  useEffect(() => {
    if (company?.id) {
      // Don't clear cache on company load, only on company change
      return;
    }
  }, [company?.id]);

  const clearCache = useCallback(() => {
    if (company?.id) {
      dashboardDataService.clearCache(company.id);
    }
  }, [company?.id]);

  const clearAllCache = useCallback(() => {
    dashboardDataService.clearAllCache();
  }, []);

  const preloadData = useCallback(async (timeRange: string) => {
    if (!company?.id) return;
    
    try {
      await dashboardDataService.fetchAllDashboardData({
        companyId: company.id,
        timeRange: timeRange as any
      });
      console.log('📦 Preloaded dashboard data for', timeRange);
    } catch (error) {
      console.warn('⚠️ Failed to preload dashboard data:', error);
    }
  }, [company?.id]);

  return {
    clearCache,
    clearAllCache,
    preloadData
  };
};