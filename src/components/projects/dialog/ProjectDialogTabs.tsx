import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from "lucide-react";

interface ProjectDialogTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  showTeamComposition?: boolean;
}

export const ProjectDialogTabs: React.FC<ProjectDialogTabsProps> = ({
  activeTab,
  onTabChange,
  showTeamComposition = false,
}) => {
  return (
    <TabsList className="w-full px-6">
      <TabsTrigger value="info">Project Info</TabsTrigger>
      {showTeamComposition && (
        <TabsTrigger value="team" className="gap-1.5">
          <Users className="h-3.5 w-3.5" />
          Team Composition
        </TabsTrigger>
      )}
      {/* Stage Fees tab hidden for MVP */}
      {/* <TabsTrigger value="stageFees">Stage Fees</TabsTrigger> */}
    </TabsList>
  );
};
