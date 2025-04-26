
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
    avgRate: project.average_rate?.toString() || "", // Using average_rate to match DB field
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
        // First get all office stages
        const { data: officeStageData, error: officeStageError } = await supabase
          .from('office_stages')
          .select('*')
          .eq('company_id', project.company_id);
          
        if (officeStageError) {
          console.error('Error loading office stages:', officeStageError);
          return;
        }
        
        const officeStages = officeStageData || [];
        console.log("Office stages loaded:", officeStages);

        // Then get all project fees directly
        const { data: feesData, error: feesError } = await supabase
          .from('project_fees')
          .select('*')
          .eq('project_id', project.id);
          
        if (feesError) {
          console.error('Error loading project fees:', feesError);
          return;
        }
        
        console.log("Project fees loaded:", feesData);
        
        // Also get project stages for reference
        const { data: projectStages, error: stagesError } = await supabase
          .from('project_stages')
          .select('*')
          .eq('project_id', project.id);

        if (stagesError) {
          console.error('Error loading project stages:', stagesError);
          return;
        }

        console.log("Project stages loaded:", projectStages);

        if (projectStages && projectStages.length > 0 && officeStages && officeStages.length > 0) {
          const stageFees: Record<string, any> = {};
          
          // Process each stage from project.stages
          for (const stageId of initialStages) {
            console.log(`Processing stage ID: ${stageId}`);
            
            // Find the office stage
            const officeStage = officeStages.find(s => s.id === stageId);
            
            if (!officeStage) {
              console.log(`No matching office stage found for ID ${stageId}`);
              continue;
            }
            
            console.log("Found matching office stage:", officeStage);
            
            // Find the project stage by name
            const projectStage = projectStages.find(s => s.stage_name === officeStage.name);
            
            if (!projectStage) {
              console.log(`No project stage found for ${officeStage.name}`);
              stageFees[stageId] = {
                fee: '',
                billingMonth: null,
                status: 'Not Billed',
                invoiceDate: null,
                hours: '',
                invoiceAge: '0',
                currency: 'USD'
              };
              continue;
            }
            
            console.log("Found matching project stage:", projectStage);
            
            // Find fee data for this stage
            const feeData = feesData?.find(fee => fee.stage_id === projectStage.id);
            console.log("Fee data for this stage:", feeData);
            
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
                billingMonth = new Date(feeData.billing_month);
                if (isNaN(billingMonth.getTime())) {
                  billingMonth = null;
                }
              } catch (error) {
                console.error('Error parsing billing month:', error);
                billingMonth = null;
              }
            }

            // Set the stage fee data keyed by the office stage ID
            stageFees[stageId] = {
              fee: feeData?.fee?.toString() || projectStage.fee?.toString() || '',
              billingMonth: billingMonth || (projectStage.billing_month ? new Date(projectStage.billing_month) : null),
              status: feeData?.invoice_status || projectStage.invoice_status || 'Not Billed',
              invoiceDate: feeData?.invoice_date ? new Date(feeData.invoice_date) : null,
              hours: '',
              invoiceAge: invoiceAge,
              currency: feeData?.currency || projectStage.currency || 'USD'
            };
            
            console.log(`Stage fee data for ${stageId} set:`, stageFees[stageId]);
          }

          setForm(prev => {
            console.log("Updating form with stage fees:", stageFees);
            return {
              ...prev,
              stageFees
            };
          });
        }
      } catch (error) {
        console.error("Error in loadProjectFees:", error);
      }
    };

    loadProjectFees();
  }, [project?.id, project?.company_id, initialStages]);

  return {
    form,
    setForm,
    formErrors,
    setFormErrors,
    isLoading,
    setIsLoading
  };
};
