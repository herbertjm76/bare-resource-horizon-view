
import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { useProjectForm } from "./hooks/useProjectForm";
import { useProjectSubmit } from "./hooks/useProjectSubmit";
import { useCompany } from '@/context/CompanyContext';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EditProjectContent } from "./dialog/EditProjectContent";

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
  const [loadedProject, setLoadedProject] = useState(project);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (isOpen && project?.id) {
      const fetchCompleteProject = async () => {
        try {
          setIsLoading(true);
          console.log('Fetching complete project data for:', project.id);
          
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

  const {
    form,
    isLoading: formLoading,
    setIsLoading: setFormLoading,
    managers,
    countries,
    offices,
    officeStages,
    updateStageApplicability,
    updateStageFee,
    handleChange,
    isDataLoaded
  } = useProjectForm(loadedProject, isOpen);

  const { handleSubmit } = useProjectSubmit(loadedProject?.id, refetch, onClose);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formLoading || !company) return;
    
    await handleSubmit({ 
      ...form, 
      officeStages
    }, setFormLoading);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <EditProjectContent 
        isLoading={isLoading || formLoading}
        form={form}
        managers={managers}
        countries={countries}
        offices={offices}
        officeStages={officeStages}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        updateStageApplicability={updateStageApplicability}
        updateStageFee={updateStageFee}
        handleChange={handleChange}
        isDataLoaded={isDataLoaded}
        onClose={onClose}
        onSubmit={onSubmit}
        projectId={loadedProject?.id}
      />
    </Dialog>
  );
};
