
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProjectInfoTab } from "./ProjectTabs/ProjectInfoTab";
import { ProjectStageFeesTab } from "./ProjectTabs/ProjectStageFeesTab";
import { toast } from "sonner";
import { useCompany } from '@/context/CompanyContext';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface EditProjectDialogProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const EditProjectDialog: React.FC<EditProjectDialogProps> = ({
  project,
  isOpen,
  onClose,
  refetch
}) => {
  const [activeTab, setActiveTab] = useState("info");
  const { company } = useCompany();
  const [isLoading, setIsLoading] = useState(false);
  const [managers, setManagers] = useState<Array<{ id: string; name: string }>>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [offices, setOffices] = useState<Array<{ id: string; city: string; country: string; code?: string; emoji?: string }>>([]);
  const [officeStages, setOfficeStages] = useState<Array<{ id: string; name: string }>>([]);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const [form, setForm] = useState({
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
  });

  useEffect(() => {
    const fetchFormOptions = async () => {
      if (!company || !company.id) return;
      
      try {
        // Fetch managers
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

        // Fetch project areas for countries
        const { data: areas } = await supabase
          .from('project_areas')
          .select('name')
          .eq('company_id', company.id);

        setCountries(Array.from(new Set(
          Array.isArray(areas) ? areas.map(a => a.name).filter(Boolean) : []
        )));

        // Fetch offices
        const { data: locs } = await supabase
          .from('office_locations')
          .select('id, city, country, code, emoji')
          .eq('company_id', company.id);

        setOffices(Array.isArray(locs) ? locs : []);

        // Fetch stages
        const { data: stages } = await supabase
          .from('office_stages')
          .select('id, name')
          .eq('company_id', company.id);

        setOfficeStages(Array.isArray(stages) ? stages : []);

        // Fetch existing stage fees
        const { data: existingStages } = await supabase
          .from('project_stages')
          .select('*')
          .eq('project_id', project.id);

        if (Array.isArray(existingStages)) {
          const stageIds = existingStages.map(stage => {
            const matchingStage = stages?.find(s => s.name === stage.stage_name);
            return matchingStage?.id;
          }).filter(Boolean) as string[];

          const stageFees: Record<string, any> = {};
          existingStages.forEach(stage => {
            const matchingStage = stages?.find(s => s.name === stage.stage_name);
            if (matchingStage) {
              stageFees[matchingStage.id] = {
                fee: stage.fee?.toString() || '',
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
            stages: stageIds,
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
  }, [company, isOpen, project.id]);

  const handleChange = (key: keyof typeof form, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (formErrors[key]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const updateStageFee = (stageId: string, data: Partial<typeof form['stageFees'][string]>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      // Update project details
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          code: form.code,
          name: form.name,
          project_manager_id: form.manager === 'not_assigned' ? null : form.manager,
          office_id: form.office,
          status: form.status,
          country: form.country,
          current_stage: form.current_stage,
          target_profit_percentage: form.profit ? Number(form.profit) : null
        })
        .eq('id', project.id);

      if (projectError) throw projectError;

      // Handle stage fees
      const { data: existingStages } = await supabase
        .from('project_stages')
        .select('id, stage_name')
        .eq('project_id', project.id);

      // Delete existing stages that are no longer selected
      if (existingStages) {
        const stagesToDelete = existingStages.filter(stage => {
          const matchingStage = officeStages.find(s => s.name === stage.stage_name);
          return !form.stages.includes(matchingStage?.id || '');
        });

        if (stagesToDelete.length) {
          await supabase
            .from('project_stages')
            .delete()
            .in('id', stagesToDelete.map(s => s.id));
        }
      }

      // Update or insert stage fees
      const stagePromises = form.stages.map(stageId => {
        const stageName = officeStages.find(s => s.id === stageId)?.name;
        if (!stageName) return null;

        const feeData = form.stageFees[stageId];
        const existingStage = existingStages?.find(s => s.stage_name === stageName);

        if (existingStage) {
          return supabase
            .from('project_stages')
            .update({
              fee: feeData?.fee ? parseFloat(feeData.fee) : 0
            })
            .eq('id', existingStage.id);
        } else {
          return supabase
            .from('project_stages')
            .insert({
              project_id: project.id,
              company_id: company?.id,
              stage_name: stageName,
              fee: feeData?.fee ? parseFloat(feeData.fee) : 0
            });
        }
      });

      await Promise.all(stagePromises.filter(Boolean));

      toast.success('Project updated successfully');
      refetch();
      onClose();
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Edit Project
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                statusOptions={[
                  { label: "Not started", value: "Planning" },
                  { label: "On-going", value: "In Progress" },
                  { label: "Completed", value: "Complete" },
                  { label: "On hold", value: "On Hold" }
                ]}
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
          <div className="flex justify-end mt-8 gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
