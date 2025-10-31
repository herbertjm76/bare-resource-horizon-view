
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
    const officeLocationId = form.office === 'none' ? null : form.office;
    
    // Set current_stage to the first selected stage name, or the first available stage name if no stages selected
    let currentStage = null;
    if (form.stages.length > 0) {
      const firstSelectedStageId = form.stages[0];
      const firstSelectedStage = officeStages.find(os => os.id === firstSelectedStageId);
      currentStage = firstSelectedStage ? firstSelectedStage.name : null;
    }
    
    // If no stages selected, use the first available stage from officeStages
    if (!currentStage && officeStages.length > 0) {
      currentStage = officeStages[0].name;
    }
    
    // If still no current stage, use a default value
    if (!currentStage) {
      currentStage = "Planning";
    }

    const selectedStageNames = form.stages.map(stageId => {
      const stage = officeStages.find(os => os.id === stageId);
      return stage ? stage.name : '';
    }).filter(Boolean);

    // Map the status to the correct database enum value
    const mappedStatus = mapStatusToDb(projectStatus);

    // We need to find or create a default office in the offices table
    // First, let's try to get an existing office or create a default one
    let { data: offices, error: officesError } = await supabase
      .from('offices')
      .select('id')
      .limit(1);

    if (officesError) {
      console.error('Error fetching offices:', officesError);
      throw new Error('Failed to fetch office data');
    }

    let defaultOfficeId: string;
    
    if (!offices || offices.length === 0) {
      // Create a default office if none exists
      const { data: newOffice, error: createOfficeError } = await supabase
        .from('offices')
        .insert({
          name: 'Default Office',
          country: country || 'Unknown'
        })
        .select('id')
        .single();

      if (createOfficeError) {
        console.error('Error creating default office:', createOfficeError);
        throw new Error('Failed to create default office');
      }
      
      defaultOfficeId = newOffice.id;
    } else {
      defaultOfficeId = offices[0].id;
    }

    console.log('Creating project with data:', {
      code: form.code,
      name: form.name,
      company_id: companyId,
      project_manager_id: manager,
      office_id: defaultOfficeId,
      temp_office_location_id: officeLocationId,
      status: mappedStatus,
      country: country,
      current_stage: currentStage,
      target_profit_percentage: form.profit ? Number(form.profit) : null,
      stages: selectedStageNames,
      department: form.department || null
    });

    const { data, error } = await supabase.from('projects').insert({
      code: form.code,
      name: form.name,
      company_id: companyId,
      project_manager_id: manager,
      office_id: defaultOfficeId,
      temp_office_location_id: officeLocationId,
      status: mappedStatus,
      country: country,
      current_stage: currentStage,
      target_profit_percentage: form.profit ? Number(form.profit) : null,
      stages: selectedStageNames,
      department: form.department || null
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
          fee: feeObj?.fee ? parseFloat(String(feeObj.fee)) : 0,
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
