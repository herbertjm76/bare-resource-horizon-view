
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <ScrollArea className="flex-1 overflow-y-auto max-h-[calc(90vh-200px)] p-6">
      <div className="space-y-6">
        <ProjectInfoTabContent 
          form={form}
          managers={managers}
          countries={countries}
          offices={offices}
          officeStages={officeStages}
          updateStageApplicability={updateStageApplicability}
          handleChange={handleChange}
        />

        <ProjectStageFeesTabContent 
          form={form}
          officeStages={officeStages}
          updateStageFee={updateStageFee}
          isDataLoaded={isDataLoaded}
        />

        <ProjectFinancialTabContent />
      </div>
    </ScrollArea>
  );
};
