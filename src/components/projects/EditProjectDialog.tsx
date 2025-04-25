
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
  const isMobile = useIsMobile();
  
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
    if (isLoading || !company) return;
    
    await handleSubmit({ 
      ...form, 
      officeStages,
      company_id: company.id
    }, setIsLoading);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "max-w-2xl",
          isMobile 
            ? "w-[95vw] max-h-[95vh] overflow-hidden" 
            : "w-full max-h-[90vh]",
          "flex flex-col p-0"
        )}
      >
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl">Edit Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="flex flex-col flex-1 overflow-hidden"
          >
            <TabsList className="w-full grid grid-cols-3 px-6">
              <TabsTrigger value="info">Project Info</TabsTrigger>
              <TabsTrigger value="stageFees">Stage Fees</TabsTrigger>
              <TabsTrigger value="financial">Financial Info</TabsTrigger>
            </TabsList>

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
                  />
                </TabsContent>

                <TabsContent value="financial" className="mt-0">
                  <div className="py-8 text-center text-muted-foreground">
                    Financial project info coming soon.
                  </div>
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
          
          <div className="flex justify-end gap-4 p-6 border-t sticky bottom-0 bg-background">
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
