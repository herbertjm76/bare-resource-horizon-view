
import { useCompany } from '@/context/CompanyContext';
import { useFormState } from './form/useFormState';
import { useFormOptions } from './form/useFormOptions';
import { useStageManagement } from './form/useStageManagement';
import { useEffect } from 'react';

export const useProjectForm = (project: any, isOpen: boolean) => {
  const { company } = useCompany();
  const { form, setForm, formErrors, setFormErrors, isLoading, setIsLoading } = useFormState(project);
  const { managers, countries, offices, officeStages } = useFormOptions(company, isOpen);
  const { updateStageFee, updateStageApplicability } = useStageManagement(form, setForm);

  // Initialize stage applicability when project and stages are loaded
  useEffect(() => {
    if (isOpen && project && Array.isArray(project.stages) && project.stages.length > 0) {
      console.log('useProjectForm - Initializing stages from project:', project.stages);
      
      const stageApplicability: Record<string, boolean> = {};
      
      project.stages.forEach((stageId: string) => {
        stageApplicability[stageId] = true;
      });
      
      setForm(prev => ({
        ...prev,
        stages: project.stages, // Ensure stages are explicitly set
        stageApplicability
      }));

      // Fetch stage fees data if available
      if (project.id) {
        console.log('Initializing stage fees for project:', project.id);
        // This would be handled by useStageManagement or other data loading logic
      }
    }
  }, [isOpen, project, setForm]);

  const handleChange = (key: keyof typeof form, value: any) => {
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
            billingMonth: '',
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
      
      // Cleanup removed stages
      const stagesToKeep = Object.keys(newStageFees).filter(stageId => 
        value.includes(stageId)
      );
      
      const updatedStageFees: Record<string, any> = {};
      stagesToKeep.forEach(stageId => {
        updatedStageFees[stageId] = newStageFees[stageId];
      });
      
      setForm(prev => ({
        ...prev,
        stageFees: updatedStageFees,
        stageApplicability: newStageApplicability
      }));
    }
  };

  return {
    form,
    isLoading,
    setIsLoading,
    managers,
    countries,
    offices,
    officeStages,
    formErrors,
    handleChange,
    updateStageFee,
    updateStageApplicability
  };
};
