
import { useCompany } from '@/context/CompanyContext';
import { useFormState } from './form/useFormState';
import { useFormOptions } from './form/useFormOptions';
import { useStageManagement } from './form/useStageManagement';
import { useEffect } from 'react';

export const useProjectForm = (project: any, isOpen: boolean) => {
  const { company } = useCompany();
  const { managers, countries, offices, officeStages } = useFormOptions(company, isOpen);
  
  const { 
    form, 
    setForm, 
    formErrors, 
    setFormErrors, 
    isLoading, 
    setIsLoading, 
    isDataLoaded 
  } = useFormState(project, officeStages);
  
  const { updateStageFee, updateStageApplicability } = useStageManagement(form, setForm);

  // Debug log to track when stages are being initialized
  useEffect(() => {
    if (isOpen && officeStages.length > 0) {
      console.log("useProjectForm - Current form stages:", form.stages);
      console.log("useProjectForm - Current form stage fees:", form.stageFees);
      console.log("useProjectForm - Available office stages:", officeStages);
    }
  }, [form.stages, form.stageFees, officeStages, isOpen]);

  useEffect(() => {
    if (isOpen && project && officeStages?.length > 0) {
      console.log('useProjectForm - Processing project stages:', project.stages);
      
      let stagesToSet: string[] = [];
      
      // Handle different stage formats (names vs ids)
      if (Array.isArray(project.stages)) {
        if (project.stages.length > 0) {
          const firstStage = project.stages[0];
          
          // Check if we have stage names or ids
          if (typeof firstStage === 'string') {
            // If the first stage doesn't match any office stage ID, assume we have stage names
            const isStageId = officeStages.some(s => s.id === firstStage);
            
            if (isStageId) {
              // We already have stage IDs
              stagesToSet = [...project.stages];
              console.log('Using existing stage IDs:', stagesToSet);
            } else {
              // We have stage names, convert to IDs
              stagesToSet = project.stages
                .map((stageName: string) => {
                  const stage = officeStages.find(s => s.name === stageName);
                  return stage ? stage.id : null;
                })
                .filter(Boolean);
              console.log('Converted stage names to IDs:', stagesToSet);  
            }
          }
        }
      }
      
      // Set stage applicability
      const stageApplicability: Record<string, boolean> = {};
      stagesToSet.forEach((stageId: string) => {
        stageApplicability[stageId] = true;
      });
      
      console.log('Setting stage selections:', stageApplicability);
      console.log('Setting stages array:', stagesToSet);
      
      if (stagesToSet.length > 0) {
        setForm(prev => ({
          ...prev,
          stages: stagesToSet, 
          stageApplicability
        }));
      }
    }
  }, [isOpen, project, officeStages, setForm]);

  return {
    form,
    isLoading,
    setIsLoading,
    managers,
    countries,
    offices,
    officeStages,
    formErrors,
    handleChange: (key: keyof typeof form, value: any) => {
      console.log(`handleChange: ${String(key)} =`, value);
      
      setForm(prev => ({ ...prev, [key]: value }));
      
      if (formErrors[key]) {
        setFormErrors(prev => {
          const newErrors = {...prev};
          delete newErrors[key];
          return newErrors;
        });
      }
      
      if (key === 'stages') {
        const newStageFees: Record<string, any> = {...form.stageFees};
        const newStageApplicability: Record<string, boolean> = {...form.stageApplicability};
        
        console.log('Updating stages to:', value);
        
        value.forEach((stageId: string) => {
          if (!newStageFees[stageId]) {
            newStageFees[stageId] = {
              fee: '',
              billingMonth: null,
              status: 'Not Billed',
              invoiceDate: null,
              hours: '',
              invoiceAge: '0',
              currency: form.currency || 'USD'
            };
          }
          
          if (newStageApplicability[stageId] === undefined) {
            newStageApplicability[stageId] = true;
          }
        });
        
        // Remove stages that are no longer selected
        const updatedStageFees: Record<string, any> = {};
        Object.keys(newStageFees).forEach(stageId => {
          if (value.includes(stageId)) {
            updatedStageFees[stageId] = newStageFees[stageId];
          }
        });
        
        setForm(prev => ({
          ...prev,
          stageFees: updatedStageFees,
          stageApplicability: newStageApplicability
        }));
      }
    },
    updateStageFee,
    updateStageApplicability,
    isDataLoaded
  };
};
