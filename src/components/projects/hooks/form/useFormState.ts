
import { useState } from "react";
// FIXED import path:
import type { FormState } from "../types/projectTypes";
import { supabase } from "@/integrations/supabase/client";
import React from "react";
import { logger } from '@/utils/logger';

/**
 * Loads and persists all stage fees using stageId as the key, not stageName.
 * Accepts officeStages as argument for name-to-id lookups.
 */
export const useFormState = (project: any, officeStages: any = [], refetchSignal: any = null) => {
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  // Find the mapping from stage name to stage id
  const stageNameToId: Record<string, string> = {};
  if (Array.isArray(officeStages)) {
    officeStages.forEach((stage: any) => {
      stageNameToId[stage.name] = stage.id;
    });
  }

  // This effect will rerun when refetchSignal changes, reloading the state if needed.
  // Initialize the stages array from the project data
  const initialStages = Array.isArray(project?.stages) ? project.stages : [];

  // Log for debugging
  logger.debug('useFormState - initializing with project:', project);
  logger.debug('useFormState - initialStages:', initialStages);

  // Create a record of stage selections for easier lookup (by id)
  const initialStageSelections: Record<string, boolean> = {};
  initialStages.forEach((stageId: string) => {
    initialStageSelections[stageId] = true;
    logger.debug(`Setting stage ${stageId} to selected`);
  });

  // Make state resettable when refetchSignal or project.id changes
  const [form, setForm] = React.useState<FormState>({
    code: project?.code || "",
    name: project?.name || "",
    manager: project?.project_manager?.id || "",
    country: project?.country || "",
    profit: project?.target_profit_percentage?.toString() || "",
    avgRate: project?.avg_rate?.toString() || "",
    currency: project?.currency || "USD",
    status: project?.status || "",
    office: project?.office?.id || "",
    current_stage: project?.current_stage || "",
    stages: initialStages,
    stageFees: {},
    stageApplicability: initialStageSelections,
  });

  // When refetchSignal or project.id changes, reload the form state to initial values
  React.useEffect(() => {
    setForm({
      code: project?.code || "",
      name: project?.name || "",
      manager: project?.project_manager?.id || "",
      country: project?.country || "",
      profit: project?.target_profit_percentage?.toString() || "",
      avgRate: project?.avg_rate?.toString() || "",
      currency: project?.currency || "USD",
      status: project?.status || "",
      office: project?.office?.id || "",
      current_stage: project?.current_stage || "",
      stages: Array.isArray(project?.stages) ? project.stages : [],
      stageFees: {},
      stageApplicability: (Array.isArray(project?.stages)
        ? project.stages.reduce((acc: Record<string, boolean>, stageId: string) => {
            acc[stageId] = true;
            return acc;
          }, {})
        : {}),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id, refetchSignal]);

  // Load project fees when initializing or refetchSignal changes
  React.useEffect(() => {
    const loadProjectFees = async () => {
      if (!project?.id) return;

      // First get the project stages
      const { data: projectStages, error: stagesError } = await supabase
        .from('project_stages')
        .select('*')
        .eq('project_id', project.id);

      if (stagesError) {
        logger.error('Error loading project stages:', stagesError);
        return;
      }

      if (projectStages) {
        const stageFees: Record<string, any> = {};

        for (const stage of projectStages) {
          // Use stage.id as the key
          const stageId = stageNameToId[stage.stage_name] || stage.id; // fallback to stage.id if not found

          // Get fee data for this stage
          const { data: feeData } = await supabase
            .from('project_fees')
            .select('*')
            .eq('project_id', project.id)
            .eq('stage_id', stageId)
            .maybeSingle();

          // Calculate invoice age if we have an invoice date
          const invoiceDate = feeData?.invoice_date ? new Date(feeData.invoice_date) : null;
          let invoiceAge = 0;

          if (invoiceDate && !isNaN(invoiceDate.getTime())) {
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - invoiceDate.getTime());
            invoiceAge = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }

          // Format billing month as a Date object if it's a string
          let billingMonth = null;
          if (feeData?.billing_month) {
            try {
              billingMonth = new Date(feeData.billing_month);
              if (isNaN(billingMonth.getTime())) billingMonth = null;
            } catch (error) {
              logger.error('Error parsing billing month:', error);
              billingMonth = null;
            }
          }

          stageFees[stageId] = {
            fee: feeData?.fee?.toString() || stage.fee?.toString() || '',
            billingMonth: billingMonth || (stage.billing_month ? new Date(stage.billing_month) : null),
            status: feeData?.invoice_status || stage.invoice_status || 'Not Billed',
            invoiceDate: feeData?.invoice_date ? new Date(feeData.invoice_date) : null,
            hours: '',
            invoiceAge: invoiceAge,
            currency: feeData?.currency || stage.currency || 'USD'
          };
        }

        setForm(prev => ({
          ...prev,
          stageFees
        }));
      }
    };

    loadProjectFees();
  }, [project?.id, refetchSignal, officeStages]);

  return {
    form,
    setForm,
    formErrors,
    setFormErrors,
    isLoading,
    setIsLoading
  };
};
