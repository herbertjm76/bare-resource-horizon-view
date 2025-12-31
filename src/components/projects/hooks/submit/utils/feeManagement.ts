
import { supabase } from "@/integrations/supabase/client";
import type { StageData } from "../types/stageSubmitTypes";
import { logger } from '@/utils/logger';

export const handleStageFee = async (
  projectId: string,
  companyId: string,
  stageId: string,
  stageData: StageData
): Promise<void> => {
  logger.log(`Handling stage fee for stage ID ${stageId}`);
  
  const { data: existingFee, error: lookupError } = await supabase
    .from('project_fees')
    .select('id')
    .eq('project_id', projectId)
    .eq('stage_id', stageId)
    .maybeSingle();
    
  if (lookupError) {
    logger.error('Error checking for existing fee:', lookupError);
    throw lookupError;
  }

  const feeRecord = {
    project_id: projectId,
    stage_id: stageId,
    company_id: companyId,
    fee: stageData.fee,
    billing_month: stageData.billingMonth,
    invoice_date: stageData.invoiceDate,
    invoice_status: stageData.status,
    currency: stageData.currency
  };

  if (existingFee) {
    logger.log(`Updating existing fee record ${existingFee.id} for stage ${stageId}`);
    
    const { error: updateError } = await supabase
      .from('project_fees')
      .update(feeRecord)
      .eq('id', existingFee.id);

    if (updateError) {
      logger.error('Error updating fee:', updateError);
      throw updateError;
    }
  } else {
    logger.log(`Creating new fee record for stage ${stageId}`);
    
    const { error: insertError } = await supabase
      .from('project_fees')
      .insert(feeRecord);

    if (insertError) {
      logger.error('Error inserting fee:', insertError);
      throw insertError;
    }
  }
};

