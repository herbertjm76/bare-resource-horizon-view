
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
import { toast } from "sonner";
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
  const [form, setForm] = useState({
    code: project.code || "",
    name: project.name || "",
    manager: project.project_manager?.id || "",
    country: project.country || "",
    profit: project.target_profit_percentage?.toString() || "",
    avgRate: "",
    status: project.status || "",
    office: project.office?.id || "",
    current_stage: project.current_stage || "",
    stages: [],
    stageFees: {},
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Edit Project
          </DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="info">Project Info</TabsTrigger>
            <TabsTrigger value="stageFees">Stage Fees</TabsTrigger>
            <TabsTrigger value="financial">Financial Info</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <ProjectInfoTab 
              form={form} 
              managers={[]}
              countries={[]}
              offices={[]}
              officeStages={[]}
              statusOptions={[]}
              onChange={() => {}}
            />
          </TabsContent>

          <TabsContent value="stageFees">
            <ProjectStageFeesTab 
              form={form}
              officeStages={[]}
              updateStageFee={() => {}}
            />
          </TabsContent>

          <TabsContent value="financial">
            <div className="py-8 text-center text-muted-foreground">
              Financial project info coming soon.
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
