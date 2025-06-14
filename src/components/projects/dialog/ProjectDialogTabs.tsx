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
    <TabsList className="w-full grid grid-cols-2 px-6">
      <TabsTrigger value="info">Project Info</TabsTrigger>
      <TabsTrigger value="stageFees">Stage Fees</TabsTrigger>
    </TabsList>
  );
};
