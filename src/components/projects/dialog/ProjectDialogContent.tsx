
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { ProjectInfoTabContent } from "./tabs/ProjectInfoTabContent";
import { ProjectStageFeesTabContent } from "./tabs/ProjectStageFeesTabContent";
import { ProjectFinancialTabContent } from "./tabs/ProjectFinancialTabContent";

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
    <div className="flex-1 overflow-hidden">
      <TabsContent value="info" className="mt-0">
        <ScrollArea className="h-[400px] px-6">
          <ProjectInfoTabContent 
            form={form}
            managers={managers}
            countries={countries}
            offices={offices}
            officeStages={officeStages}
            updateStageApplicability={updateStageApplicability}
            handleChange={handleChange}
          />
        </ScrollArea>
      </TabsContent>

      <TabsContent value="stageFees" className="mt-0">
        <ScrollArea className="h-[400px] px-6">
          <ProjectStageFeesTabContent 
            form={form}
            officeStages={officeStages}
            updateStageFee={updateStageFee}
            isDataLoaded={isDataLoaded}
          />
        </ScrollArea>
      </TabsContent>

      <TabsContent value="financial" className="mt-0">
        <ScrollArea className="h-[400px] px-6">
          <ProjectFinancialTabContent />
        </ScrollArea>
      </TabsContent>
    </div>
  );
};
