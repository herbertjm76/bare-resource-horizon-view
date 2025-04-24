
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProjectInfoTab } from "./ProjectTabs/ProjectInfoTab";
import { ProjectStageFeesTab } from "./ProjectTabs/ProjectStageFeesTab";
import { Button } from "@/components/ui/button";
import { useProjectForm } from "./hooks/useProjectForm";
import { useProjectSubmit } from "./hooks/useProjectSubmit";

interface EditProjectDialogProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const EditProjectDialog: React.FC<EditProjectDialogProps> = ({
  project,
  isOpen,
  onClose,
  refetch
}) => {
  const [activeTab, setActiveTab] = useState("info");
  
  const {
    form,
    isLoading,
    setIsLoading,
    managers,
    countries,
    offices,
    officeStages,
    handleChange,
    updateStageFee,
    updateStageApplicability
  } = useProjectForm(project, isOpen);

  const { handleSubmit } = useProjectSubmit(project.id, refetch, onClose);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    console.log('Submitting form:', form);
    console.log('Selected stages and applicability:', form.stages, form.stageApplicability);
    
    // Get stage names from selected stage IDs
    const selectedStageNames = form.stages.map(stageId => {
      const stage = officeStages.find(os => os.id === stageId);
      return stage ? stage.name : '';
    }).filter(Boolean);

    await handleSubmit({ 
      ...form, 
      stages: selectedStageNames,  // Pass selected stage names to submit handler
      officeStages 
    }, setIsLoading);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="info">Project Info</TabsTrigger>
              <TabsTrigger value="stageFees">Stage Fees</TabsTrigger>
              <TabsTrigger value="financial">Financial Info</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
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

            <TabsContent value="stageFees">
              <ProjectStageFeesTab 
                form={form}
                officeStages={officeStages}
                updateStageFee={updateStageFee}
              />
            </TabsContent>

            <TabsContent value="financial">
              <div className="py-8 text-center text-muted-foreground">
                Financial project info coming soon.
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end mt-8 gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
