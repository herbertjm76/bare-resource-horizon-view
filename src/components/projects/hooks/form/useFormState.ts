import { useState } from "react";
import type { FormState } from "../types/projectTypes";
import { supabase } from "@/integrations/supabase/client";
import React from "react";

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

  React.useEffect(() => {
    const loadProjectData = async () => {
      if (!project?.id || !officeStages.length) {
        console.log("Skipping data load - waiting for project ID and office stages");
        return;
      }
      
      setIsLoading(true);
      console.log("Loading project data with office stages:", officeStages);

      try {
        const { data: projectStages, error: stagesError } = await supabase
          .from('project_stages')
          .select('*')
          .eq('project_id', project.id);

        if (stagesError) {
          console.error('Error loading project stages:', stagesError);
          setIsLoading(false);
          return;
        }
        
        console.log("Project stages loaded:", projectStages);
        
        const { data: feesData, error: feesError } = await supabase
          .from('project_fees')
          .select('*')
          .eq('project_id', project.id);

        if (feesError) {
          console.error('Error loading project fees:', feesError);
          setIsLoading(false);
          return;
        }
        
        console.log("Project fees loaded:", feesData);
        
        if (initialStages.length > 0) {
          const stageFees: Record<string, any> = {};
          
          for (const stageId of initialStages) {
            console.log(`Processing stage ID: ${stageId}`);
            
            const officeStage = officeStages.find(s => s.id === stageId);
            
            if (!officeStage) {
              console.log(`No matching office stage found for ID ${stageId}`);
              continue;
            }
            
            console.log(`Found office stage:`, officeStage);
            
            const projectStage = projectStages?.find(s => s.stage_name === officeStage.name);
            console.log(`Project stage for ${officeStage.name}:`, projectStage);
            
            const feeData = feesData?.find(fee => fee.stage_id === stageId);
            console.log(`Fee data for stage ${stageId}:`, feeData);

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

            const invoiceDate = feeData?.invoice_date ? new Date(feeData.invoice_date) : null;
            let invoiceAge = '0';
            
            if (invoiceDate && !isNaN(invoiceDate.getTime())) {
              const now = new Date();
              const diffTime = Math.abs(now.getTime() - invoiceDate.getTime());
              invoiceAge = Math.ceil(diffTime / (1000 * 60 * 60 * 24)).toString();
            }

            stageFees[stageId] = {
              fee: feeData?.fee?.toString() || '',
              billingMonth: billingMonth,
              status: feeData?.invoice_status || 'Not Billed',
              invoiceDate: invoiceDate,
              hours: '',
              invoiceAge: invoiceAge,
              currency: feeData?.currency || 'USD'
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
  }, [project?.id, officeStages.length, initialStages]);

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
