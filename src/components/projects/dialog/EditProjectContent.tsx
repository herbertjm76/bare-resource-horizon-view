import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";
import { ProjectDialogTabs } from "./ProjectDialogTabs";
import { ProjectDialogContent } from "./ProjectDialogContent";
import { ProjectDialogActions } from "./ProjectDialogActions";
import { LoadingState } from "./LoadingState";

interface EditProjectContentProps {
  isLoading: boolean;
  form: any;
  managers: Array<{ id: string; name: string }>;
  countries: string[];
  offices: Array<{ id: string; city: string; country: string; code?: string; emoji?: string }>;
  officeStages: Array<{ id: string; name: string; color?: string; code?: string }>;
  departments: Array<{ id: string; name: string }>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  updateStageApplicability: (stageId: string, isChecked: boolean) => void;
  updateStageFee: (stageId: string, data: any) => void;
  handleChange: (key: string, value: any) => void;
  isDataLoaded: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  projectId?: string;
  initialStageId?: string;
}

export const EditProjectContent: React.FC<EditProjectContentProps> = ({
  isLoading,
  form,
  managers,
  countries,
  offices,
  officeStages,
  departments,
  activeTab,
  setActiveTab,
  updateStageApplicability,
  updateStageFee,
  handleChange,
  isDataLoaded,
  onClose,
  onSubmit,
  projectId,
  initialStageId
}) => {
  const isMobile = useIsMobile();

  return (
    <DialogContent 
      className={cn(
        "max-w-2xl",
        isMobile 
          ? "w-[95vw] max-h-[95vh]" 
          : "w-full max-h-[90vh]",
        "flex flex-col p-0"
      )}
    >
      <DialogHeader className="px-6 py-4 border-b">
        <DialogTitle className="text-xl">Edit Project</DialogTitle>
      </DialogHeader>
      
      {isLoading ? (
        <LoadingState />
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="px-6 pt-4">
              <ProjectDialogTabs 
                activeTab={activeTab}
                onTabChange={setActiveTab}
                // Show Team Composition for any existing project; the tab content handles empty state
                showTeamComposition={!!projectId}
              />
            </div>
            
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
              isDataLoaded={isDataLoaded}
              projectId={projectId}
              initialStageId={initialStageId}
            />

            <ProjectDialogActions 
              isLoading={isLoading}
              onClose={onClose}
            />
          </Tabs>
        </form>
      )}
    </DialogContent>
  );
};
