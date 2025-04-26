
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProjectInfoTab } from "../ProjectTabs/ProjectInfoTab";
import { ProjectStageFeesTab } from "../ProjectTabs/ProjectStageFeesTab";

interface ProjectDialogContentProps {
  form: any;
  managers: Array<{ id: string; name: string }>;
  countries: string[];
  offices: Array<{ id: string; city: string; country: string; code?: string; emoji?: string }>;
  officeStages: Array<{ id: string; name: string; color?: string }>;
  updateStageApplicability: (stageId: string, isChecked: boolean) => void;
  updateStageFee: (stageId: string, data: any) => void;
  handleChange: (key: string, value: any) => void;
  isDataLoaded: boolean;
}

export const ProjectDialogContent: React.FC<ProjectDialogContentProps> = ({
  form,
  managers,
  countries,
  offices,
  officeStages,
  updateStageApplicability,
  updateStageFee,
  handleChange,
  isDataLoaded,
}) => {
  return (
    <ScrollArea className="flex-1 overflow-y-auto max-h-[calc(90vh-200px)] p-6">
      <div className="space-y-6">
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
          />
        </TabsContent>

        <TabsContent value="stageFees" className="mt-0">
          <ProjectStageFeesTab 
            form={form}
            officeStages={officeStages}
            updateStageFee={updateStageFee}
            isDataLoaded={isDataLoaded}
          />
        </TabsContent>

        <TabsContent value="financial" className="mt-0">
          <div className="py-8 text-center text-muted-foreground">
            Financial project info coming soon.
          </div>
        </TabsContent>
      </div>
    </ScrollArea>
  );
};

