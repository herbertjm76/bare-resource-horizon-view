
import { useState } from "react";
import type { FormState } from "../types/projectTypes";
import { supabase } from "@/integrations/supabase/client";
import React from "react";

export const useFormState = (project: any) => {
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // Initialize the stages array from the project data
  const initialStages = Array.isArray(project.stages) ? project.stages : [];
  
  // Create a record of stage selections for easier lookup
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
  
  // Load project stages and fees when initializing
  React.useEffect(() => {
    const loadProjectData = async () => {
      if (!project?.id) {
        console.log("No project ID available, skipping data load");
        return;
      }
      
      setIsLoading(true);
      console.log("Loading project data for project:", project.id);

      try {
        // First get the project stages
        const { data: projectStages, error: stagesError } = await supabase
          .from('project_stages')
          .select('*')
          .eq('project_id', project.id);

        if (stagesError) {
          console.error('Error loading project stages:', stagesError);
          setIsLoading(false);
          return;
        }
        
        // Get project fees
        const { data: feesData, error: feesError } = await supabase
          .from('project_fees')
          .select('*')
          .eq('project_id', project.id);

        if (feesError) {
          console.error('Error loading project fees:', feesError);
          setIsLoading(false);
          return;
        }
        
        // Get all office stages for this company to have the mapping
        const { data: officeStages, error: officeStagesError } = await supabase
          .from('office_stages')
          .select('*')
          .eq('company_id', project.company_id);
          
        if (officeStagesError) {
          console.error('Error loading office stages:', officeStagesError);
          setIsLoading(false);
          return;
        }
        
        // Create stageFees map for the form
        if (initialStages.length > 0 && officeStages && officeStages.length > 0) {
          const stageFees: Record<string, any> = {};
          
          // Process each stage from project.stages (which should be stage IDs)
          for (const stageId of initialStages) {
            console.log(`Processing stage ID: ${stageId}`);
            
            // Find the office stage
            const officeStage = officeStages.find(s => s.id === stageId);
            
            if (!officeStage) {
              console.log(`No matching office stage found for ID ${stageId}`);
              continue;
            }
            
            // Find the project stage by name
            const projectStage = projectStages?.find(s => s.stage_name === officeStage.name);
            
            // Find the fee data using the current stageId (office stage ID)
            const feeData = feesData?.find(fee => fee.stage_id === stageId);
            
            if (!projectStage) {
              console.log(`No project stage found for ${officeStage.name}`);
              // Initialize with default values
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
          }

          setForm(prev => {
            console.log("Updating form with stage fees:", stageFees);
            return {
              ...prev,
              stageFees
            };
          });
        }
        
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error in loadProjectData:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [project?.id, project?.company_id, initialStages]);

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

