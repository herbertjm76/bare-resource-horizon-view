
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
      </DialogHeader>
      
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Project Info</TabsTrigger>
          <TabsTrigger value="stageFees">Stage Fees</TabsTrigger>
        </TabsList>

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
      </Tabs>

      <ProjectDialogActions 
        isLoading={isLoading}
        onClose={handleClose}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};
