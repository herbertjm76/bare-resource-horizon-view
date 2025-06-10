
import { useState } from "react";
import type { FormState, StageFee } from "../types/projectTypes";

export const useStageManagement = (form: FormState, setForm: React.Dispatch<React.SetStateAction<FormState>>) => {
  const updateStageApplicability = (stageId: string, isChecked: boolean) => {
    // Update stage applicability
    const stageApplicability = { ...form.stageApplicability };
    stageApplicability[stageId] = isChecked;
    
    // Update stages list
    let stages: string[] = [...form.stages];
    
    if (isChecked && !stages.includes(stageId)) {
      stages.push(stageId);
    } else if (!isChecked && stages.includes(stageId)) {
      stages = stages.filter(id => id !== stageId);
    }
    
    // Initialize fee data if needed
    const stageFees = { ...form.stageFees };
    if (isChecked && !stageFees[stageId]) {
      stageFees[stageId] = {
        fee: '',
        billingMonth: null,
        status: 'Not Billed',
        invoiceDate: null,
        hours: '',
        invoiceAge: 0,
        currency: form.currency
      };
    }
    
    setForm(prev => ({
      ...prev,
      stages,
      stageApplicability,
      stageFees
    }));
  };
  
  const updateStageFee = (stageId: string, data: Partial<StageFee>) => {
    console.log(`Updating fee data for stage ${stageId}:`, data);
    
    setForm(prev => {
      const updatedStageFees = { ...prev.stageFees };
      
      // Ensure we have a fee object for this stage
      if (!updatedStageFees[stageId]) {
        updatedStageFees[stageId] = {
          fee: '',
          billingMonth: null,
          status: 'Not Billed',
          invoiceDate: null,
          hours: '',
          invoiceAge: 0,
          currency: prev.currency
        };
      }
      
      // Update the fee data
      updatedStageFees[stageId] = {
        ...updatedStageFees[stageId],
        ...data
      };
      
      return {
        ...prev,
        stageFees: updatedStageFees
      };
    });
  };
  
  return { updateStageApplicability, updateStageFee };
};
