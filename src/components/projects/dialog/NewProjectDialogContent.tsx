import React from 'react';
import { useProjectForm } from '../hooks/useProjectForm';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProjectDialogActions } from './ProjectDialogActions';
import { submitNewProject } from './NewProjectSubmit';
import { useCompany } from '@/context/CompanyContext';
import { OfficeSettingsProvider } from '@/context/officeSettings/OfficeSettingsContext';
import { useOfficeSettings } from '@/context/officeSettings/useOfficeSettings';
import { NewProjectForm } from './NewProjectForm';

interface NewProjectDialogContentProps {
  onSuccess?: () => void;
}

// Inner component that uses the office settings context
const NewProjectDialogInner: React.FC<NewProjectDialogContentProps> = ({
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
  } = useProjectForm(null, true, null);

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
    <div className="flex flex-col">
      <DialogHeader className="pb-4 border-b border-border/50">
        <DialogTitle className="text-xl font-semibold">New Project</DialogTitle>
      </DialogHeader>
      
      <NewProjectForm
        form={form}
        managers={managers}
        countries={countries}
        offices={offices}
        officeStages={officeStages}
        departments={departments}
        updateStageApplicability={updateStageApplicability}
        handleChange={handleChange}
      />

      <ProjectDialogActions 
        isLoading={isLoading}
        onClose={handleClose}
        onSubmit={handleFormSubmit}
        submitLabel="Create Project"
      />
    </div>
  );
};

// Wrapper component that provides the OfficeSettingsProvider
export const NewProjectDialogContent: React.FC<NewProjectDialogContentProps> = (props) => {
  return (
    <OfficeSettingsProvider>
      <NewProjectDialogInner {...props} />
    </OfficeSettingsProvider>
  );
};
