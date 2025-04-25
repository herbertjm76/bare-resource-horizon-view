
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
import { useCompany } from '@/context/CompanyContext';
import { X } from "lucide-react";

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
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-xl">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-[#1A1F2C]">
              Edit Project
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b">
              <TabsList className="w-full h-14 p-0 bg-transparent gap-1 justify-start pl-6">
                <TabsTrigger 
                  value="info" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-none rounded-b-none rounded-t-lg h-14 px-8"
                >
                  Project Info
                </TabsTrigger>
                <TabsTrigger 
                  value="stageFees" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-none rounded-b-none rounded-t-lg h-14 px-8"
                >
                  Stage Fees
                </TabsTrigger>
                <TabsTrigger 
                  value="financial" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-none rounded-b-none rounded-t-lg h-14 px-8"
                >
                  Financial Info
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="px-6">
              <TabsContent value="info" className="mt-0 pt-4">
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

              <TabsContent value="stageFees" className="mt-0 pt-4">
                <ProjectStageFeesTab 
                  form={form}
                  officeStages={officeStages}
                  updateStageFee={updateStageFee}
                />
              </TabsContent>

              <TabsContent value="financial" className="mt-0 pt-4">
                <div className="py-12 text-center text-muted-foreground">
                  <p className="text-lg">Financial project info coming soon.</p>
                  <p className="text-sm mt-2">This feature is under development.</p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
          
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="px-6"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
