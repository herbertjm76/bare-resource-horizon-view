
import { supabase } from '@/integrations/supabase/client';
import type { FormState } from '../hooks/types/projectTypes';
import { checkProjectCodeUnique, isProjectInfoValid } from './NewProjectValidation';
import { toast } from 'sonner';
import { mapStatusToDb } from '../utils/projectMappings';

export const submitNewProject = async (
  form: FormState,
  companyId: string,
  officeStages: Array<{ id: string; name: string }>,
  onSuccess?: () => void
) => {
  console.log('Submitting new project with form:', form);
  
  if (!isProjectInfoValid(form)) {
    console.log('Form validation failed');
    toast.error("Please complete all required fields: Project Code, Name, Country, Target Profit %, Status, and Office.");
    return false;
  }

  const isCodeUnique = await checkProjectCodeUnique(form.code, companyId);
  if (!isCodeUnique) {
    toast.error(`Project code "${form.code}" already exists. Please use a unique code.`);
    return false;
  }

  try {
    const projectStatus = form.status === 'none' ? "Planning" : (form.status || "Planning");
    const manager = form.manager === 'none' ? null : (form.manager === "not_assigned" ? null : (form.manager || null));
    const country = form.country === 'none' ? null : form.country;
    const office = form.office === 'none' ? null : form.office;
    const currentStage = (form.current_stage === 'none' || !form.current_stage) ? null : form.current_stage;

    const selectedStageNames = form.stages.map(stageId => {
      const stage = officeStages.find(os => os.id === stageId);
      return stage ? stage.name : '';
    }).filter(Boolean);

    // Map the status to the correct database enum value
    const mappedStatus = mapStatusToDb(projectStatus);

    console.log('Creating project with data:', {
      code: form.code,
      name: form.name,
      company_id: companyId,
      project_manager_id: manager,
      office_id: office,
      status: mappedStatus,
      country: country,
      current_stage: currentStage,
      target_profit_percentage: form.profit ? Number(form.profit) : null,
      stages: selectedStageNames
    });

    const { data, error } = await supabase.from('projects').insert({
      code: form.code,
      name: form.name,
      company_id: companyId,
      project_manager_id: manager,
      office_id: office,
      status: mappedStatus,
      country: country,
      current_stage: currentStage,
      target_profit_percentage: form.profit ? Number(form.profit) : null,
      stages: selectedStageNames
    }).select();

    if (error) {
      console.error('Database error creating project:', error);
      throw error;
    }
    
    const projectId = data?.[0]?.id;
    if (projectId && form.stages.length) {
      console.log('Creating stage fees for project:', projectId);
      const stageFeesPromises = form.stages.map(stageId => {
        const feeObj = form.stageFees[stageId];
        const stage = officeStages.find(s => s.id === stageId);
        return supabase.from('project_stages').insert({
          project_id: projectId,
          company_id: companyId,
          stage_name: stage?.name ?? "Unknown Stage",
          fee: feeObj?.fee ? parseFloat(feeObj.fee) : 0,
          is_applicable: form.stageApplicability?.[stageId] ?? true
        });
      });
      await Promise.all(stageFeesPromises);
    }

    toast.success('Project successfully created!');
    if (onSuccess) {
      onSuccess();
    }
    return true;
  } catch (error: any) {
    console.error('Error creating project:', error);
    toast.error("Failed to create project: " + (error.message || "Unknown error"));
    return false;
  }
};
