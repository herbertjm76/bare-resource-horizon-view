import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { ProjectInfoTabContent } from "./tabs/ProjectInfoTabContent";
import { ProjectStageFeesTabContent } from "./tabs/ProjectStageFeesTabContent";
import { StageTeamCompositionEditor } from "../team-composition";
import { useProjectFinancialMetrics } from "../hooks/useProjectFinancialMetrics";

interface ProjectDialogContentProps {
  form: any;
  managers: Array<{ id: string; name: string }>;
  countries: string[];
  offices: Array<{ id: string; city: string; country: string; code?: string; emoji?: string }>;
  officeStages: Array<{ id: string; name: string; color?: string; code?: string }>;
  departments: Array<{ id: string; name: string }>;
  updateStageApplicability: (stageId: string, isChecked: boolean) => void;
  updateStageFee: (stageId: string, data: any) => void;
  handleChange: (key: string, value: any) => void;
  isDataLoaded: boolean;
  projectId?: string;
  onSuccess?: () => void;
  initialStageId?: string;
}

export const ProjectDialogContent: React.FC<ProjectDialogContentProps> = ({
  form,
  managers,
  countries,
  offices,
  officeStages,
  departments,
  updateStageApplicability,
  updateStageFee,
  handleChange,
  isDataLoaded,
  projectId,
  onSuccess,
  initialStageId
}) => {
  // Get stages that are selected for this project.
  // NOTE: Some older/demo flows store selected stages by *name* rather than *id*.
  const selectedStages = officeStages
    .filter((stage) =>
      form.stages?.includes(stage.id) || form.stages?.includes(stage.name)
    )
    .map((stage) => ({
      id: stage.id,
      name: stage.name,
      code: stage.code,
    }));

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
            departments={departments}
            updateStageApplicability={updateStageApplicability}
            handleChange={handleChange}
            projectId={projectId}
          />
        </ScrollArea>
      </TabsContent>

      {/* Team Composition Tab */}
      {projectId && (
        <TabsContent value="team" className="mt-0">
          <ScrollArea className="h-[400px] px-6">
            <div className="py-4">
              {selectedStages.length > 0 ? (
                <StageTeamCompositionEditor
                  projectId={projectId}
                  stages={selectedStages}
                  showBudget={true}
                  initialStageId={initialStageId}
                />
              ) : (
                <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
                  Select at least one stage in Project Info to start planning your team composition.
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      )}

      {/* Stage Fees tab content hidden for MVP */}
      {/* <TabsContent value="stageFees" className="mt-0">
        <ScrollArea className="h-[400px] px-6">
          <ProjectStageFeesTabContent 
            form={form}
            officeStages={officeStages}
            updateStageFee={updateStageFee}
            isDataLoaded={isDataLoaded}
          />
        </ScrollArea>
      </TabsContent> */}
    </div>
  );
};
