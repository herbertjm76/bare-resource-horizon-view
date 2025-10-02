import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectDialogTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const ProjectDialogTabs: React.FC<ProjectDialogTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <TabsList className="w-full px-6">
      <TabsTrigger value="info">Project Info</TabsTrigger>
      {/* Stage Fees tab hidden for MVP */}
      {/* <TabsTrigger value="stageFees">Stage Fees</TabsTrigger> */}
    </TabsList>
  );
};
