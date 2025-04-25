
import { useState } from "react";
import type { FormState } from "../types/projectTypes";

export const useFormState = (project: any) => {
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const [form, setForm] = useState<FormState>({
    code: project.code || "",
    name: project.name || "",
    manager: project.project_manager?.id || "",
    country: project.country || "",
    profit: project.target_profit_percentage?.toString() || "",
    avgRate: "",
    status: project.status || "",
    office: project.office?.id || "",
    current_stage: project.current_stage || "",
    stages: [],
    stageFees: {},
    stageApplicability: {},
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
