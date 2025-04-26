import { useState } from "react";
import type { FormState } from "../types/projectTypes";
import { supabase } from "@/integrations/supabase/client";
import React from "react";

export const useFormState = (project: any) => {
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  
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
  
  const [form, setForm] = useState<FormState>({
    code: project.code || "",
    name: project.name || "",
    manager: project.project_manager?.id || "",
    country: project.country || "",
    profit: project.target_profit_percentage?.toString() || "",
    avgRate: project.avg_rate?.toString() || "", // Keep this line but handle null case
    currency: project.currency || "USD",
    status: project.status || "",
    office: project.office?.id || "",
    current_stage: project.current_stage || "",
    stages: initialStages,
    stageFees: {},
    stageApplicability: initialStageSelections,
  });
  
  // Load project fees when initializing
  React.useEffect(() => {
    const loadProjectFees = async () => {
      if (!project?.id) return;

      const { data: fees, error } = await supabase
        .from('project_fees')
        .select('*')
        .eq('project_id', project.id);

      if (error) {
        console.error('Error loading project fees:', error);
        return;
      }

      if (fees) {
        const stageFees: Record<string, any> = {};
        fees.forEach(fee => {
          stageFees[fee.stage_id] = {
            fee: fee.fee.toString(),
            billingMonth: fee.billing_month,
            status: fee.invoice_status,
            invoiceDate: fee.invoice_date ? new Date(fee.invoice_date) : null,
            hours: '',
            invoiceAge: '',
            currency: fee.currency
          };
        });

        setForm(prev => ({
          ...prev,
          stageFees
        }));
      }
    };

    loadProjectFees();
  }, [project?.id]);

  return {
    form,
    setForm,
    formErrors,
    setFormErrors,
    isLoading,
    setIsLoading
  };
};
