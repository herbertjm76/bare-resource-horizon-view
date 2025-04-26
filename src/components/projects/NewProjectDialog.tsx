import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCompany } from '@/context/CompanyContext';
import type { Database } from "@/integrations/supabase/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProjectInfoTab } from "./ProjectTabs/ProjectInfoTab";
import { ProjectStageFeesTab } from "./ProjectTabs/ProjectStageFeesTab";
import { type ProjectStage } from './utils/projectMappings';

type RoleOption = { id: string; name: string };
type OfficeOption = { id: string; city: string; country: string; code?: string; emoji?: string };
type OfficeStageOption = { id: string; name: string; };
type ProjectStatus = Database["public"]["Enums"]["project_status"];
type DbProjectStatus = Database["public"]["Enums"]["project_status"];

const statusOptions = [
  { label: "Not started", value: "Planning" as ProjectStatus },
  { label: "On-going", value: "In Progress" as ProjectStatus },
  { label: "Completed", value: "Complete" as ProjectStatus },
  { label: "On hold", value: "On Hold" as ProjectStatus },
];

export type ProjectForm = {
  code: string;
  name: string;
  manager: string;
  country: string;
  profit: string;
  avgRate: string;
  currency: string;
  status: ProjectStatus | string;
  office: string;
  current_stage: string;
  stages: string[];
  stageFees: Record<string, {
    fee: string;
    billingMonth: Date | string | null;
    status: "Not Billed" | "Invoiced" | "Paid" | "";
    invoiceDate: Date | null;
    hours: string;
    invoiceAge: string | number;
    currency: string;
  }>;
  stageApplicability: Record<string, boolean>;
};

