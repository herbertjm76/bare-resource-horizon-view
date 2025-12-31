
import { deleteUnusedStages, createOrUpdateStage } from './utils/stageOperations';
import { handleStageFee } from './utils/feeManagement';
import type { StageSubmitConfig } from './types/stageSubmitTypes';
import { logger } from '@/utils/logger';

export const useStageSubmit = () => {
  const handleStageSubmit = async ({
    projectId,
    companyId,
    selectedStageNames,
    existingStages,
    stageFees,
    stageApplicability,
    officeStages
  }: StageSubmitConfig) => {
    logger.debug("Starting stage submission with data:", {
      projectId,
      selectedStageNames,
      existingStagesCount: existingStages?.length || 0,
      stageFees: Object.keys(stageFees).length,
      stageApplicability: Object.keys(stageApplicability).length,
      officeStages: officeStages.length
    });

    // If no stages selected, delete all existing ones
    if (!selectedStageNames || selectedStageNames.length === 0) {
      if (existingStages && existingStages.length > 0) {
        await deleteUnusedStages(existingStages, new Set());
      }
      return;
    }

    // Handle existing stages
    const stagesToKeep = new Set(selectedStageNames);
    if (existingStages && existingStages.length > 0) {
      await deleteUnusedStages(existingStages, stagesToKeep);
    }

    logger.debug("Processing stages for submission:", selectedStageNames);

    // Create a map from stage IDs to stage names
    const stageIdToNameMap = new Map();
    officeStages.forEach(stage => {
      stageIdToNameMap.set(stage.id, stage.name);
    });

    // Handle stages and their fees
    for (const stageId of Object.keys(stageApplicability)) {
      if (!stageApplicability[stageId]) continue;
      
      const stageName = stageIdToNameMap.get(stageId);
      if (!stageName) {
        logger.warn(`Stage name not found for ID ${stageId}`);
        continue;
      }
      
      const feeData = stageFees[stageId];
      
      if (!feeData) {
        logger.warn(`No fee data found for stage ${stageId} (${stageName})`);
        continue;
      }

      const stageData = {
        fee: feeData?.fee ? parseFloat(String(feeData.fee)) : 0,
        isApplicable: stageApplicability[stageId] ?? true,
        billingMonth: feeData?.billingMonth ? 
          (feeData.billingMonth instanceof Date ? 
            feeData.billingMonth.toISOString() : 
            String(feeData.billingMonth)) : 
          null,
        invoiceDate: feeData?.invoiceDate ? 
          (feeData.invoiceDate instanceof Date ? 
            feeData.invoiceDate.toISOString() : 
            String(feeData.invoiceDate)) : 
          null,
        status: feeData?.status || 'Not Billed',
        invoiceAge: typeof feeData?.invoiceAge === 'number' ? feeData.invoiceAge : 0,
        currency: feeData?.currency || 'USD'
      };
      
      logger.debug(`Submitting stage ${stageName} (${stageId}) with fee:`, stageData.fee);
      
      const existingStage = existingStages?.find(s => s.stage_name === stageName);
      const { id: newStageId } = await createOrUpdateStage(
        projectId,
        companyId,
        stageName,
        stageData,
        existingStage
      );
      
      await handleStageFee(projectId, companyId, newStageId, stageData);
    }
  };

  return { handleStageSubmit };
};
