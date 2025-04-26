
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
  const isMobile = useIsMobile();
  const [loadedProject, setLoadedProject] = useState(project);
  
  // Fetch complete project data with all related information
  useEffect(() => {
    if (isOpen && project?.id) {
      const fetchCompleteProject = async () => {
        try {
          // Get full project data
          const { data: projectData, error } = await supabase
            .from('projects')
            .select(`
              *,
              project_manager:project_manager_id (id, first_name, last_name),
              office:office_id (id, city, country)
            `)
            .eq('id', project.id)
            .single();
          
          if (error) {
            console.error('Error fetching project details:', error);
            return;
          }
          
          if (projectData) {
            console.log('Complete project data loaded:', projectData);
            setLoadedProject(projectData);
          }
        } catch (err) {
          console.error('Error in fetchCompleteProject:', err);
        }
      };
      
      fetchCompleteProject();
    }
  }, [isOpen, project?.id]);
  
  const processProjectStages = (project, officeStages) => {
    if (!project || !project.stages || !officeStages || officeStages.length === 0) {
      return project;
    }

    const firstStage = project.stages[0];
    if (typeof firstStage === 'string' && officeStages.some(s => s.id === firstStage)) {
      console.log('Project stages are already IDs:', project.stages);
      return project;
    }

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
  } = useProjectForm(loadedProject, isOpen);

  useEffect(() => {
    if (isOpen && loadedProject && officeStages && officeStages.length > 0) {
      const processedProject = processProjectStages(loadedProject, officeStages);
      console.log('EditProjectDialog - processed project stages:', processedProject.stages);
      
      if (processedProject.stages.length > 0) {
        handleChange('stages', processedProject.stages);
      }
    }
  }, [isOpen, loadedProject, officeStages]);

  const { handleSubmit } = useProjectSubmit(loadedProject.id, refetch, onClose);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !company) return;
    
    await handleSubmit({ 
      ...form, 
      officeStages
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
