
import { useState, useEffect } from "react";
import type { FormState } from "../types/projectTypes";
import { supabase } from "@/integrations/supabase/client";

export const useFormState = (
  project: any,
  officeStages: Array<{ id: string; name: string }> = []
) => {
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const initialStages = Array.isArray(project.stages) ? project.stages : [];
  
  const initialStageSelections: Record<string, boolean> = {};
  initialStages.forEach((stageId: string) => {
    initialStageSelections[stageId] = true;
  });

  const [form, setForm] = useState<FormState>({
    code: project.code || "",
    name: project.name || "",
    manager: project.project_manager?.id || "",
    country: project.country || "",
    profit: project.target_profit_percentage?.toString() || "",
    avgRate: project.average_rate?.toString() || "",
    currency: project.currency || "USD",
    status: project.status || "",
    office: project.office?.id || "",
    current_stage: project.current_stage || "",
    stages: initialStages,
    stageFees: {},
    stageApplicability: initialStageSelections,
  });

  useEffect(() => {
    const loadProjectData = async () => {
      if (!project?.id || !officeStages.length) {
        console.log("Skipping data load - missing project ID or office stages");
        return;
      }

      setIsLoading(true);
      console.log("Loading project data for ID:", project.id);

      try {
        // Fetch project fees data
        const { data: feesData, error: feesError } = await supabase
          .from('project_fees')
          .select('*')
          .eq('project_id', project.id);

        if (feesError) {
          console.error('Error loading project fees:', feesError);
          return;
        }

        console.log("Loaded fees data:", feesData);

        // Process fees data for each stage
        const stageFees: Record<string, any> = {};
        
        for (const stage of officeStages) {
          const feeData = feesData?.find(fee => fee.stage_id === stage.id);
          
          // Calculate invoice age
          const invoiceDate = feeData?.invoice_date ? new Date(feeData.invoice_date) : null;
          let invoiceAge = '0';
          
          if (invoiceDate && !isNaN(invoiceDate.getTime())) {
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - invoiceDate.getTime());
            invoiceAge = Math.ceil(diffTime / (1000 * 60 * 60 * 24)).toString();
          }

          // Parse billing month
          let billingMonth = null;
          if (feeData?.billing_month) {
            try {
              billingMonth = new Date(feeData.billing_month);
              if (isNaN(billingMonth.getTime())) {
                billingMonth = null;
              }
            } catch (error) {
              console.error('Error parsing billing month:', error);
              billingMonth = null;
            }
          }

          stageFees[stage.id] = {
            fee: feeData?.fee?.toString() || '',
            billingMonth: billingMonth,
            status: feeData?.invoice_status || 'Not Billed',
            invoiceDate: feeData?.invoice_date ? new Date(feeData.invoice_date) : null,
            hours: '',
            invoiceAge: invoiceAge,
            currency: feeData?.currency || 'USD'
          };
        }

        console.log("Processed stage fees:", stageFees);

        setForm(prev => ({
          ...prev,
          stageFees
        }));

        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error in loadProjectData:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [project?.id, officeStages]);

  return {
    form,
    setForm,
    formErrors,
    setFormErrors,
    isLoading,
    setIsLoading,
    isDataLoaded
  };
};
