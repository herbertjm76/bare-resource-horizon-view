
import React from 'react';
import { useProjectForm } from '../hooks/useProjectForm';
import { ProjectDialogContent } from './ProjectDialogContent';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectDialogActions } from './ProjectDialogActions';
import { submitNewProject } from './NewProjectSubmit';
import { useCompany } from '@/context/CompanyContext';
import { useOfficeSettings } from '@/context/officeSettings/useOfficeSettings';

interface NewProjectDialogContentProps {
  onSuccess?: () => void;
}

export const NewProjectDialogContent: React.FC<NewProjectDialogContentProps> = ({
  onSuccess
}) => {
  const { company } = useCompany();
  const { departments } = useOfficeSettings();
  const {
    form,
    isLoading,
    setIsLoading,
    managers,
    countries,
    offices,
    officeStages,
    updateStageApplicability,
    updateStageFee,
    handleChange
  } = useProjectForm(null, true, null); // Fixed: Added required arguments

  const handleFormSubmit = async () => {
    if (!company?.id) return false;
    
    setIsLoading(true);
    try {
      const success = await submitNewProject(
        form,
        company.id,
        officeStages,
        onSuccess
      );
      return success;
    } catch (error) {
      console.error('Error submitting project:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create New Project</DialogTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Fill in the basic information to create a project. You can add more details later.
        </p>
      </DialogHeader>
      
      <ProjectDialogContent
        form={form}
        managers={managers}
        countries={countries}
        offices={offices}
        officeStages={officeStages}
        departments={departments}
        updateStageApplicability={updateStageApplicability}
        updateStageFee={updateStageFee}
        handleChange={handleChange}
        isDataLoaded={true}
        onSuccess={onSuccess}
      />

      <ProjectDialogActions 
        isLoading={isLoading}
        onClose={handleClose}
        onSubmit={handleFormSubmit}
        submitLabel="Create Project"
      />
    </>
  );
};
