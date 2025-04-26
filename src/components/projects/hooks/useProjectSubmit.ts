
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCompany } from '@/context/CompanyContext';
import { useProjectUpdate } from './submit/useProjectUpdate';
import { useStageSubmit } from './submit/useStageSubmit';
import { mapStatusToDb } from "../utils/projectMappings"; // Fixed import path
import type { ProjectSubmitData } from './submit/types';

export const useProjectSubmit = (projectId: string, refetch: () => void, onClose: () => void) => {
  const { company } = useCompany();
  const { updateProject } = useProjectUpdate();
  const { handleStageSubmit } = useStageSubmit();

  const handleSubmit = async (form: ProjectSubmitData, setIsLoading: (loading: boolean) => void) => {
    if (setIsLoading) setIsLoading(true);
    
    try {
      console.log('Submitting project update with form data:', form);
      
      // Get stage names from selected stage IDs
      const selectedStageNames = form.stages.map(stageId => {
        const stage = form.officeStages?.find(s => s.id === stageId);
        return stage ? stage.name : '';
      }).filter(Boolean);

      console.log('Selected stage names:', selectedStageNames);
      
      // Prepare update object, ensuring no empty values for UUID fields
      const projectUpdate = {
        code: form.code,
        name: form.name,
        project_manager_id: form.manager && form.manager !== 'not_assigned' ? form.manager : null,
        office_id: form.office || null,
        status: mapStatusToDb(form.status),
        country: form.country,
        current_stage: form.current_stage,
        target_profit_percentage: form.profit ? Number(form.profit) : null,
        stages: selectedStageNames
      };
      
      console.log('Project update data:', projectUpdate);

      // Update the main project record and get existing stages
      const { existingStages } = await updateProject(projectId, {
        ...projectUpdate,
        status: form.status as "In Progress" | "On Hold" | "Complete" | "Planning"
      });

      // Check if company ID is available
      if (!company?.id) {
        console.error("Missing company ID for project stage operations");
        throw new Error("Company context is not available");
      }

      // Handle stages and fees
      await handleStageSubmit(
        projectId,
        company.id,
        selectedStageNames,
        existingStages,
        form.stageFees,
        form.stageApplicability,
        form.officeStages || []
      );

      toast.success('Project updated successfully');
      refetch();
      onClose();
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project: ' + (error.message || "Unknown error"));
    } finally {
      if (setIsLoading) setIsLoading(false);
    }
  };

  return { handleSubmit };
};
