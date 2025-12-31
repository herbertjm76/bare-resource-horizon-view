import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { 
  ProjectFormState, 
  StageFee, 
  ManagerOption, 
  OfficeOption, 
  StageOption,
  Project 
} from './types';

// Eliminate prop drilling by providing form state and options through context

interface ProjectFormContextValue {
  form: ProjectFormState;
  setForm: React.Dispatch<React.SetStateAction<ProjectFormState>>;
  formErrors: Record<string, string>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  managers: ManagerOption[];
  countries: string[];
  offices: OfficeOption[];
  officeStages: StageOption[];
  handleChange: <K extends keyof ProjectFormState>(key: K, value: ProjectFormState[K]) => void;
  updateStageFee: (stageId: string, field: keyof StageFee, value: StageFee[keyof StageFee]) => void;
  updateStageApplicability: (stageId: string, applicable: boolean) => void;
}

const ProjectFormContext = createContext<ProjectFormContextValue | null>(null);

export const useProjectFormContext = () => {
  const context = useContext(ProjectFormContext);
  if (!context) {
    throw new Error('useProjectFormContext must be used within ProjectFormProvider');
  }
  return context;
};

interface ProjectFormProviderProps {
  children: React.ReactNode;
  project?: Project;
  isOpen: boolean;
}

export const ProjectFormProvider: React.FC<ProjectFormProviderProps> = ({ 
  children, 
  project,
  isOpen 
}) => {
  const { company } = useCompany();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all form options using React Query
  const { data: managers = [] } = useQuery({
    queryKey: ['managers', company?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('company_id', company!.id);
      
      return (data || []).map(u => ({
        id: u.id,
        name: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim()
      }));
    },
    enabled: isOpen && !!company?.id,
    staleTime: 5 * 60 * 1000,
  });

  const { data: countries = [] } = useQuery({
    queryKey: ['countries', company?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('project_areas')
        .select('name')
        .eq('company_id', company!.id);
      
      return Array.from(new Set((data || []).map(a => a.name).filter(Boolean))) as string[];
    },
    enabled: isOpen && !!company?.id,
    staleTime: 10 * 60 * 1000,
  });

  const { data: offices = [] } = useQuery({
    queryKey: ['offices', company?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('office_locations')
        .select('id, city, country, code, emoji')
        .eq('company_id', company!.id);
      
      return data || [];
    },
    enabled: isOpen && !!company?.id,
    staleTime: 10 * 60 * 1000,
  });

  const { data: officeStages = [] } = useQuery({
    queryKey: ['office-stages', company?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('office_stages')
        .select('id, name, color')
        .eq('company_id', company!.id);
      
      return data || [];
    },
    enabled: isOpen && !!company?.id,
    staleTime: 10 * 60 * 1000,
  });

  // Initialize form state
  const initialStages = Array.isArray(project?.stages) ? project.stages : [];
  const initialStageSelections: Record<string, boolean> = {};
  initialStages.forEach((stageId: string) => {
    initialStageSelections[stageId] = true;
  });

  const [form, setForm] = useState<ProjectFormState>({
    code: project?.code || '',
    name: project?.name || '',
    manager: project?.project_manager_id || '',
    country: project?.country || '',
    profit: project?.target_profit_percentage?.toString() || '',
    avgRate: project?.average_rate?.toString() || '',
    currency: project?.currency || 'USD',
    status: project?.status || '',
    office: project?.office_id || '',
    current_stage: project?.current_stage || '',
    stages: initialStages,
    stageFees: {},
    stageApplicability: initialStageSelections,
  });

  // Optimized change handler with proper memoization
  const handleChange = useCallback(<K extends keyof ProjectFormState>(key: K, value: ProjectFormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));

    if (formErrors[key]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }

    // Handle stages change
    if (key === 'stages' && Array.isArray(value)) {
      setForm(prev => {
        const newStageFees: Record<string, StageFee> = { ...prev.stageFees };
        const newStageApplicability: Record<string, boolean> = { ...prev.stageApplicability };

        (value as string[]).forEach((stageId: string) => {
          if (!newStageFees[stageId]) {
            newStageFees[stageId] = {
              fee: '',
              billingMonth: null,
              status: 'Not Billed',
              invoiceDate: null,
              hours: '',
              invoiceAge: '0',
              currency: prev.currency || 'USD'
            };
          }
          if (newStageApplicability[stageId] === undefined) {
            newStageApplicability[stageId] = true;
          }
        });

        // Remove unselected stages
        const updatedStageFees: Record<string, StageFee> = {};
        Object.keys(newStageFees).forEach(stageId => {
          if ((value as string[]).includes(stageId)) {
            updatedStageFees[stageId] = newStageFees[stageId];
          }
        });

        return {
          ...prev,
          stageFees: updatedStageFees,
          stageApplicability: newStageApplicability
        };
      });
    }
  }, [formErrors]);

  const updateStageFee = useCallback((stageId: string, field: keyof StageFee, value: StageFee[keyof StageFee]) => {
    setForm(prev => ({
      ...prev,
      stageFees: {
        ...prev.stageFees,
        [stageId]: {
          ...prev.stageFees[stageId],
          [field]: value
        }
      }
    }));
  }, []);

  const updateStageApplicability = useCallback((stageId: string, applicable: boolean) => {
    setForm(prev => ({
      ...prev,
      stageApplicability: {
        ...prev.stageApplicability,
        [stageId]: applicable
      }
    }));
  }, []);

  const value = useMemo(() => ({
    form,
    setForm,
    formErrors,
    setFormErrors,
    isLoading,
    setIsLoading,
    managers,
    countries,
    offices,
    officeStages,
    handleChange,
    updateStageFee,
    updateStageApplicability,
  }), [
    form,
    formErrors,
    isLoading,
    managers,
    countries,
    offices,
    officeStages,
    handleChange,
    updateStageFee,
    updateStageApplicability,
  ]);

  return (
    <ProjectFormContext.Provider value={value}>
      {children}
    </ProjectFormContext.Provider>
  );
};
