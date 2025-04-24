
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

interface StageFee {
  fee: string;
  billingMonth: string;
  status: "Not Billed" | "Invoiced" | "Paid" | "";
  invoiceDate: Date | null;
  hours: string;
  invoiceAge: number;
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
    stages: [] as string[],
    stageFees: {} as Record<string, StageFee>,
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

        // Fetch the project stages for this specific project
        const { data: projectStages } = await supabase
          .from('project_stages')
          .select('stage_name, fee')
          .eq('project_id', project.id);

        console.log("Found project stages:", projectStages);
        
        // Also check if project has a current stage
        const currentStageName = project.current_stage;
        console.log("Current stage from project:", currentStageName);

        let stageIds: string[] = [];
        
        // If we have a current stage, make sure it's in our stages array
        if (currentStageName) {
          const matchingStage = stagesArray.find(s => s.name === currentStageName);
          if (matchingStage) {
            stageIds.push(matchingStage.id);
            console.log(`Found matching stage for current stage ${currentStageName}:`, matchingStage.id);
          }
        }

        // Add any other stages from project_stages
        if (Array.isArray(projectStages) && projectStages.length > 0) {
          // Map stage names to stage IDs
          projectStages.forEach(ps => {
            const matchingStage = stagesArray.find(s => s.name === ps.stage_name);
            if (matchingStage && !stageIds.includes(matchingStage.id)) {
              stageIds.push(matchingStage.id);
            }
          });

          console.log("Final mapped stage IDs:", stageIds);
          console.log("Available office stages:", stagesArray);

          const stageFees: Record<string, StageFee> = {};
          projectStages.forEach(ps => {
            const matchingStage = stagesArray.find(s => s.name === ps.stage_name);
            if (matchingStage) {
              stageFees[matchingStage.id] = {
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
            stages: stageIds,
            stageFees
          }));
        } else if (stageIds.length > 0) {
          // If we have stages from the current stage but no project_stages entries
          console.log("No project stages found, but using current stage:", stageIds);
          
          const stageFees: Record<string, StageFee> = {};
          stageIds.forEach(id => {
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
            stages: stageIds,
            stageFees
          }));
        } else {
          console.log("No project stages or current stage found for project:", project.id);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
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

      const { data: existingStages } = await supabase
        .from('project_stages')
        .select('id, stage_name')
        .eq('project_id', project.id);

      console.log("Current stages in form:", form.stages);
      console.log("Existing stages in DB:", existingStages);

      if (existingStages && existingStages.length > 0) {
        const stagesToKeep = new Set();
        
        for (const stageId of form.stages) {
          const stageName = officeStages.find(s => s.id === stageId)?.name;
          if (stageName) {
            const existingStage = existingStages.find(s => s.stage_name === stageName);
            if (existingStage) {
              stagesToKeep.add(existingStage.id);
            }
          }
        }
        
        const stagesToDelete = existingStages
          .filter(stage => !stagesToKeep.has(stage.id))
          .map(stage => stage.id);
        
        if (stagesToDelete.length > 0) {
          console.log("Deleting stages:", stagesToDelete);
          const { error } = await supabase
            .from('project_stages')
            .delete()
            .in('id', stagesToDelete);
            
          if (error) {
            console.error("Error deleting stages:", error);
          }
        }
      }

      for (const stageId of form.stages) {
        const stageName = officeStages.find(s => s.id === stageId)?.name;
        if (!stageName) continue;
        
        const feeData = form.stageFees[stageId];
        const existingStage = existingStages?.find(s => s.stage_name === stageName);
        
        if (existingStage) {
          await supabase
            .from('project_stages')
            .update({
              fee: feeData?.fee ? parseFloat(feeData.fee) : 0
            })
            .eq('id', existingStage.id);
        } else {
          await supabase
            .from('project_stages')
            .insert({
              project_id: project.id,
              company_id: company?.id,
              stage_name: stageName,
              fee: feeData?.fee ? parseFloat(feeData.fee) : 0
            });
        }
      }

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
