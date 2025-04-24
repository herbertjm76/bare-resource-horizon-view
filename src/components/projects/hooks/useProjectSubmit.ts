
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCompany } from '@/context/CompanyContext';

export const useProjectSubmit = (projectId: string, refetch: () => void, onClose: () => void) => {
  const { company } = useCompany();

  const handleSubmit = async (form: any, setIsLoading: (loading: boolean) => void) => {
    if (setIsLoading) setIsLoading(true);
    
    try {
      console.log('Submitting project update with form data:', form);
      
      // Get stage names from selected stage IDs
      const selectedStageNames = form.stages.map((stageId: string) => {
        const stage = form.officeStages?.find((s: any) => s.id === stageId);
        return stage ? stage.name : '';
      }).filter(Boolean);

      console.log('Selected stage names:', selectedStageNames);
      
      // Prepare update object, ensuring no empty values for UUID fields
      const projectUpdate = {
        code: form.code,
        name: form.name,
        project_manager_id: form.manager && form.manager !== 'not_assigned' ? form.manager : null,
        office_id: form.office || null,
        status: form.status,
        country: form.country,
        current_stage: form.current_stage,
        target_profit_percentage: form.profit ? Number(form.profit) : null,
        stages: selectedStageNames
      };
      
      console.log('Project update data:', projectUpdate);

      const { error: projectError } = await supabase
        .from('projects')
        .update(projectUpdate)
        .eq('id', projectId);

      if (projectError) throw projectError;
      
      // First, fetch all current project stages to compare
      const { data: existingStages, error: stagesError } = await supabase
        .from('project_stages')
        .select('id, stage_name')
        .eq('project_id', projectId);
        
      if (stagesError) {
        console.error("Error fetching existing stages:", stagesError);
        throw stagesError;
      }

      console.log('Existing stages:', existingStages);
      console.log('Selected stages:', selectedStageNames);
      
      // If no stages are selected, delete all existing stages
      if (!selectedStageNames || selectedStageNames.length === 0) {
        if (existingStages && existingStages.length > 0) {
          const { error } = await supabase
            .from('project_stages')
            .delete()
            .eq('project_id', projectId);
            
          if (error) {
            console.error("Error deleting all stages:", error);
            throw error;
          }
        }
      } else {
        // Handle the case where stages are selected
        const stagesToKeep = new Set(selectedStageNames);
        const existingStageNames = new Set(existingStages?.map(s => s.stage_name) || []);
        
        // Find existing stages that match selected stages
        if (existingStages && existingStages.length > 0) {
          // Delete stages that are not selected anymore
          const stagesToDelete = existingStages
            .filter(stage => !stagesToKeep.has(stage.stage_name))
            .map(stage => stage.id);
          
          if (stagesToDelete.length > 0) {
            console.log('Deleting stages:', stagesToDelete);
            const { error } = await supabase
              .from('project_stages')
              .delete()
              .in('id', stagesToDelete);
              
            if (error) {
              console.error("Error deleting stages:", error);
              throw error;
            }
          }
        }
        
        // Now insert or update stages
        for (const stageName of selectedStageNames) {
          const stage = form.officeStages?.find((s: any) => s.name === stageName);
          if (!stage) continue;
          
          const stageId = stage.id;
          const feeData = form.stageFees?.[stageId];
          const fee = feeData?.fee ? parseFloat(feeData.fee) : 0;
          const isApplicable = form.stageApplicability?.[stageId] ?? true;
          
          // Check if this stage already exists
          const existingStage = existingStages?.find(s => s.stage_name === stageName);
          
          if (existingStage) {
            // Update existing stage
            const { error } = await supabase
              .from('project_stages')
              .update({ fee, is_applicable: isApplicable })
              .eq('id', existingStage.id);
              
            if (error) {
              console.error(`Error updating stage ${stageName}:`, error);
              throw error;
            }
          } else if (!existingStageNames.has(stageName)) {
            // Insert new stage
            if (!company?.id) {
              console.error("Missing company ID for project stage insert");
              continue;
            }
            
            const { error } = await supabase
              .from('project_stages')
              .insert({
                project_id: projectId,
                company_id: company.id,
                stage_name: stageName,
                fee,
                is_applicable: isApplicable
              });
              
            if (error) {
              console.error(`Error inserting stage ${stageName}:`, error);
              throw error;
            }
          }
        }
      }

      toast.success('Project updated successfully');
      refetch();
      onClose();
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    } finally {
      if (setIsLoading) setIsLoading(false);
    }
  };

  return { handleSubmit };
};
