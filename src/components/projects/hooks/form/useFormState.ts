
import { useState } from "react";
import type { FormState } from "../types/projectTypes";

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
  });
  
  const [form, setForm] = useState<FormState>({
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

  return {
    form,
    setForm,
    formErrors,
    setFormErrors,
    isLoading,
    setIsLoading
  };
};
