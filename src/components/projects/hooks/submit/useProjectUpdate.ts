
import { supabase } from "@/integrations/supabase/client";
import { mapStatusToDb } from "../../utils/projectMappings";
import type { ProjectUpdateData } from "./types";

export const useProjectUpdate = () => {
  const updateProject = async (projectId: string, projectUpdate: ProjectUpdateData) => {
    // Map the status to the correct database enum value
    const mappedStatus = mapStatusToDb(projectUpdate.status);
    
    // Ensure current_stage is properly handled - if it's an empty string, set it to null
    const currentStage = projectUpdate.current_stage || null;
    
    console.log('Updating project with current_stage:', currentStage);
    
    const { error: projectError } = await supabase
      .from('projects')
      .update({ 
        ...projectUpdate,
        status: mappedStatus,
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
