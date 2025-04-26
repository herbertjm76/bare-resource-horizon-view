
import { supabase } from "@/integrations/supabase/client";
import { mapStatusToDb } from "../../utils/projectMappings";
import type { ProjectUpdateData } from "./types";
import type { Database } from "@/integrations/supabase/types";

export const useProjectUpdate = () => {
  const updateProject = async (projectId: string, projectUpdate: ProjectUpdateData) => {
    // Map the status to the correct database enum value
    const mappedStatus = mapStatusToDb(projectUpdate.status);
    
    const { error: projectError } = await supabase
      .from('projects')
      .update({ 
        ...projectUpdate,
        status: mappedStatus 
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
