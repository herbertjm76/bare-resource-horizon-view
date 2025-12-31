
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { ProjectStageFeesTab } from "../../ProjectTabs/ProjectStageFeesTab";
import { logger } from '@/utils/logger';

interface ProjectStageFeesTabContentProps {
  form: any;
  officeStages: Array<{ id: string; name: string; color?: string }>;
  updateStageFee: (stageId: string, data: any) => void;
  isDataLoaded: boolean;
}

export const ProjectStageFeesTabContent: React.FC<ProjectStageFeesTabContentProps> = ({
  form,
  officeStages,
  updateStageFee,
  isDataLoaded,
}) => {
  logger.debug("ProjectStageFeesTabContent - form stageFees:", form.stageFees);
  logger.debug("ProjectStageFeesTabContent - isDataLoaded:", isDataLoaded);
  
  return (
    <TabsContent value="stageFees" className="mt-0">
      <ProjectStageFeesTab 
        form={form}
        officeStages={officeStages}
        updateStageFee={updateStageFee}
        isDataLoaded={isDataLoaded}
      />
    </TabsContent>
  );
};
