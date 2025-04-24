import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCompany } from '@/context/CompanyContext';

interface StageFee {
  fee: string;
  billingMonth: string;
  status: "Not Billed" | "Invoiced" | "Paid" | "";
  invoiceDate: Date | null;
  hours: string;
  invoiceAge: number;
}

interface FormState {
  code: string;
  name: string;
  manager: string;
  country: string;
  profit: string;
  avgRate: string;
  status: string;
  office: string;
  current_stage: string;
  stages: string[];
  stageFees: Record<string, StageFee>;
  stageApplicability: Record<string, boolean>;
}

export const useProjectForm = (project: any, isOpen: boolean) => {
  const { company } = useCompany();
  const [isLoading, setIsLoading] = useState(false);
  const [managers, setManagers] = useState<Array<{ id: string; name: string }>>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [offices, setOffices] = useState<Array<{ id: string; city: string; country: string; code?: string; emoji?: string }>>([]);
  const [officeStages, setOfficeStages] = useState<Array<{ id: string; name: string }>>([]);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

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

  useEffect(() => {
    const fetchFormOptions = async () => {
      if (!company || !company.id) return;
      
      try {
        const { data: mgrs } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .eq('company_id', company.id);

        setManagers(Array.isArray(mgrs)
          ? mgrs.map(u => ({ 
              id: u.id, 
              name: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() 
            }))
          : []);

        const { data: areas } = await supabase
          .from('project_areas')
          .select('name')
          .eq('company_id', company.id);

        setCountries(Array.from(new Set(
          Array.isArray(areas) ? areas.map(a => a.name).filter(Boolean) : []
        )));

        const { data: locs } = await supabase
          .from('office_locations')
          .select('id, city, country, code, emoji')
          .eq('company_id', company.id);

        setOffices(Array.isArray(locs) ? locs : []);

        const { data: stages } = await supabase
          .from('office_stages')
          .select('id, name')
          .eq('company_id', company.id);

        const stagesArray = Array.isArray(stages) ? stages : [];
        setOfficeStages(stagesArray);

        const { data: projectStages } = await supabase
          .from('project_stages')
          .select('stage_name, fee, is_applicable')
          .eq('project_id', project.id);

        const currentStageName = project.current_stage;
        let stageIds: string[] = [];
        
        const selectedStageIds = (project.stages as string[] || [])
          .map(stageName => {
            const matchingStage = stagesArray.find(s => s.name === stageName);
            return matchingStage ? matchingStage.id : null;
          })
          .filter(Boolean);

        if (currentStageName) {
          const matchingStage = stagesArray.find(s => s.name === currentStageName);
          if (matchingStage) {
            stageIds.push(matchingStage.id);
          }
        }

        if (Array.isArray(projectStages) && projectStages.length > 0) {
          const stagesMap = new Map();
          const applicabilityMap: Record<string, boolean> = {};
          const feesMap: Record<string, any> = {};

          projectStages?.forEach(ps => {
            const matchingStage = stagesArray.find(os => os.name === ps.stage_name);
            if (matchingStage) {
              stagesMap.set(matchingStage.id, true);
              applicabilityMap[matchingStage.id] = ps.is_applicable ?? true;
              feesMap[matchingStage.id] = {
                fee: ps.fee?.toString() || '',
                billingMonth: '',
                status: 'Not Billed',
                invoiceDate: null,
                hours: '',
                invoiceAge: 0
              };
            }
          });

          setForm(prev => ({
            ...prev,
            stages: Array.from(stagesMap.keys()),
            stageApplicability: applicabilityMap,
            stageFees: feesMap
          }));
        } else if (selectedStageIds.length > 0) {
          const stageFees: Record<string, any> = {};
          selectedStageIds.forEach(id => {
            stageFees[id] = {
              fee: '',
              billingMonth: '',
              status: 'Not Billed',
              invoiceDate: null,
              hours: '',
              invoiceAge: 0
            };
          });
          
          setForm(prev => ({
            ...prev,
            stages: selectedStageIds,
            stageFees
          }));
        }
      } catch (error) {
        console.error('Error fetching form options:', error);
        toast.error('Failed to load form options');
      }
    };

    if (isOpen) {
      fetchFormOptions();
    }
  }, [company, isOpen, project.id, project.current_stage]);

  const handleChange = (key: keyof FormState, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (formErrors[key]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const updateStageFee = (stageId: string, data: Partial<StageFee>) => {
    setForm(prev => ({
      ...prev,
      stageFees: {
        ...prev.stageFees,
        [stageId]: {
          ...prev.stageFees[stageId],
          ...data
        }
      }
    }));
  };

  const updateStageApplicability = (stageId: string, isApplicable: boolean) => {
    setForm(prev => ({
      ...prev,
      stageApplicability: {
        ...prev.stageApplicability,
        [stageId]: isApplicable
      }
    }));
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
