
import { supabase } from "@/integrations/supabase/client";
import type { ExistingStage, StageData } from "../types/stageSubmitTypes";

export const deleteUnusedStages = async (
  existingStages: ExistingStage[],
  stagesToKeep: Set<string>
): Promise<void> => {
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
};

export const createOrUpdateStage = async (
  projectId: string,
  companyId: string,
  stageName: string,
  stageData: StageData,
  existingStage?: ExistingStage
): Promise<{ id: string }> => {
  if (existingStage) {
    console.log(`Updating existing project stage ${existingStage.id} for ${stageName}`);
    
    const { error: updateError } = await supabase
      .from('project_stages')
      .update({
        fee: stageData.fee,
        is_applicable: stageData.isApplicable,
        billing_month: stageData.billingMonth,
        invoice_date: stageData.invoiceDate,
        invoice_status: stageData.status,
        invoice_age: stageData.invoiceAge,
        currency: stageData.currency
      })
      .eq('id', existingStage.id);

    if (updateError) {
      console.error(`Error updating stage ${stageName}:`, updateError);
      throw updateError;
    }
    
    return { id: existingStage.id };
  }
  
  console.log(`Creating new project stage for ${stageName}`);
  
  const { data: newStage, error: newStageError } = await supabase
    .from('project_stages')
    .insert({
      project_id: projectId,
      stage_name: stageName,
      fee: stageData.fee,
      is_applicable: stageData.isApplicable,
      company_id: companyId,
      billing_month: stageData.billingMonth,
      invoice_date: stageData.invoiceDate,
      invoice_status: stageData.status,
      invoice_age: stageData.invoiceAge,
      currency: stageData.currency
    })
    .select()
    .single();

  if (newStageError) {
    console.error(`Error creating stage ${stageName}:`, newStageError);
    throw newStageError;
  }
  
  return { id: newStage.id };
};

