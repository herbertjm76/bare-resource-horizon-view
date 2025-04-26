
import { supabase } from "@/integrations/supabase/client";
import type { ProjectUpdateData } from "./types";

export const useProjectUpdate = () => {
  const updateProject = async (projectId: string, projectUpdate: ProjectUpdateData) => {
    const { error: projectError } = await supabase
      .from('projects')
      .update(projectUpdate)
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
