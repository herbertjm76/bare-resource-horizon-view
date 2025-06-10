
import { type StageFee, type FormState } from '../hooks/types/projectTypes';
import { useState } from 'react';
import { toast } from 'sonner';

export const useNewProjectFormState = () => {
  const [form, setForm] = useState<FormState>({
    code: "",
    name: "",
    manager: "",
    country: "",
    profit: "",
    avgRate: "",
    currency: "USD",
    status: "",
    office: "",
    current_stage: "",
    stages: [],
    stageFees: {},
    stageApplicability: {},
    // New financial fields
    budget_amount: 0,
    budget_hours: 0,
    blended_rate: 0,
    contract_start_date: "",
    contract_end_date: "",
    financial_status: "On Track"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(true);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const handleChange = (key: keyof FormState, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
    
    if (formErrors[key]) {
      setFormErrors((prev) => {
        const newErrors = {...prev};
        delete newErrors[key];
        return newErrors;
      });
    }
    
    if (key === 'stages') {
      const newStageFees: Record<string, any> = {};
      const newStageApplicability: Record<string, boolean> = {...form.stageApplicability};
      
      value.forEach((stageId: string) => {
        if (!form.stageFees[stageId]) {
          newStageFees[stageId] = {
            fee: '',
            billingMonth: '',
            status: 'Not Billed',
            invoiceDate: null,
            hours: '',
            invoiceAge: 0,
            currency: form.currency || 'USD'
          };
        } else {
          newStageFees[stageId] = form.stageFees[stageId];
        }
        
        if (newStageApplicability[stageId] === undefined) {
          newStageApplicability[stageId] = true;
        }
      });
      
      setForm(prev => ({
        ...prev,
        stageFees: newStageFees,
        stageApplicability: newStageApplicability
      }));
    }
  };

  return {
    form,
    setForm,
    formErrors,
    setFormErrors,
    isLoading,
    setIsLoading,
    isDataLoaded,
    setIsDataLoaded,
    handleChange
  };
};
