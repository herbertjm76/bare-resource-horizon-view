
import { supabase } from "@/integrations/supabase/client";
import type { ProjectUpdateData } from "./types";
import { logger } from '@/utils/logger';

export const useProjectUpdate = () => {
  const updateProject = async (projectId: string, projectUpdate: ProjectUpdateData) => {
    // Keep current_stage as-is (empty string is valid, database doesn't allow null)
    const currentStage = projectUpdate.current_stage ?? '';
    
    logger.debug('Updating project', { projectId, currentStage });
    
    const { error: projectError } = await supabase
      .from('projects')
      .update({ 
        ...projectUpdate,
        current_stage: currentStage
      })
      .eq('id', projectId);

    if (projectError) {
      console.error("Error updating project:", projectError);
      throw projectError;
    }

    const { data: existingStages, error: stagesError } = await supabase
      .from('project_stages')
      .select('id, stage_name')
      .eq('project_id', projectId);
      
    if (stagesError) {
      console.error("Error fetching existing stages:", stagesError);
      throw stagesError;
    }

    return { existingStages };
  };

  return { updateProject };
};
