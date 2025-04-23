
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

type RoleOption = { id: string; name: string };
type OfficeOption = { id: string; city: string; country: string; code?: string; emoji?: string };
type OfficeStageOption = { id: string; name: string; };
type ProjectStatus = Database["public"]["Enums"]["project_status"];

const statusOptions = [
  { label: "Not started", value: "Planning" as ProjectStatus },
  { label: "On-going", value: "In Progress" as ProjectStatus },
  { label: "Completed", value: "Complete" as ProjectStatus },
  { label: "On hold", value: "On Hold" as ProjectStatus },
];

// Export this type for use in tab components
export type ProjectForm = {
  code: string;
  name: string;
  manager: string;
  country: string;
  profit: string;
  avgRate: string;
  status: ProjectStatus | string;
  office: string;
  stages: string[];
  stageFees: Record<string, {
    fee: string;
    billingMonth: string;
    status: "Not Billed" | "Invoiced" | "Paid" | "";
    invoiceDate: Date | null;
    hours: string;
    invoiceAge: number;
  }>;
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
    status: "",
    office: "",
    stages: [],
    stageFees: {},
  });

  const [managers, setManagers] = useState<RoleOption[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [offices, setOffices] = useState<OfficeOption[]>([]);
  const [officeStages, setOfficeStages] = useState<OfficeStageOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    if (key === 'stages') {
      const newStageFees: Record<string, any> = {};
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
      });
      setForm(prev => ({
        ...prev,
        stageFees: newStageFees
      }));
    }
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
    // Update validation to accept 'none' as invalid
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
    setIsLoading(true);
    try {
      // Make sure we're not submitting 'none' as a value to the database
      const projectStatus = form.status === 'none' ? "Planning" : (form.status || "Planning");
      const manager = form.manager === 'none' ? null : (form.manager === "not_assigned" ? null : (form.manager || null));
      const country = form.country === 'none' ? null : form.country;
      const office = form.office === 'none' ? null : form.office;
      
      const { data, error } = await supabase.from('projects').insert({
        code: form.code,
        name: form.name,
        company_id: company.id,
        project_manager_id: manager,
        office_id: office,
        status: projectStatus as ProjectStatus,
        country: country,
        target_profit_percentage: form.profit ? Number(form.profit) : null
      }).select();

      if (error) throw error;
      const projectId = data?.[0]?.id;

      if (projectId && form.stages.length) {
        const stageFeesPromises = form.stages.map(stageId => {
          const feeObj = form.stageFees[stageId];
          return supabase.from('project_stages').insert({
            project_id: projectId,
            company_id: company.id,
            stage_name: officeStages.find(s => s.id === stageId)?.name ?? "Unknown Stage",
            fee: feeObj?.fee ? parseFloat(feeObj.fee) : 0
          });
        });
        await Promise.all(stageFeesPromises);
      }

      setOpen(false);
      toast.success('Project successfully created!');
      setForm({
        code: "", name: "", manager: "", country: "",
        profit: "", avgRate: "", status: "", office: "", stages: [],
        stageFees: {}
      });
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
