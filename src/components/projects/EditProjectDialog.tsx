
import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { useProjectForm } from "./hooks/useProjectForm";
import { useProjectSubmit } from "./hooks/useProjectSubmit";
import { useCompany } from '@/context/CompanyContext';
import { useOfficeSettings } from '@/context/officeSettings/useOfficeSettings';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EditProjectContent } from "./dialog/EditProjectContent";
import { logger } from '@/utils/logger';

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
  const { departments } = useOfficeSettings();
  const [loadedProject, setLoadedProject] = useState(project);
  const [isLoading, setIsLoading] = useState(false);

  // Add a refetch signal for fee/stage data (just a counter)
  const [refetchSignal, setRefetchSignal] = useState(0);

  // FIX: Add refetchSignal as a dependency to reload the latest project data after submit
  useEffect(() => {
    if (isOpen && project?.id) {
      const fetchCompleteProject = async () => {
        try {
          setIsLoading(true);
          logger.debug('Fetching complete project data for:', project.id);
          
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
            logger.debug('Complete project data loaded:', projectData);
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
  // FIX: include refetchSignal so the latest project data is fetched after saving
  }, [isOpen, project?.id, refetchSignal]);

  // Pass the refetchSignal to useProjectForm, so all sub-hooks can use it if needed:
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
    handleChange
    // REMOVED: isDataLoaded
  } = useProjectForm(loadedProject, isOpen, refetchSignal);

  // Pass setRefetchSignal so downstream hooks can trigger a refresh after submit
  const { handleSubmit } = useProjectSubmit(loadedProject?.id, refetch, onClose, () => {
    // bump the signal to refetch stage fee data after submit
    setRefetchSignal(sig => sig + 1);
  });

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
        departments={departments}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        updateStageApplicability={updateStageApplicability}
        updateStageFee={updateStageFee}
        handleChange={handleChange}
        // Provide default value as removed from hook
        isDataLoaded={true}
        onClose={onClose}
        onSubmit={onSubmit}
        projectId={loadedProject?.id}
      />
    </Dialog>
  );
};
