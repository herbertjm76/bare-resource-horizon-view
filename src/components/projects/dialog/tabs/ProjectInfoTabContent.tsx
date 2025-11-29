
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { ProjectInfoTab } from "../../ProjectTabs/ProjectInfoTab";
import { useOfficeSettings } from '@/context/OfficeSettingsContext';

interface ProjectInfoTabContentProps {
  form: any;
  managers: Array<{ id: string; name: string }>;
  countries: string[];
  offices: Array<{ id: string; city: string; country: string; code?: string; emoji?: string }>;
  officeStages: Array<{ id: string; name: string; color?: string }>;
  departments: Array<{ id: string; name: string }>;
  updateStageApplicability: (stageId: string, isChecked: boolean) => void;
  handleChange: (key: string, value: any) => void;
  projectId?: string;
}

export const ProjectInfoTabContent: React.FC<ProjectInfoTabContentProps> = ({
  form,
  managers,
  countries,
  offices,
  officeStages,
  departments,
  updateStageApplicability,
  handleChange,
  projectId,
}) => {
  const { project_statuses } = useOfficeSettings();

  // Convert custom statuses to options format
  const statusOptions = project_statuses.map(status => ({
    label: status.name,
    value: status.name
  }));

  return (
    <TabsContent value="info" className="mt-0 space-y-6">
      <ProjectInfoTab 
        form={form} 
        managers={managers}
        countries={countries}
        offices={offices}
        officeStages={officeStages}
        departments={departments}
        updateStageApplicability={updateStageApplicability}
        statusOptions={statusOptions}
        onChange={handleChange}
        projectId={projectId}
      />
    </TabsContent>
  );
};
