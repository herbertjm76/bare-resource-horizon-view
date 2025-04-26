
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
    avgRate: project.average_rate?.toString() || "", // Changed from avg_rate to average_rate to match DB field
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
      console.log("Loading project fees for project:", project.id);

      try {
        // First get the project stages
        const { data: projectStages, error: stagesError } = await supabase
          .from('project_stages')
          .select('*')
          .eq('project_id', project.id);

        if (stagesError) {
          console.error('Error loading project stages:', stagesError);
          return;
        }

        console.log("Project stages loaded:", projectStages);

        // Also fetch all office stages to match with project stages
        const { data: officeStageData } = await supabase
          .from('office_stages')
          .select('*')
          .eq('company_id', project.company_id);

        console.log("Office stages loaded:", officeStageData);
        const officeStages = officeStageData || [];

        if (projectStages && projectStages.length > 0) {
          const stageFees: Record<string, any> = {};
          
          // For each project stage, get or initialize its fee data
          for (const stage of projectStages) {
            console.log("Processing stage:", stage);
            
            // Get the corresponding office stage by name
            const officeStageName = stage.stage_name;
            const officeStage = officeStages.find(s => s.name === officeStageName);
            
            if (!officeStage) {
              console.log(`No matching office stage found for ${officeStageName}`);
              continue;
            }
            
            console.log("Found matching office stage:", officeStage);

            // Get fee data for this stage
            const { data: feeData, error: feeError } = await supabase
              .from('project_fees')
              .select('*')
              .eq('project_id', project.id)
              .eq('stage_id', stage.id)
              .maybeSingle();

            if (feeError) {
              console.error(`Error loading fee data for stage ${stage.id}:`, feeError);
            }
            
            console.log("Fee data loaded:", feeData);

            // Calculate invoice age if we have an invoice date
            const invoiceDate = feeData?.invoice_date ? new Date(feeData.invoice_date) : null;
            let invoiceAge = '0';
            
            if (invoiceDate && !isNaN(invoiceDate.getTime())) {
              const now = new Date();
              const diffTime = Math.abs(now.getTime() - invoiceDate.getTime());
              invoiceAge = Math.ceil(diffTime / (1000 * 60 * 60 * 24)).toString();
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

            stageFees[officeStage.id] = {
              fee: feeData?.fee?.toString() || stage.fee?.toString() || '',
              billingMonth: billingMonth || (stage.billing_month ? new Date(stage.billing_month) : null),
              status: feeData?.invoice_status || stage.invoice_status || 'Not Billed',
              invoiceDate: feeData?.invoice_date ? new Date(feeData.invoice_date) : null,
              hours: '',
              invoiceAge: invoiceAge,
              currency: feeData?.currency || stage.currency || 'USD'
            };
            
            console.log(`Stage fee data for ${officeStage.id} set:`, stageFees[officeStage.id]);
          }

          setForm(prev => {
            console.log("Updating form with stage fees:", stageFees);
            return {
              ...prev,
              stageFees
            };
          });
        } else {
          console.log("No project stages found");
        }
      } catch (error) {
        console.error("Error in loadProjectFees:", error);
      }
    };

    loadProjectFees();
  }, [project?.id, project?.company_id]);

  return {
    form,
    setForm,
    formErrors,
    setFormErrors,
    isLoading,
    setIsLoading
  };
};
