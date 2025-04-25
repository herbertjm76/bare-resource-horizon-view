
import React, { useState, useEffect } from "react";
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
  
  // Map stage names to stage IDs if project stages are strings (names)
  const processProjectStages = (project, officeStages) => {
    if (!project || !project.stages || !officeStages || officeStages.length === 0) {
      return project;
    }

    // Check if project stages are already IDs
    const firstStage = project.stages[0];
    if (typeof firstStage === 'string' && officeStages.some(s => s.id === firstStage)) {
      // Stages are already IDs, no need to convert
      console.log('Project stages are already IDs:', project.stages);
      return project;
    }

    // Map stage names to stage IDs
    console.log('Converting stage names to IDs:', project.stages);
    const processedProject = {
      ...project,
      stages: project.stages.map(stageName => {
        const stage = officeStages.find(s => s.name === stageName);
        return stage ? stage.id : null;
      }).filter(stageId => stageId !== null)
    };

    console.log('Processed stages:', processedProject.stages);
    return processedProject;
  };

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

  // Process stages when officeStages are available
  useEffect(() => {
    if (isOpen && project && officeStages && officeStages.length > 0) {
      const processedProject = processProjectStages(project, officeStages);
      console.log('EditProjectDialog - processed project stages:', processedProject.stages);
      
      // Update form stages with processed stages
      if (processedProject.stages.length > 0) {
        handleChange('stages', processedProject.stages);
      }
    }
  }, [isOpen, project, officeStages]);

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
