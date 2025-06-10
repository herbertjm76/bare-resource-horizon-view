
import { useState, useEffect } from "react";
import type { FormState } from "../types/projectTypes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useFormState = (
  project: any,
  officeStages: Array<{ id: string; name: string; color?: string }> = []
) => {
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Initialize form with project data
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

  // Load project fees when the component is mounted
  useEffect(() => {
    const loadProjectFees = async () => {
      if (!project?.id) {
        console.log("No project ID, skipping fee data load");
        return;
      }

      if (officeStages.length === 0) {
        console.log("No office stages available, waiting for office stages to load");
        return;
      }

      setIsLoading(true);
      console.log("Loading project fees data for ID:", project.id, "with code:", project.code);

      try {
        // Directly fetch project fees from the project_fees table using project_id
        const { data: feesData, error: feesError } = await supabase
          .from('project_fees')
          .select('*')
          .eq('project_id', project.id);

        if (feesError) {
          console.error('Error loading project fees:', feesError);
          toast.error("Failed to load project fee data");
          setIsLoading(false);
          return;
        }

        console.log("Loaded fees data:", feesData);
        
        // Also fetch project stages to get the mapping between stage IDs and stage names
        const { data: projectStagesData, error: projectStagesError } = await supabase
          .from('project_stages')
          .select('id, stage_name')
          .eq('project_id', project.id);
          
        if (projectStagesError) {
          console.error('Error loading project stages:', projectStagesError);
          toast.error("Failed to load project stages data");
          setIsLoading(false);
          return;
        }
        
        console.log("Loaded project stages data:", projectStagesData);
        
        // Create a mapping from stage_name to ID for lookup
        const stageNameToIdMap = new Map();
        if (projectStagesData) {
          projectStagesData.forEach(stage => {
            stageNameToIdMap.set(stage.stage_name, stage.id);
          });
        }
        
        // Process the stage fees
        const stageFees: Record<string, any> = {};
        
        // Initialize fees for all selected stages
        form.stages.forEach(stageId => {
          const stage = officeStages.find(s => s.id === stageId);
          if (!stage) {
            console.warn(`Stage with ID ${stageId} not found in office stages`);
            return;
          }
          
          // Find the project stage ID that corresponds to this office stage name
          const projectStageId = stageNameToIdMap.get(stage.name);
          
          // Find fee data for this stage using the project stage ID
          const feeData = feesData?.find(fee => fee.stage_id === projectStageId);
          
          if (feeData) {
            console.log(`Found fee data for stage ${stageId} (${stage.name}):`, feeData);
          } else {
            console.log(`No fee data found for stage ${stageId} (${stage.name})`);
          }
          
          // Calculate invoice age if we have an invoice date
          const invoiceDate = feeData?.invoice_date ? new Date(feeData.invoice_date) : null;
          let invoiceAge = 0;
          
          if (invoiceDate && !isNaN(invoiceDate.getTime())) {
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - invoiceDate.getTime());
            invoiceAge = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }

          // Parse billing month to ensure it's a proper Date object
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

          // Set fee data for this stage
          stageFees[stageId] = {
            fee: feeData?.fee?.toString() || '',
            billingMonth: billingMonth,
            status: feeData?.invoice_status || 'Not Billed',
            invoiceDate: feeData?.invoice_date ? new Date(feeData.invoice_date) : null,
            hours: '',
            invoiceAge: invoiceAge,
            currency: feeData?.currency || form.currency || 'USD'
          };
        });

        console.log("Processed stage fees:", stageFees);

        // Update the form state with the loaded stage fees
        setForm(prev => ({
          ...prev,
          stageFees
        }));

        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error in loadProjectFees:", error);
        toast.error("Error loading project fee data");
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectFees();
  }, [project?.id, officeStages, form.stages]);

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
