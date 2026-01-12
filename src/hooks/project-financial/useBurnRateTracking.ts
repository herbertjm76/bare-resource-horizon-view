import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

export interface BurnRateMetrics {
  projectId: string;
  stageId?: string;
  totalBudget: number;
  totalSpent: number;
  totalAllocated: number;
  totalConsumed: number;
  burnRate: number; // Amount spent per week
  projectedCompletion: Date | null;
  budgetRunway: number; // Weeks remaining at current burn rate
  utilizationPercentage: number;
  isOverBudget: boolean;
  variance: number; // Positive means over budget
}

export const useBurnRateTracking = (projectId: string, stageId?: string) => {
  const [metrics, setMetrics] = useState<BurnRateMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { company } = useCompany();

  const fetchBurnRateMetrics = async () => {
    if (!projectId || !company?.id) return;

    setIsLoading(true);
    try {
      // Fetch project stages with budget information
      let stageQuery = supabase
        .from('project_stages')
        .select('*')
        .eq('project_id', projectId);

      if (stageId) {
        stageQuery = stageQuery.eq('stage_name', (
          await supabase.from('office_stages').select('name').eq('id', stageId).single()
        ).data?.name || '');
      }

      const { data: stages, error: stagesError } = await stageQuery;
      if (stagesError) throw stagesError;

      // RULEBOOK: ALL allocation reads include both active and pre_registered
      // Fetch resource allocations with amount calculations
      let allocationQuery = supabase
        .from('project_resource_allocations')
        .select('hours, allocation_amount, allocation_date')
        .eq('project_id', projectId)
        .in('resource_type', ['active', 'pre_registered']);

      if (stageId) {
        allocationQuery = allocationQuery.eq('stage_id', stageId);
      }

      const { data: allocations, error: allocationsError } = await allocationQuery;
      if (allocationsError) throw allocationsError;

      // Calculate metrics
      const totalBudget = stages?.reduce((sum, stage) => sum + (stage.total_budget_amount || 0), 0) || 0;
      const totalConsumed = stages?.reduce((sum, stage) => sum + (stage.consumed_hours || 0), 0) || 0;
      const totalAllocated = allocations?.reduce((sum, alloc) => sum + (alloc.hours || 0), 0) || 0;
      const totalSpent = allocations?.reduce((sum, alloc) => sum + (alloc.allocation_amount || 0), 0) || 0;

      // Calculate burn rate (weekly average)
      const weeksWithActivity = new Set(allocations?.map(a => a.allocation_date)).size || 1;
      const burnRate = totalSpent / weeksWithActivity;

      // Calculate budget runway
      const remainingBudget = totalBudget - totalSpent;
      const budgetRunway = burnRate > 0 ? remainingBudget / burnRate : Infinity;

      // Calculate utilization
      const totalBudgetedHours = stages?.reduce((sum, stage) => sum + (stage.total_budgeted_hours || 0), 0) || 1;
      const utilizationPercentage = ((totalConsumed + totalAllocated) / totalBudgetedHours) * 100;

      // Variance calculation
      const variance = totalSpent - totalBudget;
      const isOverBudget = variance > 0;

      // Project completion date
      const remainingHours = totalBudgetedHours - (totalConsumed + totalAllocated);
      const avgHoursPerWeek = (totalConsumed + totalAllocated) / weeksWithActivity;
      const projectedCompletion = avgHoursPerWeek > 0 
        ? new Date(Date.now() + (remainingHours / avgHoursPerWeek) * 7 * 24 * 60 * 60 * 1000)
        : null;

      setMetrics({
        projectId,
        stageId,
        totalBudget,
        totalSpent,
        totalAllocated,
        totalConsumed,
        burnRate,
        projectedCompletion,
        budgetRunway,
        utilizationPercentage,
        isOverBudget,
        variance
      });

    } catch (error) {
      console.error('Error fetching burn rate metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBurnRateMetrics();
  }, [projectId, stageId, company?.id]);

  const alertLevel = useMemo(() => {
    if (!metrics) return 'safe';
    
    if (metrics.isOverBudget) return 'danger';
    if (metrics.utilizationPercentage > 90) return 'warning';
    if (metrics.utilizationPercentage > 75) return 'caution';
    return 'safe';
  }, [metrics]);

  return {
    metrics,
    isLoading,
    alertLevel,
    refetch: fetchBurnRateMetrics
  };
};