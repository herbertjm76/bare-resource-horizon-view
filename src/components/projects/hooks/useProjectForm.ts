
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

  useEffect(() => {
    if (isOpen && project && Array.isArray(project.stages) && project.stages.length > 0 && officeStages?.length > 0) {
      console.log('useProjectForm - Initializing stages from project:', project.stages);
      
      const stageApplicability: Record<string, boolean> = {};
      let stagesToSet = project.stages;
      
      // Check if we need to convert from names to IDs
      if (typeof project.stages[0] === 'string' && !officeStages.some(s => s.id === project.stages[0])) {
        console.log('Converting stage names to IDs for selection');
        
        stagesToSet = project.stages
          .map(stageName => {
            const stage = officeStages.find(s => s.name === stageName);
            return stage ? stage.id : null;
          })
          .filter(Boolean);
      }
      
      stagesToSet.forEach((stageId: string) => {
        stageApplicability[stageId] = true;
      });
      
      console.log('Setting stage selections:', stageApplicability);
      console.log('Setting stages array:', stagesToSet);
      
      setForm(prev => ({
        ...prev,
        stages: stagesToSet, 
        stageApplicability
      }));
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
              invoiceAge: 0,
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
