
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs } from "@/components/ui/tabs";
import { useProjectForm } from "./hooks/useProjectForm";
import { useProjectSubmit } from "./hooks/useProjectSubmit";
import { useCompany } from '@/context/CompanyContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";
import { ProjectDialogTabs } from "./dialog/ProjectDialogTabs";
import { ProjectDialogContent } from "./dialog/ProjectDialogContent";
import { ProjectDialogActions } from "./dialog/ProjectDialogActions";

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
  const isMobile = useIsMobile();
  
  const {
    form,
    isLoading,
    setIsLoading,
    managers,
    countries,
    offices,
    officeStages,
    handleChange,
    updateStageFee,
    updateStageApplicability
  } = useProjectForm(project, isOpen);

  const { handleSubmit } = useProjectSubmit(project.id, refetch, onClose);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !company) return;
    
    await handleSubmit({ 
      ...form, 
      officeStages,
      company_id: company.id
    }, setIsLoading);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "max-w-2xl",
          isMobile 
            ? "w-[95vw] max-h-[95vh] overflow-hidden" 
            : "w-full max-h-[90vh]",
          "flex flex-col p-0"
        )}
      >
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl">Edit Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <ProjectDialogTabs 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            
            <ProjectDialogContent 
              form={form}
              managers={managers}
              countries={countries}
              offices={offices}
              officeStages={officeStages}
              updateStageApplicability={updateStageApplicability}
              updateStageFee={updateStageFee}
              handleChange={handleChange}
            />
          </Tabs>
          
          <ProjectDialogActions 
            isLoading={isLoading}
            onClose={onClose}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};
