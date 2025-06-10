
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useProjectStages = (projects: any[], office_stages: any[]) => {
  const [projectStages, setProjectStages] = useState<Record<string, Record<string, number>>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllProjectStages = async () => {
      if (!projects.length || !office_stages.length) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const projectIds = projects.map(p => p.id);
        
        const { data: projectStagesData, error } = await supabase
          .from('project_stages')
          .select('project_id, stage_name, fee')
          .in('project_id', projectIds);
          
        if (error) {
          console.error('Error fetching project stages:', error);
          setIsLoading(false);
          return;
        }

        // Create a map of project_id -> stage_id -> fee
        const stagesMap: Record<string, Record<string, number>> = {};
        
        projects.forEach(project => {
          stagesMap[project.id] = {};
          
          // Get all stages for this project
          const projectStageData = projectStagesData?.filter(stage => stage.project_id === project.id) || [];
          
          // Map stage names to office stage IDs and fees
          office_stages.forEach(officeStage => {
            const stageData = projectStageData.find(stage => stage.stage_name === officeStage.name);
            if (stageData && stageData.fee !== null && stageData.fee > 0) {
              stagesMap[project.id][officeStage.id] = Number(stageData.fee);
            }
          });
        });
        
        setProjectStages(stagesMap);
      } catch (err) {
        console.error('Error in fetchAllProjectStages:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllProjectStages();
  }, [projects, office_stages]);

  const getProjectStageFee = (projectId: string, officeStageId: string): number | null => {
    const fee = projectStages[projectId]?.[officeStageId];
    return fee !== undefined ? fee : null;
  };

  return { projectStages, getProjectStageFee, isLoading };
};
