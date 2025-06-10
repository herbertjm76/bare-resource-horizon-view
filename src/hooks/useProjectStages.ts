
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useProjectStages = (projects: any[], office_stages: any[]) => {
  const [projectStages, setProjectStages] = useState<Record<string, Record<string, number>>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Memoize project IDs to prevent unnecessary refetches
  const projectIds = useMemo(() => projects.map(p => p.id), [projects]);
  
  useEffect(() => {
    const fetchAllProjectStages = async () => {
      // If no projects or stages, don't load
      if (!projectIds.length || !office_stages.length) {
        setProjectStages({});
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const { data: projectStagesData, error } = await supabase
          .from('project_stages')
          .select('project_id, stage_name, fee')
          .in('project_id', projectIds);
          
        if (error) {
          console.error('Error fetching project stages:', error);
          setProjectStages({});
          setIsLoading(false);
          return;
        }

        // Pre-build the stages map for better performance
        const stagesMap: Record<string, Record<string, number>> = {};
        
        // Initialize all project stage mappings
        projectIds.forEach(projectId => {
          stagesMap[projectId] = {};
        });
        
        // Fill in the actual stage data
        if (projectStagesData) {
          projectStagesData.forEach(stageData => {
            if (stageData.fee !== null && stageData.fee > 0) {
              // Find the matching office stage
              const officeStage = office_stages.find(stage => stage.name === stageData.stage_name);
              if (officeStage) {
                stagesMap[stageData.project_id][officeStage.id] = Number(stageData.fee);
              }
            }
          });
        }
        
        setProjectStages(stagesMap);
      } catch (err) {
        console.error('Error in fetchAllProjectStages:', err);
        setProjectStages({});
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllProjectStages();
  }, [projectIds, office_stages]);

  const getProjectStageFee = (projectId: string, officeStageId: string): number | null => {
    const fee = projectStages[projectId]?.[officeStageId];
    return fee !== undefined ? fee : null;
  };

  return { projectStages, getProjectStageFee, isLoading };
};
