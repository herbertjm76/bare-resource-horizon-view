
import React, { useState, useEffect } from "react";
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
import { useCompany } from '@/context/CompanyContext';

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
  const { company } = useCompany();
  
  useEffect(() => {
    // When dialog opens, log the project data to verify stage colors are present
    if (isOpen && project) {
      console.log('EditProjectDialog - Project data:', project);
      console.log('EditProjectDialog - Project stages:', project.stages);
    }
  }, [isOpen, project]);
  
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
  
  useEffect(() => {
    // Log office stages to verify colors are being passed correctly
    if (officeStages?.length) {
      console.log('EditProjectDialog - Office stages with colors:', officeStages);
    }
  }, [officeStages]);

  const { handleSubmit } = useProjectSubmit(project.id, refetch, onClose);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !company) return;
    
    console.log('Submitting form with company context:', company.id);
    console.log('Form data:', form);
    console.log('Selected stages and applicability:', form.stages, form.stageApplicability);
    
    // Pass the entire form data including the company context
    await handleSubmit({ 
      ...form, 
      officeStages,
      company_id: company.id
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
