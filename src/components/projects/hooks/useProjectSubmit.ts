
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCompany } from '@/context/CompanyContext';

export const useProjectSubmit = (projectId: string, refetch: () => void, onClose: () => void) => {
  const { company } = useCompany();

  const handleSubmit = async (form: any, setIsLoading: (loading: boolean) => void) => {
    if (setIsLoading) setIsLoading(true);
    
    try {
      console.log('Submitting project update with form data:', form);
      
      // Prepare update object, ensuring no empty values for UUID fields
      const projectUpdate = {
        code: form.code,
        name: form.name,
        project_manager_id: form.manager && form.manager !== 'not_assigned' ? form.manager : null,
        office_id: form.office || null, // Ensure we don't send empty string
        status: form.status,
        country: form.country,
        current_stage: form.current_stage,
        target_profit_percentage: form.profit ? Number(form.profit) : null
      };
      
      console.log('Project update data:', projectUpdate);

      const { error: projectError } = await supabase
        .from('projects')
        .update(projectUpdate)
        .eq('id', projectId);

      if (projectError) throw projectError;

      const { data: existingStages } = await supabase
        .from('project_stages')
        .select('id, stage_name')
        .eq('project_id', projectId);

      if (existingStages && existingStages.length > 0) {
        const stagesToKeep = new Set();
        
        for (const stageId of form.stages || []) {
          const stageName = form.officeStages?.find((s: any) => s.id === stageId)?.name;
          if (stageName) {
            const existingStage = existingStages.find(s => s.stage_name === stageName);
            if (existingStage) {
              stagesToKeep.add(existingStage.id);
            }
          }
        }
        
        const stagesToDelete = existingStages
          .filter(stage => !stagesToKeep.has(stage.id))
          .map(stage => stage.id);
        
        if (stagesToDelete.length > 0) {
          const { error } = await supabase
            .from('project_stages')
            .delete()
            .in('id', stagesToDelete);
            
          if (error) {
            console.error("Error deleting stages:", error);
          }
        }
      }

      // Handle stages update/insert
      for (const stageId of form.stages || []) {
        const stageName = form.officeStages?.find((s: any) => s.id === stageId)?.name;
        if (!stageName) continue;
        
        const feeData = form.stageFees?.[stageId];
        const existingStage = existingStages?.find(s => s.stage_name === stageName);
        
        if (existingStage) {
          await supabase
            .from('project_stages')
            .update({
              fee: feeData?.fee ? parseFloat(feeData.fee) : 0
            })
            .eq('id', existingStage.id);
        } else {
          // Only insert if we have a valid company ID
          if (company?.id) {
            await supabase
              .from('project_stages')
              .insert({
                project_id: projectId,
                company_id: company.id,
                stage_name: stageName,
                fee: feeData?.fee ? parseFloat(feeData.fee) : 0
              });
          } else {
            console.error("Missing company ID for project stage insert");
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
