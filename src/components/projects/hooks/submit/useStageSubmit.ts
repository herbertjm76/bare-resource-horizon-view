
import { supabase } from "@/integrations/supabase/client";

export const useStageSubmit = () => {
  const handleStageSubmit = async (
    projectId: string,
    companyId: string,
    selectedStageNames: string[],
    existingStages: Array<{ id: string; stage_name: string }> | null,
    stageFees: Record<string, any>,
    stageApplicability: Record<string, boolean>,
    officeStages: Array<{ id: string; name: string }>
  ) => {
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
      return;
    }

    // Handle existing stages
    const stagesToKeep = new Set(selectedStageNames);
    const existingStageNames = new Set(existingStages?.map(s => s.stage_name) || []);
    
    if (existingStages && existingStages.length > 0) {
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

    // Handle stages and their fees
    for (const stageName of selectedStageNames) {
      const officeStage = officeStages.find(s => s.name === stageName);
      if (!officeStage) continue;
      
      const stageId = officeStage.id;
      const feeData = stageFees[stageId];
      const fee = feeData?.fee ? parseFloat(feeData.fee) : 0;
      const isApplicable = stageApplicability[stageId] ?? true;
      
      await handleSingleStage(
        projectId,
        companyId,
        stageName,
        fee,
        isApplicable,
        feeData,
        existingStages
      );
    }
  };

  const handleSingleStage = async (
    projectId: string,
    companyId: string,
    stageName: string,
    fee: number,
    isApplicable: boolean,
    feeData: any,
    existingStages: Array<{ id: string; stage_name: string }> | null
  ) => {
    let projectStage = existingStages?.find(s => s.stage_name === stageName);
    
    if (!projectStage) {
      const { data: newStage, error: newStageError } = await supabase
        .from('project_stages')
        .insert({
          project_id: projectId,
          stage_name: stageName,
          fee,
          is_applicable: isApplicable,
          company_id: companyId,
          billing_month: feeData?.billingMonth || null,
          invoice_date: feeData?.invoiceDate ? feeData.invoiceDate.toISOString() : null,
          invoice_status: feeData?.status || 'Not Billed',
          invoice_age: feeData?.invoiceAge ? parseInt(String(feeData.invoiceAge), 10) || 0 : 0,
          currency: feeData?.currency || 'USD'
        })
        .select()
        .single();

      if (newStageError) {
        console.error(`Error creating stage ${stageName}:`, newStageError);
        throw newStageError;
      }
      
      projectStage = newStage;
    } else {
      const { error: updateError } = await supabase
        .from('project_stages')
        .update({
          fee,
          is_applicable: isApplicable,
          billing_month: feeData?.billingMonth || null,
          invoice_date: feeData?.invoiceDate ? feeData.invoiceDate.toISOString() : null,
          invoice_status: feeData?.status || 'Not Billed',
          invoice_age: feeData?.invoiceAge ? parseInt(String(feeData.invoiceAge), 10) || 0 : 0,
          currency: feeData?.currency || 'USD'
        })
        .eq('id', projectStage.id);

      if (updateError) {
        console.error(`Error updating stage ${stageName}:`, updateError);
        throw updateError;
      }
    }

    await handleStageFee(projectId, companyId, projectStage.id, fee, feeData);
  };

  const handleStageFee = async (
    projectId: string,
    companyId: string,
    stageId: string,
    fee: number,
    feeData: any
  ) => {
    const { data: existingFee } = await supabase
      .from('project_fees')
      .select('id')
      .eq('project_id', projectId)
      .eq('stage_id', stageId)
      .single();

    const feeRecord = {
      project_id: projectId,
      stage_id: stageId,
      company_id: companyId,
      fee: fee,
      billing_month: feeData?.billingMonth || null,
      invoice_date: feeData?.invoiceDate ? feeData.invoiceDate.toISOString() : null,
      invoice_status: feeData?.status || 'Not Billed',
      currency: feeData?.currency || 'USD'
    };

    if (existingFee) {
      const { error: updateError } = await supabase
        .from('project_fees')
        .update(feeRecord)
        .eq('id', existingFee.id);

      if (updateError) {
        console.error('Error updating fee:', updateError);
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase
        .from('project_fees')
        .insert(feeRecord);

      if (insertError) {
        console.error('Error inserting fee:', insertError);
        throw insertError;
      }
    }
  };

  return { handleStageSubmit };
};