export const NewProjectDialog: React.FC<{ onProjectCreated?: () => void }> = ({ onProjectCreated }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const { company } = useCompany();

  const [form, setForm] = useState<ProjectForm>({
    code: "",
    name: "",
    manager: "",
    country: "",
    profit: "",
    avgRate: "",
    currency: "USD", // Added default currency
    status: "",
    office: "",
    current_stage: "",
    stages: [],
    stageFees: {},
    stageApplicability: {},
  });

  const [managers, setManagers] = useState<RoleOption[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [offices, setOffices] = useState<OfficeOption[]>([]);
  const [officeStages, setOfficeStages] = useState<OfficeStageOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!company || !company.id) {
        toast.error("No company context found, cannot load project resources.");
        return;
      }
      try {
        const { data: mgrs } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, role')
          .eq('role', 'member')
          .eq('company_id', company.id);

        setManagers(Array.isArray(mgrs)
          ? mgrs.map((u) => ({ id: u.id, name: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() }))
          : []);

        const { data: projectAreas } = await supabase
          .from('project_areas')
          .select('name')
          .eq('company_id', company.id);

        const areaNames = Array.from(new Set(Array.isArray(projectAreas)
          ? projectAreas.map(a => a.name).filter(Boolean)
          : [])) as string[];
        setCountries(areaNames);

        const { data: locations } = await supabase
          .from('office_locations')
          .select('id, city, country, code, emoji')
          .eq('company_id', company.id);

        setOffices(Array.isArray(locations) ? locations : []);

        const { data: officeStagesData } = await supabase
          .from('office_stages')
          .select('id, name')
          .eq('company_id', company.id);

        setOfficeStages(Array.isArray(officeStagesData) ? officeStagesData : []);
      } catch (error) {
        toast.error("Failed to load project options");
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, company]);

  const handleChange = (key: keyof ProjectForm, value: any) => {
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
            invoiceAge: 0
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

  const updateStageApplicability = (stageId: string, isChecked: boolean) => {
    setForm(prev => ({
      ...prev,
      stageApplicability: {
        ...prev.stageApplicability,
        [stageId]: isChecked
      }
    }));
  };

  const updateStageFee = (stageId: string, data: Partial<ProjectForm['stageFees'][string]>) => {
    setForm(prev => {
      let hours = prev.stageFees[stageId]?.hours ?? '';
      const feeVal = data.fee ?? prev.stageFees[stageId]?.fee ?? '';
      const avgRateVal = prev.avgRate;
      if ((data.fee || data.fee === '') && avgRateVal && parseFloat(avgRateVal) > 0 && parseFloat(feeVal) > 0) {
        hours = (parseFloat(feeVal) / parseFloat(avgRateVal)).toFixed(2);
      } else if (!parseFloat(feeVal) || !parseFloat(avgRateVal)) {
        hours = '';
      }
      let invoiceAge = prev.stageFees[stageId]?.invoiceAge ?? 0;
      const invoiceDate = typeof data.invoiceDate !== "undefined" ? data.invoiceDate : prev.stageFees[stageId]?.invoiceDate;
      if (invoiceDate instanceof Date && !isNaN(invoiceDate.getTime())) {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - invoiceDate.getTime());
        invoiceAge = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      } else {
        invoiceAge = 0;
      }
      return {
        ...prev,
        stageFees: {
          ...prev.stageFees,
          [stageId]: {
            ...prev.stageFees[stageId],
            ...data,
            hours,
            invoiceAge,
          }
        }
      };
    });
  };

  const isProjectInfoValid = () => {
    return (
      !!form.code &&
      !!form.name &&
      form.country && form.country !== 'none' &&
      !!form.profit &&
      form.status && form.status !== 'none' &&
      form.office && form.office !== 'none'
    );
  };

  const isStageFeesValid = () => {
    return form.stages.every((stageId) => {
      return !!form.stageFees[stageId]?.fee;
    });
  };

  const handleTabChange = (tab: string) => {
    if (tab === "stageFees" && !isProjectInfoValid()) {
      toast.error("Please fill in all required fields in Project Info before proceeding.");
      return;
    }
    setActiveTab(tab);
  };

  const checkProjectCodeUnique = async () => {
    if (!company || !company.id || !form.code.trim()) {
      return true; // Skip validation if no company or code
    }
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('code')
        .eq('code', form.code)
        .eq('company_id', company.id)
        .limit(1);
      
      if (error) {
        console.error("Error checking project code:", error);
        toast.error("Failed to validate project code");
        return false;
      }
      
      if (data && data.length > 0) {
        setFormErrors(prev => ({
          ...prev,
          code: `Project code "${form.code}" already exists. Please use a unique code.`
        }));
        return false;
      }
      
      return true;
    } catch (err) {
      console.error("Exception checking project code:", err);
      return false;
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProjectInfoValid()) {
      toast.error("Please complete all required fields.");
      setActiveTab("info");
      return;
    }
    if (!company || !company.id) {
      toast.error('No company context found.');
      return;
    }
    
    const isCodeUnique = await checkProjectCodeUnique();
    if (!isCodeUnique) {
      toast.error(`Project code "${form.code}" already exists. Please use a unique code.`);
      setActiveTab("info");
      return;
    }
    
    setIsLoading(true);
    try {
      // Get stage names from selected stage IDs
      const selectedStageNames = form.stages.map(stageId => {
        const stage = officeStages.find(os => os.id === stageId);
        return stage ? stage.name : '';
      }).filter(Boolean);

      const projectStatus = form.status === 'none' ? "Planning" : (form.status || "Planning");
      const manager = form.manager === 'none' ? null : (form.manager === "not_assigned" ? null : (form.manager || null));
      const country = form.country === 'none' ? null : form.country;
      const office = form.office === 'none' ? null : form.office;
      
      const currentStage = (form.current_stage === 'none' || !form.current_stage) 
        ? null 
        : form.current_stage;
      
      const { data, error } = await supabase.from('projects').insert({
        code: form.code,
        name: form.name,
        company_id: company.id,
        project_manager_id: manager,
        office_id: office,
        status: projectStatus as DbProjectStatus,
        country: country,
        current_stage: currentStage,
        target_profit_percentage: form.profit ? Number(form.profit) : null,
        stages: selectedStageNames  // New field to store selected stages
      }).select();

      if (error) throw error;
      const projectId = data?.[0]?.id;

      if (projectId && form.stages.length) {
        const stageFeesPromises = form.stages.map(stageId => {
          const feeObj = form.stageFees[stageId];
          const stage = officeStages.find(s => s.id === stageId);
          return supabase.from('project_stages').insert({
            project_id: projectId,
            company_id: company.id,
            stage_name: stage?.name ?? "Unknown Stage",
            fee: feeObj?.fee ? parseFloat(feeObj.fee) : 0,
            is_applicable: form.stageApplicability?.[stageId] ?? true
          });
        });
        await Promise.all(stageFeesPromises);
      }

      setOpen(false);
      toast.success('Project successfully created!');
      setForm({
        code: "", 
        name: "", 
        manager: "", 
        country: "",
        profit: "", 
        avgRate: "", 
        currency: "USD", // Added the missing currency field
        status: "", 
        office: "", 
        current_stage: "",
        stages: [],
        stageFees: {},
        stageApplicability: {}
      });
      setFormErrors({});
      setActiveTab("info");
      if (typeof onProjectCreated === 'function') {
        onProjectCreated();
      }
    } catch (error: any) {
      toast.error("Failed to create project: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) setActiveTab("info"); setOpen(o); }}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Add New Project
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="info">Project Info</TabsTrigger>
              <TabsTrigger value="stageFees">Stage Fees</TabsTrigger>
              <TabsTrigger value="financial">Financial Info</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <ProjectInfoTab 
                form={form} 
                managers={managers}
                countries={countries}
                offices={offices}
                officeStages={officeStages}
                statusOptions={statusOptions}
                onChange={handleChange}
                updateStageApplicability={updateStageApplicability}
              />
            </TabsContent>

            <TabsContent value="stageFees">
              <ProjectStageFeesTab 
                form={form}
                officeStages={officeStages}
                updateStageFee={updateStageFee}
              />
            </TabsContent>

            <TabsContent value="financial">
              <div className="py-8 text-center text-muted-foreground">
                Financial project info coming soon.
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end mt-8">
            <Button type="submit" variant="default" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
