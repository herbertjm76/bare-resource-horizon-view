
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { ProjectInfoTab } from "../../ProjectTabs/ProjectInfoTab";

interface ProjectInfoTabContentProps {
  form: any;
  managers: Array<{ id: string; name: string }>;
  countries: string[];
  offices: Array<{ id: string; city: string; country: string; code?: string; emoji?: string }>;
  officeStages: Array<{ id: string; name: string; color?: string }>;
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
  updateStageApplicability,
  handleChange,
  projectId,
}) => {
  return (
    <TabsContent value="info" className="mt-0 space-y-6">
      <ProjectInfoTab 
        form={form} 
        managers={managers}
        countries={countries}
        offices={offices}
        officeStages={officeStages}
        updateStageApplicability={updateStageApplicability}
        statusOptions={[
          { label: "Not started", value: "Planning" },
          { label: "On-going", value: "In Progress" },
          { label: "Completed", value: "Complete" },
          { label: "On hold", value: "On Hold" }
        ]}
        onChange={handleChange}
        projectId={projectId}
      />
    </TabsContent>
  );
};
