
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
import { toast } from "sonner";

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
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch complete project data with all related information
  useEffect(() => {
    if (isOpen && project?.id) {
      const fetchCompleteProject = async () => {
        try {
          setIsLoading(true);
          console.log('Fetching complete project data for:', project.id);
          
          // Get full project data
          const { data: projectData, error } = await supabase
            .from('projects')
            .select(`
              *,
              project_manager:project_manager_id (id, first_name, last_name),
              office:office_id (id, name, country)
            `)
            .eq('id', project.id)
            .single();
          
          if (error) {
            console.error('Error fetching project details:', error);
            toast.error("Failed to load project details");
            setIsLoading(false);
            return;
          }
          
          if (projectData) {
            console.log('Complete project data loaded:', projectData);
            setLoadedProject(projectData);
          }
        } catch (err) {
          console.error('Error in fetchCompleteProject:', err);
          toast.error("Error loading project data");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchCompleteProject();
    }
  }, [isOpen, project?.id]);
  
  const processProjectStages = (project, officeStages) => {
    if (!project || !project.stages || !officeStages || officeStages.length === 0) {
      return project;
    }

    // If stages are already IDs, return as is
    if (project.stages.length > 0 && typeof project.stages[0] === 'string') {
      const firstStage = project.stages[0];
      if (officeStages.some(s => s.id === firstStage)) {
        console.log('Project stages are already IDs:', project.stages);
        return project;
      }
    }

    console.log('Converting stage names to IDs:', project.stages);
    
    // Map stage names to IDs
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
    isLoading: formLoading,
    setIsLoading: setFormLoading,
    managers,
    countries,
    offices,
    officeStages,
    handleChange,
    updateStageFee,
    updateStageApplicability,
    isDataLoaded
  } = useProjectForm(loadedProject, isOpen);

  useEffect(() => {
    if (isOpen && loadedProject && officeStages && officeStages.length > 0) {
      const processedProject = processProjectStages(loadedProject, officeStages);
      console.log('EditProjectDialog - processed project stages:', processedProject.stages);
      
      if (processedProject.stages && processedProject.stages.length > 0) {
        handleChange('stages', processedProject.stages);
      }
    }
  }, [isOpen, loadedProject, officeStages, handleChange]);
  
  // Debug stage fees data when form changes
  useEffect(() => {
    if (form && form.stageFees) {
      console.log("Current stage fees in form:", form.stageFees);
      console.log("Stage fees keys:", Object.keys(form.stageFees));
    }
  }, [form, form?.stageFees]);

  const { handleSubmit } = useProjectSubmit(loadedProject?.id, refetch, onClose);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formLoading || !company) return;
    
    console.log("Submitting form with stageFees:", form.stageFees);
    await handleSubmit({ 
      ...form, 
      officeStages
    }, setFormLoading);
  };

  // Show loading state if we're loading the project or form data
  const dialogLoading = isLoading || formLoading;

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
        
        {dialogLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="ml-2">Loading project data...</span>
          </div>
        )}
        
        {!dialogLoading && (
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
                isDataLoaded={isDataLoaded}
              />
            </Tabs>
            
            <ProjectDialogActions 
              isLoading={formLoading}
              onClose={onClose}
            />
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

