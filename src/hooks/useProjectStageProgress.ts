import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { addDays, differenceInDays, isWithinInterval } from 'date-fns';

interface StageProgress {
  totalBudgetedHours: number;
  totalAllocatedHours: number;
  stageStartDate: Date | null;
  stageEndDate: Date | null;
  stageDurationWeeks: number;
  progressPercentage: number;
  isOverAllocated: boolean;
}

export const useProjectStageProgress = (projectId: string, currentStage: string) => {
  const { company } = useCompany();
  const [stageProgress, setStageProgress] = useState<StageProgress>({
    totalBudgetedHours: 0,
    totalAllocatedHours: 0,
    stageStartDate: null,
    stageEndDate: null,
    stageDurationWeeks: 0,
    progressPercentage: 0,
    isOverAllocated: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStageProgress = async () => {
      if (!company || !projectId || !currentStage) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // Fetch stage data for budgeted hours and timeline
        const { data: stageData, error: stageError } = await supabase
          .from('project_stages')
          .select('total_budgeted_hours, contracted_weeks')
          .eq('project_id', projectId)
          .eq('stage_name', currentStage)
          .eq('company_id', company.id)
          .single();

        if (stageError && stageError.code !== 'PGRST116') {
          console.error('Error fetching stage data:', stageError);
          setIsLoading(false);
          return;
        }

        // Fetch project start date
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('contract_start_date')
          .eq('id', projectId)
          .single();

        if (projectError) {
          console.error('Error fetching project data:', projectError);
          setIsLoading(false);
          return;
        }

        // Calculate stage timeline based on contract start date
        let stageStartDate: Date | null = null;
        let stageEndDate: Date | null = null;
        
        if (projectData?.contract_start_date && stageData?.contracted_weeks) {
          stageStartDate = new Date(projectData.contract_start_date);
          stageEndDate = addDays(stageStartDate, stageData.contracted_weeks * 7);
        }

        // Fetch allocated hours for this stage within the timeline
        let allocatedHours = 0;
        if (stageStartDate && stageEndDate) {
          const { data: allocations, error: allocError } = await supabase
            .from('project_resource_allocations')
            .select('hours, week_start_date')
            .eq('project_id', projectId)
            .eq('company_id', company.id)
            .gte('week_start_date', stageStartDate.toISOString().split('T')[0])
            .lte('week_start_date', stageEndDate.toISOString().split('T')[0]);

          if (!allocError && allocations) {
            allocatedHours = allocations.reduce((sum, alloc) => sum + (alloc.hours || 0), 0);
          }
        }

        const budgetedHours = stageData?.total_budgeted_hours || 0;
        const progressPercentage = budgetedHours > 0 ? (allocatedHours / budgetedHours) * 100 : 0;

        setStageProgress({
          totalBudgetedHours: budgetedHours,
          totalAllocatedHours: allocatedHours,
          stageStartDate,
          stageEndDate,
          stageDurationWeeks: stageData?.contracted_weeks || 0,
          progressPercentage,
          isOverAllocated: allocatedHours > budgetedHours
        });

      } catch (error) {
        console.error('Error in fetchStageProgress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStageProgress();
  }, [company, projectId, currentStage]);

  // Function to check if a date is within the current stage timeline
  const isDateInStageTimeline = useMemo(() => {
    return (date: Date) => {
      if (!stageProgress.stageStartDate || !stageProgress.stageEndDate) return false;
      return isWithinInterval(date, {
        start: stageProgress.stageStartDate,
        end: stageProgress.stageEndDate
      });
    };
  }, [stageProgress.stageStartDate, stageProgress.stageEndDate]);

  return {
    stageProgress,
    isLoading,
    isDateInStageTimeline
  };
};