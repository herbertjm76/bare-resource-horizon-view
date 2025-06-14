
import { useState } from "react";
import type { FormState } from "./types/projectTypes";
import { supabase } from "@/integrations/supabase/client";
import React from "react";

// Add refetchSignal to support reload when changed; default to null for compatibility
export const useFormState = (project: any, officeStages: any = [], refetchSignal: any = null) => {
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  // This effect will rerun when refetchSignal changes, reloading the state if needed.
  // Make initialStages and all internal state reload on refetchSignal.
  // Initialize the stages array from the project data
  const initialStages = Array.isArray(project.stages) ? project.stages : [];

  // Log for debugging
  console.log('useFormState - initializing with project:', project);
  console.log('useFormState - initialStages:', initialStages);

  // Create a record of stage selections for easier lookup
  const initialStageSelections: Record<string, boolean> = {};
  initialStages.forEach((stageId: string) => {
    initialStageSelections[stageId] = true;
    console.log(`Setting stage ${stageId} to selected`);
  });

  // Make state resettable when refetchSignal or project.id changes
  const [form, setForm] = React.useState<FormState>({
    code: project.code || "",
    name: project.name || "",
    manager: project.project_manager?.id || "",
    country: project.country || "",
    profit: project.target_profit_percentage?.toString() || "",
    avgRate: project.avg_rate?.toString() || "",
    currency: project.currency || "USD",
    status: project.status || "",
    office: project.office?.id || "",
    current_stage: project.current_stage || "",
    stages: initialStages,
    stageFees: {},
    stageApplicability: initialStageSelections,
  });

  // When refetchSignal or project.id changes, reload the form state to initial values
  React.useEffect(() => {
    setForm({
      code: project.code || "",
      name: project.name || "",
      manager: project.project_manager?.id || "",
      country: project.country || "",
      profit: project.target_profit_percentage?.toString() || "",
      avgRate: project.avg_rate?.toString() || "",
      currency: project.currency || "USD",
      status: project.status || "",
      office: project.office?.id || "",
      current_stage: project.current_stage || "",
      stages: Array.isArray(project.stages) ? project.stages : [],
      stageFees: {},
      stageApplicability: (Array.isArray(project.stages)
        ? project.stages.reduce((acc: Record<string, boolean>, stageId: string) => {
            acc[stageId] = true;
            return acc;
          }, {})
        : {}),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id, refetchSignal]);

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
        console.error('Error loading project stages:', stagesError);
        return;
      }

      if (projectStages) {
        const stageFees: Record<string, any> = {};

        // For each project stage, get or initialize its fee data
        for (const stage of projectStages) {
          // Get the corresponding office stage name
          const officeStageName = stage.stage_name;

          // Get fee data for this stage
          const { data: feeData } = await supabase
            .from('project_fees')
            .select('*')
            .eq('project_id', project.id)
            .eq('stage_id', stage.id)
            .single();

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
              // Try to parse the billing month which might be in different formats
              billingMonth = new Date(feeData.billing_month);
              if (isNaN(billingMonth.getTime())) {
                billingMonth = null;
              }
            } catch (error) {
              console.error('Error parsing billing month:', error);
              billingMonth = null;
            }
          }

          // Find the office stage ID that matches this stage name
          // This would require office stages to be available, but since we removed that dependency,
          // we'll need to match by stage name directly
          stageFees[stage.stage_name] = {
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
  }, [project?.id, refetchSignal]);

  return {
    form,
    setForm,
    formErrors,
    setFormErrors,
    isLoading,
    setIsLoading
  };
};
