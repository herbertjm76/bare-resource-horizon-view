
import React from 'react';
import { useProjectForm } from '../hooks/useProjectForm';
import { ProjectDialogContent } from './ProjectDialogContent';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectDialogActions } from './ProjectDialogActions';

interface NewProjectDialogContentProps {
  onSuccess?: () => void;
}

export const NewProjectDialogContent: React.FC<NewProjectDialogContentProps> = ({
  onSuccess
}) => {
  const {
    form,
    managers,
    countries,
    offices,
    officeStages,
    updateStageApplicability,
    updateStageFee,
    handleChange,
    isDataLoaded,
    handleSubmit
  } = useProjectForm();

  const handleFormSubmit = async () => {
    const success = await handleSubmit();
    if (success && onSuccess) {
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
          updateStageApplicability={updateStageApplicability}
          updateStageFee={updateStageFee}
          handleChange={handleChange}
          isDataLoaded={isDataLoaded}
          onSuccess={onSuccess}
        />
      </Tabs>

      <ProjectDialogActions onSubmit={handleFormSubmit} />
    </>
  );
};
