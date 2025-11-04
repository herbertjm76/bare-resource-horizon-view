import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Eliminate prop drilling by providing form state and options through context

interface FormState {
  code: string;
  name: string;
  manager: string;
  country: string;
  profit: string;
  avgRate: string;
  currency: string;
  status: string;
  office: string;
  current_stage: string;
  stages: string[];
  stageFees: Record<string, any>;
  stageApplicability: Record<string, boolean>;
}

interface ProjectFormContextValue {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  formErrors: Record<string, string>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  managers: Array<{ id: string; name: string }>;
  countries: string[];
  offices: Array<{ id: string; city: string; country: string; code?: string; emoji?: string }>;
  officeStages: Array<{ id: string; name: string; color?: string }>;
  handleChange: (key: keyof FormState, value: any) => void;
  updateStageFee: (stageId: string, field: string, value: any) => void;
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
  project?: any;
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

  const [form, setForm] = useState<FormState>({
    code: project?.code || '',
    name: project?.name || '',
    manager: project?.project_manager?.id || '',
    country: project?.country || '',
    profit: project?.target_profit_percentage?.toString() || '',
    avgRate: project?.avg_rate?.toString() || '',
    currency: project?.currency || 'USD',
    status: project?.status || '',
    office: project?.office?.id || '',
    current_stage: project?.current_stage || '',
    stages: initialStages,
    stageFees: {},
    stageApplicability: initialStageSelections,
  });

  // Optimized change handler with proper memoization
  const handleChange = useCallback((key: keyof FormState, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));

    if (formErrors[key]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }

    // Handle stages change
    if (key === 'stages') {
      setForm(prev => {
        const newStageFees: Record<string, any> = { ...prev.stageFees };
        const newStageApplicability: Record<string, boolean> = { ...prev.stageApplicability };

        value.forEach((stageId: string) => {
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
        const updatedStageFees: Record<string, any> = {};
        Object.keys(newStageFees).forEach(stageId => {
          if (value.includes(stageId)) {
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

  const updateStageFee = useCallback((stageId: string, field: string, value: any) => {
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
