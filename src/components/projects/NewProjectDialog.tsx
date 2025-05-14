
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useCompany } from '@/context/CompanyContext';
import { Tabs } from "@/components/ui/tabs";
import { ProjectDialogContent } from "./dialog/ProjectDialogContent";
import { ProjectDialogTabs } from "./dialog/ProjectDialogTabs";
import { ProjectDialogActions } from "./dialog/ProjectDialogActions";
import { useNewProjectFormState } from "./dialog/NewProjectFormState";
import { submitNewProject } from "./dialog/NewProjectSubmit";
import { useFormOptions } from './hooks/form/useFormOptions';

const statusOptions = [
  { label: "Not started", value: "Planning" },
  { label: "On-going", value: "In Progress" },
  { label: "Completed", value: "Complete" },
  { label: "On hold", value: "On Hold" },
];

export const NewProjectDialog: React.FC<{ onProjectCreated?: () => void }> = ({ onProjectCreated }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const { company } = useCompany();
  
  const {
    form,
    setForm,
    isLoading,
    setIsLoading,
    isDataLoaded,
    handleChange
  } = useNewProjectFormState();

  const { managers, countries, offices, officeStages } = useFormOptions(company, open);

  const handleTabChange = (tab: string) => {
    if (!company?.id) return;
    
    if (tab === "stageFees" && !form.stages.length) {
      return;
    }
    setActiveTab(tab);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company?.id) return;
    
    setIsLoading(true);
    const success = await submitNewProject(form, company.id, officeStages, onProjectCreated);
    if (success) {
      setOpen(false);
      setForm({
        code: "",
        name: "",
        manager: "",
        country: "",
        profit: "",
        avgRate: "",
        currency: "USD",
        status: "",
        office: "",
        current_stage: "",
        stages: [],
        stageFees: {},
        stageApplicability: {}
      });
      setActiveTab("info");
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <ProjectDialogTabs activeTab={activeTab} onTabChange={handleTabChange} />
            <ProjectDialogContent
              form={form}
              managers={managers}
              countries={countries}
              offices={offices}
              officeStages={officeStages}
              handleChange={handleChange}
              isDataLoaded={isDataLoaded}
              updateStageApplicability={(stageId: string, isChecked: boolean) => {
                setForm(prev => ({
                  ...prev,
                  stageApplicability: {
                    ...prev.stageApplicability,
                    [stageId]: isChecked
                  }
                }));
              }}
              updateStageFee={(stageId: string, data: any) => {
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
              }}
            />
            <ProjectDialogActions
              isLoading={isLoading}
              onClose={() => setOpen(false)}
            />
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
};
