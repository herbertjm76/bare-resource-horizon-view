import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCompany } from '@/context/CompanyContext';
import { useProjectUpdate } from './submit/useProjectUpdate';
import { useStageSubmit } from './submit/useStageSubmit';
import type { ProjectSubmitData } from './submit/types';
import { logger } from '@/utils/logger';

// Add an optional onAfterSubmit callback and call it at the end
export const useProjectSubmit = (projectId: string, refetch: () => void, onClose: () => void, onAfterSubmit?: () => void) => {
  const { company } = useCompany();
  const { updateProject } = useProjectUpdate();
  const { handleStageSubmit } = useStageSubmit();

  const handleSubmit = async (form: ProjectSubmitData, setIsLoading: (loading: boolean) => void) => {
    if (setIsLoading) setIsLoading(true);
    
    try {
      logger.debug('Submitting project update with form data:', form);
      
      // Get stage names from selected stage IDs
      const selectedStageNames = form.stages.map(stageId => {
        const stage = form.officeStages?.find(s => s.id === stageId);
        return stage ? stage.name : '';
      }).filter(Boolean);

      logger.debug('Selected stage names:', selectedStageNames);
      
      // First, get the existing project to preserve required fields if not provided
      const { data: existingProject, error: fetchError } = await supabase
        .from('projects')
        .select('office_id, target_profit_percentage, department')
        .eq('id', projectId)
        .single();
      
      if (fetchError) {
        logger.error('Error fetching existing project:', fetchError);
        throw fetchError;
      }
      
      // Prepare update object, ensuring required fields are preserved
      // office_id is NOT NULL in the database, so preserve existing value if not provided
      // department should preserve existing value if form field is empty
      const formDepartment = (form as any).department;
      const projectUpdate = {
        code: form.code,
        name: form.name,
        project_manager_id: form.manager && form.manager !== 'not_assigned' ? form.manager : null,
        office_id: form.office || existingProject?.office_id,
        status: form.status,
        country: form.country,
        current_stage: form.current_stage,
        target_profit_percentage: form.profit !== undefined && form.profit !== null && String(form.profit).trim() !== ''
          ? Number(form.profit)
          : existingProject?.target_profit_percentage ?? 0,
        stages: selectedStageNames,
        department: formDepartment !== undefined && formDepartment !== '' ? formDepartment : existingProject?.department ?? null
      };
      
      logger.debug('Project update data:', projectUpdate);

      // Update the main project record and get existing stages
      const { existingStages } = await updateProject(projectId, projectUpdate);

      // Check if company ID is available
      if (!company?.id) {
        logger.error("Missing company ID for project stage operations");
        throw new Error("Company context is not available");
      }

      // Handle stages and fees
      await handleStageSubmit({
        projectId,
        companyId: company.id,
        selectedStageNames,
        existingStages,
        stageFees: form.stageFees,
        stageApplicability: form.stageApplicability,
        officeStages: form.officeStages || []
      });

      toast.success('Project updated successfully');
      refetch();
      onClose();
      if (onAfterSubmit) {
        onAfterSubmit();
      }
    } catch (error: any) {
      logger.error('Error updating project:', error);
      toast.error('Failed to update project: ' + (error.message || "Unknown error"));
    } finally {
      if (setIsLoading) setIsLoading(false);
    }
  };

  return { handleSubmit };
};
